pragma solidity ^0.8.0;

contract Wallet {
    address[] public approvers;
    uint256 public quorum = 0;

    struct Transfer {
        uint256 id;
        uint256 amount;
        address payable to;
        uint256 approvals;
        bool sent;
    }

    Transfer[] public transfers;

    mapping(address => mapping(uint256 => bool)) public approvals;

    constructor(address[] memory _approvers, uint256 _quorum) {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns (address[] memory) {
        return approvers;
    }

    function createTransfer(uint256 amount, address payable to)
        external
        onlyApprover()
    {
        transfers.push(
            Transfer({
                id: transfers.length,
                amount: amount,
                to: to,
                approvals: 0,
                sent: false
            })
        );
    }

    function getTransfers() external view returns (Transfer[] memory) {
        return transfers;
    }

    function approveTransfer(uint256 id) external onlyApprover() {
        require(!transfers[id].sent, "transfer already sent");
        require(!approvals[msg.sender][id], "already approved");
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;

        Transfer storage xfer = transfers[id];
        if (xfer.approvals >= quorum) {
            xfer.sent = true;
            xfer.to.transfer(xfer.amount);
        }
    }

    modifier onlyApprover() {
        bool allowed = false;
        for (uint256 i = 0; i < approvers.length; ++i) {
            if (approvers[i] == msg.sender) {
                allowed = true;
                break;
            }
        }
        require(allowed, "approvers only");
        _;
    }

    receive() external payable {}
}
