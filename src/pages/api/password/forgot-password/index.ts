import ERRORS from "@/util/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/db";
import ShortUniqueId from "short-unique-id";

import { HandlerFunction } from "@/types/global";
import { sendMail } from "@/util/api/email";
const Otp = new ShortUniqueId();
Otp.setDictionary("number");

const addOtpToDb = async (email: string, _otp: string) => {
  const checkIfRecord = await prisma.otp.findMany({
    where: { email, is_expired: false },
    take: 1,
  });

  if (checkIfRecord && checkIfRecord.length > 0) {
    await prisma.otp.updateMany({
      where: {
        email,
        is_expired: false,
      },
      data: {
        is_expired: true,
        expire_at: new Date(),
      },
    });
  }
  const now = new Date();
  const plusOneHr = new Date(now.setHours(now.getHours() + 1));

  const data = await prisma.otp.create({
    data: {
      email,
      otp: _otp,
      created_at: now,
      expire_at: plusOneHr,
    },
  });

  return data;
};

const sendOtp = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body as { email: string };

  if (!email) {
    res.status(500).json({
      success: false,
      description: "Email is required!",
    });
  }

  const emailValidation = await prisma.user.findFirst({ where: { email } });
  if (!emailValidation) {
    return res.status(ERRORS["NOT_FOUND"].status).json({
      success: false,
      message: ERRORS["NOT_FOUND"].message,
      description: "User doesn't exists with this email!",
    });
  }

  const genOtp = Otp.rnd(6);

  //sending otp using trasnporter

  try {
    const data = {
      to: [email],
      html: `<p>${genOtp}</p>`,
      subject: "OTP to reset your password",
      type: "forgot_password_otp",
      order_id: null,
      teen_detail_id: null,
      invoice_id: null,
    };
    await sendMail(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      description: "couldn't send email!",
    });
  }

  await addOtpToDb(email, genOtp);
  return res.status(200).json({
    success: true,
    description: "otp sent!",
  });
};
const verifyOtp = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, otp } = req.query as { email: string; otp: string };

  if (!email || !otp) {
    return res.status(500).json({
      success: false,
      description: "Email and OTP both are required!",
    });
  }
  const fetchOtpRecord = await prisma.otp.findFirst({
    orderBy: {
      created_at: "desc",
    },
    where: {
      otp,
      email,
      is_expired: false,
    },
  });

  if (!fetchOtpRecord) {
    return res.status(ERRORS["NOT_FOUND"].status).json({
      success: false,
      message: ERRORS["NOT_FOUND"].message,
      description: "Wrong OTP!",
    });
  }
  const timeValidation =
    new Date().getTime() < new Date(fetchOtpRecord?.expire_at).getTime();

  if (!timeValidation) {
    return res.status(400).json({
      success: false,
      description: "Otp expired!",
    });
  }

  const _user = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  });

  return res.status(200).json({
    success: true,
    description: "OTP verified!",
    data: _user?.id,
  });
};

const METHOD_HANDLERS: Record<string, HandlerFunction> = {
  GET: verifyOtp,
  POST: sendOtp,
};

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handle = METHOD_HANDLERS[req.method as string];
  if (handle) {
    return handle(req, res);
  } else {
    return res.status(ERRORS["NOT_FOUND"].status).json({
      success: false,
      message: ERRORS["NOT_FOUND"].message,
    });
  }
}
