const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const FileLog = await hre.ethers.getContractFactory("FileLog");
  const fileLog = await FileLog.deploy();

  await fileLog.waitForDeployment();

  const address = await fileLog.getAddress();
  console.log(`FileLog deployed to ${address}`);

  // Save the address and ABI to a file for the backend to use
  const artifact = await hre.artifacts.readArtifact("FileLog");
  const contractData = {
    address: address,
    abi: artifact.abi
  };

  const outputPath = path.join(__dirname, "../../api/config/contractData.json");
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2));
  console.log(`Contract data saved to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
