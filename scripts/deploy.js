const hre = require("hardhat");

async function main() {
    const wardenServiceAddress = "0xWardenServiceAddress";  // Replace with Warden service address
    const axelarServiceAddress = "0xAxelarServiceAddress";  // Replace with Axelar service address

    // Deploy AI Integration contract
    const AIIntegration = await hre.ethers.getContractFactory("AIIntegration");
    const aiIntegration = await AIIntegration.deploy(wardenServiceAddress);
    await aiIntegration.deployed();
    console.log("AIIntegration deployed to:", aiIntegration.address);

    // Deploy Cross Chain contract
    const CrossChain = await hre.ethers.getContractFactory("CrossChain");
    const crossChain = await CrossChain.deploy(axelarServiceAddress);
    await crossChain.deployed();
    console.log("CrossChain deployed to:", crossChain.address);

    // Deploy Governance contract
    const Governance = await hre.ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(aiIntegration.address, crossChain.address, wardenServiceAddress);
    await governance.deployed();
    console.log("Governance deployed to:", governance.address);
}

// Hardhat recommended method to run script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
