import React from 'react'

function TransferList({transfers, activeAccount, approve}) {
    const showApprove = tfer => {
        return !tfer.sent && tfer.approvals;
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Amount</th>
                        <th>To</th>
                        <th>Approvals</th>
                        <th>Sent</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map(tfer => (
                        <tr key={tfer.id}>
                            <td>
                                {showApprove(tfer) && <button onClick={() => approve(tfer.id)}>Approve</button>}
                            </td>
                            <td>{tfer.id}</td>
                            <td>{tfer.amount}</td>
                            <td>{tfer.to}</td>
                            <td>{tfer.approvals}</td>
                            <td>{tfer.sent ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TransferList;