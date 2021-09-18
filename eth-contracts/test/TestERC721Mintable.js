var ERC721MintableComplete = artifacts.require('MyERC721Token');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const to = accounts[1];
    const firstToken = 1;
    const maxTokens = 10;

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: owner });

            // mint multiple tokens
            for (let idx = firstToken; idx <= maxTokens; idx++) {
                await this.contract.mint(owner, idx);
            }
        })

        it('should return total supply', async function () {
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, maxTokens, "total supply is not correct");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf.call(owner);
            assert.equal(balance, maxTokens, "balanceOf is not correct");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let expectedTokenUri = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/' + firstToken;
            let tokenUri = await this.contract.tokenURI.call(firstToken);
            assert.equal(tokenUri, expectedTokenUri, "token uri is not correct");
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(owner, to, firstToken);
            let newOwner = await this.contract.ownerOf(firstToken)
            assert.equal(to, newOwner, "Token was not transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: owner });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let err = false;
            try {
                await this.contract.mint(to, 11, { from: to });
            } catch {
                err = true;
            }
            assert.equal(err, true, "Non contract owner can mint");
        })

        it('should return contract owner', async function () {
            let currentOwner = await this.contract.owner.call();
            assert.equal(currentOwner, owner, "Owner is not correct");
        })

    });
})