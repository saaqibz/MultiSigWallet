import React from 'react';

function Header({
  approvers,
  quorum,
  activeAccount,
  balance,
}) {
  const renderedApprovers = approvers.map(approver => (
    <li key={approver}>
      {activeAccount === approver.toLowerCase() ? '-> ' : ''}
      {approver}
    </li>
  ));
  
  return (
    <div>
      <div>Approvers:</div>
      <div>
        <ul>
          {renderedApprovers}
        </ul>
      </div>
      <div>Quorum: {quorum}</div>
      <div>Balance: {balance} wei</div>
    </div>
  );
}

export default Header;