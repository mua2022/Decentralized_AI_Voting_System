// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Importing interfaces for Warden AI and cross-chain communication if needed
import "./interfaces/IWarden.sol";
import "./interfaces/IAxelar.sol";

contract Governance {
    // Proposal structure containing relevant information about each proposal
    struct Proposal {
        address proposer;          // Address of the user who created the proposal
        string description;        // Proposal description
        bytes aiAnalysis;          // Warden AI analysis result for the proposal
        uint voteCountYes;         // Number of 'Yes' votes
        uint voteCountNo;          // Number of 'No' votes
        bool executed;             // Whether the proposal has been executed
        uint endTime;              // Voting deadline
    }

    // Array to store all proposals
    Proposal[] public proposals;
    
    // Mapping to track whether an address has voted on a specific proposal
    mapping(uint => mapping(address => bool)) public hasVoted;

    // Warden and cross-chain communication services
    IWarden public wardenService;
    IAxelar public axelarService; // Optional if you include cross-chain

    // Events
    event ProposalCreated(uint indexed proposalId, address proposer);
    event VoteCasted(uint indexed proposalId, address voter, bool vote);
    event ProposalExecuted(uint indexed proposalId, bool success);

    // Constructor to initialize Warden and Axelar (or Wormhole) services
    constructor(address _wardenService, address _axelarService) {
        wardenService = IWarden(_wardenService);   // Warden AI service
        axelarService = IAxelar(_axelarService);   // Axelar cross-chain service (optional)
    }

    // Function to submit a new proposal, which triggers Warden AI for analysis
    function submitProposal(string memory _description) external {
        // Call Warden's AI analysis service (e.g., sending proposal data for analysis)
        bytes memory aiAnalysis = wardenService.getAIAnalysis(bytes(_description));

        // Create a new proposal and add it to the proposals array
        Proposal memory newProposal = Proposal({
            proposer: msg.sender,
            description: _description,
            aiAnalysis: aiAnalysis,
            voteCountYes: 0,
            voteCountNo: 0,
            executed: false,
            endTime: block.timestamp + 7 days  // Set a 7-day voting period
        });
        proposals.push(newProposal);

        // Emit event for proposal creation
        emit ProposalCreated(proposals.length - 1, msg.sender);
    }

    // Function to vote on a proposal
    // 'vote' is a boolean where true means voting 'Yes' and false means voting 'No'
    function voteOnProposal(uint _proposalId, bool vote) external {
        // Ensure the proposal exists and is still open for voting
        require(_proposalId < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "You have already voted");

        // Register the vote
        if (vote) {
            proposal.voteCountYes += 1;
        } else {
            proposal.voteCountNo += 1;
        }
        hasVoted[_proposalId][msg.sender] = true;  // Mark the user as having voted

        // Emit vote event
        emit VoteCasted(_proposalId, msg.sender, vote);
    }

    // Function to execute a proposal after the voting period has ended
    function executeProposal(uint _proposalId) external {
        // Ensure the proposal exists and hasn't been executed yet
        require(_proposalId < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period is not over");
        require(!proposal.executed, "Proposal has already been executed");

        // Determine if the proposal passed based on voting results
        bool success = proposal.voteCountYes > proposal.voteCountNo;

        if (success) {
            // Execute the decision logic (This can be customized depending on what the proposal intends to do)
            // For example, changing some contract parameter, upgrading the system, etc.
        }

        // Mark the proposal as executed
        proposal.executed = true;

        // Emit proposal execution event
        emit ProposalExecuted(_proposalId, success);
    }

    // Optional: Cross-chain voting using Axelar
    // This function sends the vote result to another chain using cross-chain messaging
    function sendCrossChainVote(uint _proposalId, bool vote) external {
        // Ensure the proposal exists and is still open for voting
        require(_proposalId < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");

        // Example of cross-chain communication using Axelar or Wormhole
        bytes memory voteData = abi.encode(_proposalId, vote);
        axelarService.sendMessage("target_chain", voteData);
    }

    // Get total number of proposals
    function getProposalCount() public view returns (uint) {
        return proposals.length;
    }

    // Get proposal details by ID
    function getProposal(uint _proposalId) public view returns (
        address proposer,
        string memory description,
        bytes memory aiAnalysis,
        uint voteCountYes,
        uint voteCountNo,
        bool executed,
        uint endTime
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.aiAnalysis,
            proposal.voteCountYes,
            proposal.voteCountNo,
            proposal.executed,
            proposal.endTime
        );
    }
}
