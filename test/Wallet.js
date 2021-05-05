const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
        const quorum = 2;
        const approvers = accounts.slice(0, 3);
        wallet = await Wallet.new(approvers, quorum);
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: wallet.address,
            value: 1000,
        });
    })

    it('should have right value for approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length == 3);
        assert(approvers[0] == accounts[0]);
        assert(approvers[1] == accounts[1]);
        assert(approvers[2] == accounts[2]);
        assert(quorum.toString() == '2');
    })

    describe('createTransfer', async () => {
        it('should create a transfer', async () => {
            await wallet.createTransfer(100, accounts[5], {
                from: accounts[0],
            })
            const transfers = await wallet.getTransfers();
            assert(transfers.length === 1);
            assert(transfers[0].id === '0');
            assert(transfers[0].to === accounts[5]);
            assert(transfers[0].approvals === '0');
            assert(transfers[0].amount === '100');
            assert(transfers[0].sent === false);
        })

        it('should not create a transfer if not an approver', async () => {
            await expectRevert(wallet.createTransfer(100, accounts[5], {
                from: accounts[3],
            }), 'approvers only');
            const transfers = await wallet.getTransfers();
            assert(transfers.length === 0);
        })
    });

    describe('approveTransfer', async () => {
        beforeEach(async () => {
            await wallet.createTransfer(100, accounts[5], {
                from: accounts[0],
            });
        })

        it('should approve but no quorum', async () => {
            await wallet.approveTransfer(0, {
                from: accounts[0],
            });
            const xfer = (await wallet.getTransfers())[0];
            assert(xfer.approvals === '1');
            assert(!xfer.sent);
            const balance = await web3.eth.getBalance(wallet.address);
            assert(balance === '1000');
        });

        it('should approve and quorum', async () => {
            const balBefore = await web3.eth.getBalance(wallet.address);
            await wallet.approveTransfer(0, {
                from: accounts[0],
            });
            await wallet.approveTransfer(0, {
                from: accounts[1],
            });
            const xfer = (await wallet.getTransfers())[0];
            assert(xfer.approvals === '2');
            assert(xfer.sent);
            const balance = await web3.eth.getBalance(wallet.address);
            assert(web3.utils.toBN(balBefore).sub(web3.utils.toBN(balance)).toString() === '100');
            const acct5Bal = await web3.eth.getBalance(accounts[5]);
            console.log('acct5Bal', acct5Bal);
            assert(acct5Bal === '100000000000000000100');
        })

        it('rejects non-approver', async () => {
            await expectRevert(wallet.approveTransfer(0, {
                from: accounts[3],
            }), 'approvers only');
        })

        it('rejects already sent transfers', async () => {
            // Send a txn
            await wallet.approveTransfer(0, {
                from: accounts[0],
            });
            await wallet.approveTransfer(0, {
                from: accounts[1],
            });

            // Try signing sent one
            await expectRevert(wallet.approveTransfer(0, {
                from: accounts[2],
            }), 'transfer already sent');
        })

        it('rejects repeated approvals', async () => {
            await wallet.approveTransfer(0, {
                from: accounts[0],
            });
            await expectRevert(wallet.approveTransfer(0, {
                from: accounts[0],
            }), 'already approved');
        })
    })

    // it('should reject unauthorized createTransfer', async () => {
    //     await web3.eth.sendTransaction(wallet.createTransfer(500, accounts[4],)
    // });
})