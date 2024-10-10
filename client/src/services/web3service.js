import Web3 from "web3";
import GovernanceContract from "../contracts/Governance.json";

// Assuming you're using MetaMask
const web3 = new Web3(window.ethereum);

// Replace with your deployed contract's address
const contractAddress = "0xYourContractAddress";
const contract = new web3.eth.Contract(GovernanceContract.abi, contractAddress);

// Function to submit a new proposal
export const submitProposal = async (description) => {
  const accounts = await web3.eth.getAccounts();
  return await contract.methods.submitProposal(description).send({ from: accounts[0] });
};

// Function to get all proposals
export const getProposals = async () => {
  const proposalCount = await contract.methods.getProposalCount().call();
  const proposals = [];

  for (let i = 0; i < proposalCount; i++) {
    const proposal = await contract.methods.getProposal(i).call();
    proposals.push({
      id: i,
      description: proposal[1],
      voteCountYes: proposal[3],
      voteCountNo: proposal[4],
      executed: proposal[5],
      endTime: proposal[6],
    });
  }

  return proposals;
};

// Function to vote on a proposal
export const voteOnProposal = async (proposalId, vote) => {
  const accounts = await web3.eth.getAccounts();
  return await contract.methods.voteOnProposal(proposalId, vote).send({ from: accounts[0] });
};
