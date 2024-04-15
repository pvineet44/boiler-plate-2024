import { NextApiRequest, NextApiResponse } from "next";
import { HandlerFunction } from "@/types/global";
import ERRORS from "@/util/errors";
import crypto from "crypto";
import { prisma } from "@/util/db";

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, password } = req.body as { id: string; password: string };

  if (!id) {
    return res.status(500).json({
      success: false,
      description: "Invalid authentication!",
    });
  }

  const hexPass = crypto.createHash("md5").update(password).digest("hex");

  await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: { pwd: hexPass },
  });

  return res.status(200).json({
    success: true,
    description: "Password updated!",
  });
};

const METHOD_HANDLERS: Record<string, HandlerFunction> = {
  POST: resetPassword,
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
