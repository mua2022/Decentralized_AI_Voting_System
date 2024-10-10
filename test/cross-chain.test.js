const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChain Contract", function () {
    let CrossChain, crossChain, mockAxelarService, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Mock Axelar service contract
        const MockAxelar = await ethers.getContractFactory("MockAxelar");
        mockAxelarService = await MockAxelar.deploy();
        await mockAxelarService.deployed();

        // Deploy CrossChain contract with reference to mock Axelar service
        const CrossChainFactory = await ethers.getContractFactory("CrossChain");
        crossChain = await CrossChainFactory.deploy(mockAxelarService.address);
        await crossChain.deployed();
    });

    it("Should send proposal result to target chain", async function () {
        const proposalId = 1;
        const success = true;

        const tx = await crossChain.sendProposalResult(proposalId, success);
        await tx.wait();

        // Check if the event is emitted correctly
        const result = await mockAxelarService.lastMessage();
        const decodedResult = ethers.utils.defaultAbiCoder.decode(
            ["uint256", "bool"],
            result
        );

        expect(decodedResult[0].toString()).to.equal(proposalId.toString());
        expect(decodedResult[1]).to.equal(success);
    });
});
