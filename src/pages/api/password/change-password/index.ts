import { prisma } from "@/util/db";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = await getToken({ req, secureCookie: process.env.DEV_ENV !== "true" });
  if (!token || !token.id) {
    return res.status(403).json({ error: "User not authenticated" });
  }
  // userId: hardcoded for now
  const userId = Number(token?.id);

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide both old and new passwords" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const passwordMatch = (crypto.createHash("md5").update(currentPassword).digest("hex")  == user.pwd);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hexPass = crypto.createHash("md5").update(newPassword).digest("hex");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        pwd: hexPass,
      },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
