import express from "express";
import upload from "../middleware/multerConfig.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  getFileByUserId,
  downloadFileById,
} from "../controller/files.js";

const router = express.Router();

router.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
  try {
    console.log(req.files, 18);
    console.log(req.body, 19);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const { userId, tags } = req.body;
    // const tagArray = tags ? JSON.parse(tags) : undefined;

    const results = [];

    for (const file of req.files) {
      // Send file to AI FastAPI for classification
      const form = new FormData();
      form.append("files", fs.createReadStream(file.path), file.originalname);

      const response = await axios.post(
        "http://localhost:8000/upload-multiple/", // your FastAPI URL
        form,
        {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log(response.data, ":RES FROM AI");

      // Assume response.data.results is an array of classification results for each file
      const aiResult = response.data.results.find(
        (r) => r.filename === file.originalname
      );

      // Prepare full file data for DB, using AI category if available
      const fileData = {
        name: file.originalname,
        path: `/uploads/${file.filename}`, // or file.path for full path, adjust as needed
        size: file.size,
        type: file.mimetype,
        category: aiResult?.category || "unknown", // AI category or fallback
        userId: parseInt(userId),
        tags: aiResult?.tags || tags || [],
      };

      // Call your controller function directly to save file info in DB
      // You can pass mock req/res or call prisma directly here if preferred
      // Here, we simulate req/res:
      await new Promise((resolve) => {
        const mockReq = { body: fileData };
        let status = 200;
        const mockRes = {
          status: (code) => {
            status = code;
            return mockRes;
          },
          json: (data) => {
            results.push({
              filename: file.originalname,
              aiCategory: aiResult?.category,
              saved: status === 201,
              dbResponse: data,
            });
            resolve();
          },
        };
        createFile(mockReq, mockRes);
      });
    }

    res.status(201).json({
      message: "Files processed with AI categories and saved to DB.",
      results,
    });
  } catch (error) {
    console.error("Error uploading files to AI and saving:", error);
    res
      .status(500)
      .json({ message: `Server error. :${error}`, error: error.message });
  }
});

// CRUD routes
router.get("/", getFiles);
router.get("/:id", getFileById);
router.get("/user-id/:id", getFileByUserId);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);
router.get("/download/:id/:uid", downloadFileById);

export default router;
