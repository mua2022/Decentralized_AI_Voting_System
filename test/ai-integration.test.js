const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIIntegration Contract", function () {
    let AIIntegration, aiIntegration;

    beforeEach(async function () {
        const AIIntegrationFactory = await ethers.getContractFactory("AIIntegration");
        aiIntegration = await AIIntegrationFactory.deploy("0xWardenServiceAddress");
    });

    it("Should analyze a proposal description", async function () {
        const description = "This is a proposal to test AI integration.";
        const analysis = await aiIntegration.analyzeDescription(description);
        expect(analysis).to.be.a("bytes");
    });
});
