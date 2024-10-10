// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IWarden.sol";

contract AIIntegration {
    IWarden public wardenService;

    constructor(address _wardenService) {
        wardenService = IWarden(_wardenService);
    }

    function analyzeDescription(string memory description) public view returns (bytes memory) {
        return wardenService.getAIAnalysis(bytes(description));
    }
}
