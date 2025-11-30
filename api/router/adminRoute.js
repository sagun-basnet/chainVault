import express from "express";
import { getUsers, getSystemStats, getAIStatus, triggerRetrain, getIndexStats } from "../controller/admin.js";

const route = express.Router();

route.get("/users", getUsers);
route.get("/stats", getSystemStats);
route.get("/ai-status", getAIStatus);
route.post("/ai-retrain", triggerRetrain);
route.get("/ai-index-stats", getIndexStats);

export default route;
