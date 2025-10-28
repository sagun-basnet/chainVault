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

    function getFutureDate(value) {
      const now = new Date();

      if (value === 0.1) now.setHours(now.getHours() + 1);
      else if (value === 0.6) now.setHours(now.getHours() + 6);
      else if (value === 1) now.setDate(now.getDate() + 1);
      else if (value === 7) now.setDate(now.getDate() + 7);
      else if (value === 30) now.setDate(now.getDate() + 30);

      return now.toISOString(); // ✅ valid ISO date for MySQL
    }

    console.log(getFutureDate(Number(expiresInDays)), "Expire");

    const expiresAt = getFutureDate(Number(expiresInDays));

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

async function deleteExpiredData() {
  console.log("I am from deleteExpiredDate Job");

  const now = new Date().toISOString(); // current ISO time
  const result = await prisma.$executeRaw`
    DELETE FROM sharedlink WHERE expiresAt <= ${now}
  `;
  console.log(`${result} expired rows deleted`);
}

// run every 12 hours
setInterval(deleteExpiredData, 12 * 60 * 60 * 1000);
