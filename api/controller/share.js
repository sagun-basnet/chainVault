import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
// POST /api/files/share/:fileId
export const createShareLink = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId, password, permission, expiresInDays } = req.body;
    console.log(req.body);

    const token = crypto.randomBytes(12).toString("hex");
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const sharedLink = await prisma.sharedLink.create({
      data: {
        fileId: Number(fileId),
        userId: Number(userId),
        token,
        password: password || null,
        permission: permission || "VIEW_ONLY", // Default permission
        expiresAt,
      },
    });

    res.status(200).json({
      url: `http://localhost:5173/share/${token}`,
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const accessSharedFile = async (req, res) => {
  try {
    const { token } = req.params;
    const password = req.query.password; // optional password input

    const link = await prisma.sharedLink.findUnique({
      where: { token },
      include: { file: true, user: true },
    });

    if (!link) return res.status(404).json({ message: "Invalid link" });

    if (link.expiresAt && new Date() > link.expiresAt)
      return res.status(410).json({ message: "Link expired" });

    if (link.password && link.password !== password)
      return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({
      file: link.file,
      owner: link.user,
      permission: link.permission,
    });
  } catch (error) {
    console.error("Access share link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
