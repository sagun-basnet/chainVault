import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new file
export const createFile = async (req, res) => {
  const { name, path, size, type, category, userId, tags } = req.body;
  try {
    // Basic validation
    if (!name || !path || !size || !type || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create file
    const file = await prisma.file.create({
      data: {
        name,
        path,
        size,
        type,
        category,
        userId,
        tags:
          tags && tags.length > 0
            ? {
                create: tags.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
    res.status(201).json({ message: "File created successfully.", file });
  } catch (error) {
    console.error("Create file error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all files (optionally by user)
export const getFiles = async (req, res) => {
  const { userId } = req.query;
  try {
    const files = await prisma.file.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: { tags: { include: { tag: true } }, user: true },
    });
    res.status(200).json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get a single file by ID
export const getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({
      where: { id: Number(id) },
      include: { tags: { include: { tag: true } }, user: true },
    });
    if (!file) return res.status(404).json({ message: "File not found." });
    res.status(200).json(file);
  } catch (error) {
    console.error("Get file by ID error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Update a file
export const updateFile = async (req, res) => {
  const { id } = req.params;
  const { name, category, tags } = req.body;
  try {
    // Update file fields
    const file = await prisma.file.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
        tags: tags
          ? {
              set: [], // Remove all existing tags
              create: tags.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
    res.status(200).json({ message: "File updated successfully.", file });
  } catch (error) {
    console.error("Update file error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Delete a file
export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.file.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
