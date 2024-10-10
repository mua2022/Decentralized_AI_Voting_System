// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IAxelar.sol";

contract CrossChain {
    IAxelar public axelarService;

    constructor(address _axelarService) {
        axelarService = IAxelar(_axelarService);
    }

    function sendProposalResult(uint proposalId, bool success) external {
        bytes memory result = abi.encode(proposalId, success);
        axelarService.sendMessage("target_chain", result);
    }
}
