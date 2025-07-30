import express from "express";
import upload from "../middleware/multerConfig.js";
import {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
} from "../controller/files.js";

const router = express.Router();

// Upload a file (single file, field name 'file')
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    // Extract file info and userId from body
    const { userId, category, tags } = req.body;
    const fileData = {
      name: req.file.originalname,
      path: `/images/${req.file.filename}`,
      size: req.file.size,
      type: req.file.mimetype,
      category,
      userId: Number(userId),
      tags: tags ? JSON.parse(tags) : undefined, // tags as JSON array of tag IDs
    };
    // Call createFile controller logic directly
    req.body = fileData;
    await createFile(req, res);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Upload multiple files (field name 'files', max 10)
router.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }
    const { userId, category, tags } = req.body;
    const tagArray = tags ? JSON.parse(tags) : undefined;
    const results = [];
    for (const file of req.files) {
      // Prepare file data for each file
      const fileData = {
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        category,
        userId: Number(userId),
        tags: tagArray,
      };
      // Create a mock req/res for each file to reuse createFile logic
      const mockReq = { body: fileData };
      let status = 200;
      let json = (data) => results.push({ success: true, ...data });
      let errorJson = (data) => results.push({ success: false, ...data });
      const mockRes = {
        status: (code) => {
          status = code;
          return { json: status === 201 ? json : errorJson };
        },
        json: json,
      };
      await createFile(mockReq, mockRes);
    }
    res.status(201).json({ message: "Files processed.", results });
  } catch (error) {
    console.error("Upload multiple error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// CRUD routes
router.get("/", getFiles);
router.get("/:id", getFileById);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

export default router;
