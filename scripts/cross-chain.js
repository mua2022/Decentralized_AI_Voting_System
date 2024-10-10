const hre = require("hardhat");

async function main() {
    const crossChainAddress = "0xYourCrossChainContractAddress";  // Replace with deployed CrossChain contract address
    const CrossChain = await hre.ethers.getContractAt("CrossChain", crossChainAddress);

    // Simulate sending a proposal result
    const proposalId = 1;
    const success = true;

    let tx = await CrossChain.sendProposalResult(proposalId, success);
    await tx.wait();
    console.log(`Sent proposal result: Proposal ID: ${proposalId}, Success: ${success}`);

    // Optionally, you can also check the result of the message being sent (if using a mock service)
    const mockAxelarServiceAddress = "0xMockAxelarServiceAddress";  // Replace with your Mock Axelar Service contract address
    const MockAxelar = await hre.ethers.getContractAt("MockAxelar", mockAxelarServiceAddress);
    const lastMessage = await MockAxelar.lastMessage();
    console.log("Last message sent via Axelar:", lastMessage);
}

// Hardhat recommended method to run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
