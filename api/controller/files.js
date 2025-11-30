import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import axios from "axios";

const prisma = new PrismaClient();

// Create a new file
export const createFile = async (req, res) => {
  const { name, path, size, type, category, userId, tags } = req.body;
  try {
    if (!name || !path || !size || !type) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const file = await prisma.file.create({
      data: {
        name,
        path,
        size,
        type,
        category,
        userId: userId,
        tags:
          tags && tags.length > 0
            ? {
                create: tags?.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: { name: tagName },
                    },
                  },
                })),
              }
            : undefined,
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    res.status(201).json({ message: "File created successfully.", file });
  } catch (error) {
    console.error("Create file error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all files (optionally by user)
export const getFiles = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
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
  console.log(id);

  try {
    await prisma.file.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getFileByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findMany({
      where: { userId: Number(id) },
      include: { tags: { include: { tag: true } }, user: true },
    });
    if (!file) return res.status(404).json({ message: "File not found." });
    res.status(200).json(file);
  } catch (error) {
    console.error("Get file by User ID error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const downloadFileById = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const userId = parseInt(req.params.uid);

    // Fetch file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { user: true },
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    // Check permission
    if (file.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const filePath = path.resolve(`./public/${file.path}`); // ✅ relative path

    // Check file existence
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Set headers and send file
    res.download(filePath, file.name); // ✅ simpler and safer
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
};

// Semantic Search
export const searchFiles = async (req, res) => {
  const { query, userId } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    // 1. Call AI Service to get matching filenames
    const aiResponse = await axios.get(`http://localhost:8000/search-files/`, {
      params: { query },
    });

    const aiResults = aiResponse.data.results; // [{ filename, score, preview }]

    if (!aiResults || aiResults.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Extract filenames
    const filenames = aiResults.map((r) => r.filename);

    // 3. Find files in DB that match these filenames (stored in path)
    // path is like "/uploads/filename-timestamp.ext"
    // We need to find files where path contains the filename
    
    // Since we store path as `/uploads/${filename}`, we can search by path endsWith filename
    // OR just use 'in' operator if we construct the paths.
    
    const filePaths = filenames.map(name => `/uploads/${name}`);

    const files = await prisma.file.findMany({
      where: {
        path: { in: filePaths },
        userId: userId ? parseInt(userId) : undefined, // Optional: restrict to user
      },
      include: { tags: { include: { tag: true } }, user: true },
    });

    // 4. Merge AI results (score/preview) with DB files
    const mergedResults = files.map(file => {
      const filename = file.path.split('/').pop();
      const aiMatch = aiResults.find(r => r.filename === filename);
      return {
        ...file,
        relevanceScore: aiMatch ? aiMatch.score : 0,
        preview: aiMatch ? aiMatch.preview : "",
      };
    });

    // Sort by relevance
    mergedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json(mergedResults);

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error during search." });
  }
};

// Create Blockchain Log in DB
export const createBlockchainLog = async (data) => {
  try {
    const { fileId, userId, action, hash, txHash } = data;
    await prisma.blockchainlog.create({
      data: {
        fileId: Number(fileId),
        userId: Number(userId),
        action,
        hash,
        txHash,
      },
    });
    console.log(`DB Log created for file ${fileId}`);
  } catch (error) {
    console.error("Error creating DB blockchain log:", error);
  }
};

// Get Blockchain Logs
export const getBlockchainLogs = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = userId ? { userId: Number(userId) } : {};

    const logs = await prisma.blockchainlog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: 50, // Limit to last 50 logs
      include: {
        file: { select: { name: true } },
        user: { select: { name: true } },
      },
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Get blockchain logs error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
