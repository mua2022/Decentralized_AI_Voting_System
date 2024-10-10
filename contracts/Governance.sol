// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./AIIntegration.sol";
import "./CrossChain.sol";
import "./interfaces/IWarden.sol";

contract Governance {
    struct Proposal {
        address proposer;
        string description;
        bytes aiAnalysis;
        uint voteCountYes;
        uint voteCountNo;
        bool executed;
        uint endTime;
    }

    Proposal[] public proposals;
    mapping(uint => mapping(address => bool)) public hasVoted;

    IWarden public wardenService;
    AIIntegration public aiIntegration;
    CrossChain public crossChain;

    event ProposalCreated(uint indexed proposalId, address proposer);
    event VoteCasted(uint indexed proposalId, address voter, bool vote);
    event ProposalExecuted(uint indexed proposalId, bool success);

    constructor(address _aiIntegration, address _crossChain, address _wardenService) {
        aiIntegration = AIIntegration(_aiIntegration);
        crossChain = CrossChain(_crossChain);
        wardenService = IWarden(_wardenService);
    }

    function submitProposal(string memory _description) external {
        bytes memory aiAnalysis = aiIntegration.analyzeDescription(_description);
        Proposal memory newProposal = Proposal({
            proposer: msg.sender,
            description: _description,
            aiAnalysis: aiAnalysis,
            voteCountYes: 0,
            voteCountNo: 0,
            executed: false,
            endTime: block.timestamp + 7 days
        });
        proposals.push(newProposal);

        emit ProposalCreated(proposals.length - 1, msg.sender);
    }

    function voteOnProposal(uint _proposalId, bool vote) external {
        require(_proposalId < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "You have already voted");

        if (vote) {
            proposal.voteCountYes += 1;
        } else {
            proposal.voteCountNo += 1;
        }
        hasVoted[_proposalId][msg.sender] = true;

        emit VoteCasted(_proposalId, msg.sender, vote);
    }

    function executeProposal(uint _proposalId) external {
        require(_proposalId < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period is not over");
        require(!proposal.executed, "Proposal has already been executed");

        bool success = proposal.voteCountYes > proposal.voteCountNo;
        proposal.executed = true;

        crossChain.sendProposalResult(_proposalId, success);

        emit ProposalExecuted(_proposalId, success);
    }

    function getProposalCount() public view returns (uint) {
        return proposals.length;
    }
}
