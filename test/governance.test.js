const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Contract", function () {
    let Governance, governance, AIIntegration, aiIntegration, CrossChain, crossChain, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Mock contracts for AI and Cross-Chain
        const AIIntegrationFactory = await ethers.getContractFactory("AIIntegration");
        aiIntegration = await AIIntegrationFactory.deploy("0xWardenServiceAddress");

        const CrossChainFactory = await ethers.getContractFactory("CrossChain");
        crossChain = await CrossChainFactory.deploy("0xAxelarServiceAddress");

        // Deploy Governance
        const GovernanceFactory = await ethers.getContractFactory("Governance");
        governance = await GovernanceFactory.deploy(aiIntegration.address, crossChain.address, "0xWardenServiceAddress");
    });

    it("Should submit a proposal", async function () {
        await governance.submitProposal("Test Proposal");
        const proposalCount = await governance.getProposalCount();
        expect(proposalCount).to.equal(1);
    });

    it("Should allow voting on a proposal", async function () {
        await governance.submitProposal("Test Proposal");
        await governance.voteOnProposal(0, true);
        const proposal = await governance.proposals(0);
        expect(proposal.voteCountYes).to.equal(1);
    });

    it("Should execute a proposal", async function () {
        await governance.submitProposal("Test Proposal");
        await governance.voteOnProposal(0, true);
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);  // Fast forward 7 days
        await governance.executeProposal(0);
        const proposal = await governance.proposals(0);
        expect(proposal.executed).to.equal(true);
    });
});
