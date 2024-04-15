import { prisma } from "@/util/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = typeof req.query.id === "string" ? req.query.id : "";
  // console.log("id: ", id);
  try {
    const setting = await prisma.settings.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    // console.log(user);
    if (setting) {
      await prisma.settings.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ message: "Deleted setting." });
    } else {
      res.status(200).json({ message: "setting doesnt exist." });
    }
  } catch (error) {
    console.error("Failed to delete setting:", error);
    res.status(500).json({ error: "Failed to delete setting" });
  }
}
