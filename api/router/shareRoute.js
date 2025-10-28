import express from "express";
import {
  accessSharedFile,
  createShareLink,
  deleteSharedFileLink,
  getSharedFileList,
} from "../controller/share.js";

const route = express.Router();

route.post("/share/:fileId", createShareLink);
route.post("/delete-share/:id", deleteSharedFileLink);
route.get("/get-share/:token", accessSharedFile);
route.get("/get-share-file-list/:userId", getSharedFileList);

export default route;
