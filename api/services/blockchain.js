import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractPath = path.join(__dirname, "../config/contractData.json");

let contract;
let provider;
let wallet;

export const initBlockchain = async () => {
    try {
        if (!fs.existsSync(contractPath)) {
            console.warn("Blockchain contract data not found. Skipping blockchain init.");
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(contractPath, "utf8"));
        const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545";
        // Use a default test key if not provided (Ganache account 0 usually)
        // WARNING: DO NOT USE THIS KEY IN PRODUCTION
        const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY; 

        if (!privateKey) {
             console.warn("Blockchain private key not set. Skipping blockchain init.");
             return;
        }

        provider = new ethers.JsonRpcProvider(rpcUrl);
        wallet = new ethers.Wallet(privateKey, provider);
        contract = new ethers.Contract(data.address, data.abi, wallet);
        
        console.log("Blockchain service initialized.");
    } catch (error) {
        console.error("Failed to initialize blockchain service:", error);
    }
};

export const logFileAction = async (fileHash, action, userId, metadata = "") => {
    if (!contract) {
        console.warn("Blockchain contract not initialized. Action not logged.");
        return;
    }
    try {
        const tx = await contract.addLog(fileHash, action, userId, metadata);
        await tx.wait();
        console.log(`Blockchain log added: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error("Error logging to blockchain:", error);
        return null;
    }
};
