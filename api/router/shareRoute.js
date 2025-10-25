import express from "express";
import { accessSharedFile, createShareLink } from "../controller/share.js";

const route = express.Router();

route.post("/share/:fileId", createShareLink);
route.get("/get-share/:token", accessSharedFile);

export default route;
