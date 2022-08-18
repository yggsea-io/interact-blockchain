const {
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
    AccountLayout
} = require("@solana/spl-token")
const { 
    Transaction, 
    sendAndConfirmTransaction, 
    LAMPORTS_PER_SOL, 
    SystemProgram, 
    PublicKey, 
} = require("@solana/web3.js");

const { connection } = require("./network").getConfig()
console.log("test", connection)

class SolanaAccount{
    constructor(keypair){
        this.keypair = keypair
    }

    async getTokenAccount(mintAddress){
        let mintPubKey = new PublicKey(mintAddress)
        let response = await connection.getParsedTokenAccountsByOwner(this.keypair.publicKey, {
            mint: mintPubKey,
        });
        return response
    }

    async getAllTokenByOwner(isExistAmount) {
        var result = []
        let response = await connection.getTokenAccountsByOwner(
            this.keypair.publicKey, // owner here
            {
                programId: TOKEN_PROGRAM_ID,
            }
        );
        response.value.forEach((e) => {
            const accountInfo =  AccountLayout.decode(e.account.data);
            if(!isExistAmount){
                result.push(accountInfo)
            }else{
                console.log(`pubkey: ${e.pubkey.toBase58()}`);
                if(accountInfo.amount.toString() != '0'
                         && accountInfo.amount.toString() != '1'){
                    result.push(accountInfo)
                }
            } 
        });
        return result
    }

    async transferSol(toAddress, value) {
        const toPubKey = new PublicKey (toAddress)
        let tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: this.keypair.publicKey,
                toPubkey: toPubKey,
                lamports: value * web3.LAMPORTS_PER_SOL
            })
        )
        let txhash = await web3.sendAndConfirmTransaction(connection, tx, [this.keypair])
        console.log("hash", txhash)
    }

    async  transferSplToken(toAddress, mintAddress, value) {
        const mintPubkey = new PublicKey(mintAddress)
        const toPubkey = new PublicKey(toAddress)
        const fromTokenAccount = await connection.getTokenAccountsByOwner(
            this.keypair.publicKey,
            { mint: mintPubkey }
        )
        const toTokenAccount = await connection.getTokenAccountsByOwner(
            toPubkey,
            { mint: mintPubkey }
        )
        const tx = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount.value[0].pubkey,
                toTokenAccount.value[0].pubkey,
                this.keypair.publicKey,
                value*LAMPORTS_PER_SOL,
                [],
                TOKEN_PROGRAM_ID
            )
        )
        const txhash = await sendAndConfirmTransaction(connection, tx, [this.keypair])
        console.log("tx hash", txhash)
    }
    
}
module.exports = SolanaAccount