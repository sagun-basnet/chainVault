import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    // 1. File Growth (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const files = await prisma.file.findMany({
      select: { createdAt: true, size: true, type: true, category: true },
      where: { createdAt: { gte: sixMonthsAgo } }
    });

    const fileGrowthMap = {};
    files.forEach(f => {
      const month = f.createdAt.toLocaleString('default', { month: 'short' });
      if (!fileGrowthMap[month]) fileGrowthMap[month] = { name: month, files: 0, storage: 0 };
      fileGrowthMap[month].files += 1;
      fileGrowthMap[month].storage += f.size / (1024 * 1024); // MB
    });
    const fileGrowthData = Object.values(fileGrowthMap);

    // 2. File Types
    const fileTypeMap = {
      Document: 0,
      Image: 0,
      Code: 0,
      Spreadsheet: 0,
      Other: 0,
    };

    files.forEach((f) => {
      const type = f.type.toLowerCase();
      if (
        type.includes("pdf") ||
        type.includes("msword") ||
        type.includes("wordprocessingml") ||
        type.includes("text/plain")
      ) {
        fileTypeMap.Document += 1;
      } else if (type.includes("image")) {
        fileTypeMap.Image += 1;
      } else if (
        type.includes("excel") ||
        type.includes("spreadsheetml") ||
        type.includes("csv")
      ) {
        fileTypeMap.Spreadsheet += 1;
      } else if (
        type.includes("javascript") ||
        type.includes("html") ||
        type.includes("css") ||
        type.includes("json") ||
        type.includes("python") ||
        type.includes("xml")
      ) {
        fileTypeMap.Code += 1;
      } else {
        fileTypeMap.Other += 1;
      }
    });

    const fileTypeData = Object.keys(fileTypeMap)
      .filter((key) => fileTypeMap[key] > 0) // Only show categories with files
      .map((key) => ({
        name: key,
        value: fileTypeMap[key],
      }));

    // 3. Blockchain Activity (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const logs = await prisma.blockchainlog.findMany({
      select: { timestamp: true },
      where: { timestamp: { gte: sevenDaysAgo } }
    });

    const activityMap = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize last 7 days
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        activityMap[dayName] = { name: dayName, txs: 0 };
    }

    logs.forEach(l => {
        const dayName = days[l.timestamp.getDay()];
        if (activityMap[dayName]) activityMap[dayName].txs += 1;
    });
    
    // Sort by day order is tricky, so we'll just return the list. 
    // For a better graph, we might want to sort by date, but this is a good start.
    const blockchainActivityData = Object.values(activityMap);

    // 4. AI Usage
    const classifiedCount = files.filter(f => f.category && f.category !== 'unknown').length;
    const totalFiles = files.length;
    const aiUsageData = [
      { name: "Classified", value: classifiedCount },
      { name: "Unclassified", value: totalFiles - classifiedCount },
    ];

    res.status(200).json({
      fileGrowthData,
      fileTypeData,
      blockchainActivityData,
      aiUsageData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAIStatus = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/");
    res.status(200).json(response.data);
  } catch (err) {
    res.status(503).json({ status: "offline", service: "AI Classification & Search" });
  }
};

export const triggerRetrain = async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/retrain/");
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error triggering retrain", error: err.message });
  }
};

export const getIndexStats = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/index-stats/");
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching index stats", error: err.message });
  }
};
