const hre = require("hardhat");

async function main() {
    const governanceAddress = "0xYourGovernanceContractAddress";  // Replace with deployed Governance contract address
    const Governance = await hre.ethers.getContractAt("Governance", governanceAddress);

    // Submit a proposal
    const proposalDescription = "Implement cross-chain governance with AI";
    let tx = await Governance.submitProposal(proposalDescription);
    await tx.wait();
    console.log("Proposal submitted!");

    // Get number of proposals
    const proposalCount = await Governance.getProposalCount();
    console.log("Total proposals:", proposalCount.toString());

    // Vote on the proposal (Proposal ID 0)
    tx = await Governance.voteOnProposal(0, true);
    await tx.wait();
    console.log("Voted on Proposal ID 0");
}

// Run the script using Hardhat
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
