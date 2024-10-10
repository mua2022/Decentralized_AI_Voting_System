// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IAxelar {
    function sendMessage(string calldata destinationChain, bytes calldata message) external;
}
