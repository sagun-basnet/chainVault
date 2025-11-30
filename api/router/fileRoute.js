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
  searchFiles,
  createBlockchainLog,
  getBlockchainLogs,
} from "../controller/files.js";
import crypto from "crypto";
import { logFileAction } from "../services/blockchain.js";

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
      // Use file.filename (unique) so AI service indexes it correctly
      form.append("files", fs.createReadStream(file.path), file.filename);

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
        (r) => r.filename === file.filename
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

      // Blockchain Logging
      try {
          const fileBuffer = fs.readFileSync(file.path);
          const hashSum = crypto.createHash('sha256');
          hashSum.update(fileBuffer);
          const fileHash = hashSum.digest('hex');
          
          const txHash = await logFileAction(fileHash, "UPLOAD", userId.toString(), file.originalname);
          
          if (txHash) {
            console.log(`Logged upload for ${file.originalname} to blockchain. Tx: ${txHash}`);
            
            // Save to DB
            const savedFileId = results[results.length - 1]?.dbResponse?.file?.id;
            if (savedFileId) {
                await createBlockchainLog({
                    fileId: savedFileId,
                    userId: userId,
                    action: "UPLOAD",
                    hash: fileHash,
                    txHash: txHash
                });
            }
          } else {
            console.warn(`Failed to log upload for ${file.originalname} to blockchain.`);
          }
      } catch (bcError) {
          console.error("Blockchain logging failed:", bcError);
          // Don't fail the request if blockchain logging fails, just log the error
      }
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
router.get("/search/semantic", searchFiles);
router.get("/blockchain/logs", getBlockchainLogs);
router.get("/download/:id/:uid", downloadFileById);

export default router;
