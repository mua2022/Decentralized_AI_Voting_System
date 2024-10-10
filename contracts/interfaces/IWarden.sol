// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IWarden {
    function getAIAnalysis(bytes memory data) external view returns (bytes memory);
}
