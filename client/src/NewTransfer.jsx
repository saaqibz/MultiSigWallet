import React, {useState} from 'react';

function NewTransfer({createTransfer}) {
    const [transfer, setTransfer] = useState({
        amount: -1,
        to: '',
    });

    const updateTransfer = (e, field) => {
        setTransfer({
            ...transfer,
            [field]: e.target.value,
        });
    }
    const submit = e => {
        e.preventDefault() // prevent page reload
        createTransfer(transfer);
    }

    return (
        <div>
            <h2>Create Transfer</h2>
            <form onSubmit={e => submit(e)}>
                <label htmlFor="amount">Amount</label>
                <input
                 id="amount"
                 type="text"
                 onChange={e => updateTransfer(e, 'amount')}
                />
                <label htmlFor="to">To</label>
                <input
                 id="to"
                 type="text"
                 onChange={e => updateTransfer(e, 'to')}
                />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default NewTransfer;