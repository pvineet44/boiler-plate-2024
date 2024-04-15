import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/util/db";
import ERRORS from "@/util/errors";
import crypto from "crypto";

import {Settings, User } from "@prisma/client";

type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

//create a user in the platform
const addSetting = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const newSetting = await prisma.settings.create({ data: { ...req.body } });
    return res.status(200).json({
      success: true,
      data: newSetting,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      err: err,
    });
  }
};

//to fetch all the settings
const getSettings = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, pageSize } = req.query as { page: string; pageSize: string };
  const totalCount = await prisma.settings.count();
  const totalPages = Math.ceil(totalCount / Number(pageSize));
  // console.log("here");
  var settings: Settings[] = [];
  try {
    settings = await prisma.settings.findMany({
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    if (settings?.length === 0) {
      return res.status(200).json({ error: "Failed to fetch settings" });
    }
    // res.status(200).json(users);
    res.status(200).json({ settings, totalPages });
  } catch (e) {
    console.log(e);
  }
};

const putSetting = async (req: NextApiRequest, res: NextApiResponse) => {
  //   console.log(req.body);
  try {
    const isSetting = await prisma.settings.findFirst({
      where: { id: req.body.id },
    });
    if (!isSetting) {
      res.status(200).json({ message: "Setting not found." });
    }

    await prisma.settings.update({
      where: { id: req.body.id },
      data: req.body.data,
    });
    res.status(200).json({ message: "Setting updated." });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const METHOD_HANDLERS: Record<string, HandlerFunction> = {
  GET: getSettings,
  POST: addSetting,
  PUT: putSetting,
};

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("******************");

  const session = await getServerSession(req, res, authOptions);
  // if (!session) {
  //   return res.status(ERRORS["UNAUTHORISED"].status).json({
  //     success: false,
  //     message: ERRORS["UNAUTHORISED"].message,
  //   });
  // }
  // const authUser = await prisma.user.findUnique({
  //   where: { id: parseInt(session?.user.id) },
  //   select: {
  //     id: true,
  //     profile: true,
  //     role: {
  //       select: {
  //         id: true,
  //         name: true,
  //         permissions: true,
  //       },
  //     },
  //   },
  // });
  // const _permission = authUser?.role?.permissions as unknown as Permissions;
  // if (
  //   !authUser ||
  //   authUser.role?.name === "OBS Control" ||
  //   !_permission.create_users
  // ) {
  //   return res.status(ERRORS["UNAUTHORISED"].status).json({
  //     success: false,
  //     message: ERRORS["UNAUTHORISED"].message,
  //   });
  // }

  const handle = METHOD_HANDLERS[req.method as string];
  if (handle) {
    handle(req, res);
  } else {
    return res.status(ERRORS["NOT_FOUND"].status).json({
      success: false,
      message: ERRORS["NOT_FOUND"].message,
    });
  }
}
