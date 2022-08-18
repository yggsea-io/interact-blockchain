const {
    createTransferCheckedInstruction,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
    AccountLayout
} = require("@solana/spl-token")
const { 
    Connection, 
    Transaction, 
    sendAndConfirmTransaction, 
    LAMPORTS_PER_SOL, 
    clusterApiUrl, 
    SystemProgram, 
    PublicKey, 
    Keypair
} = require("@solana/web3.js")

const bip39 = require('bip39');
const bs58 = require("bs58");
const ed = require('ed25519-hd-key');

const connection = new Connection(clusterApiUrl("devnet"))

async function transferSplToken(fromPrivateKey, toAddress, mintAddress, value) {
    const fromKeyPair = Keypair.fromSecretKey(
        bs58.decode(fromPrivateKey)
      );
    const mintPubkey = new PublicKey(mintAddress)
    const toPubkey = new PublicKey(toAddress)
    const fromTokenAccount = await connection.getTokenAccountsByOwner(
        fromKeyPair.publicKey,
        { mint: mintPubkey }
    )
    const toTokenAccount = await connection.getTokenAccountsByOwner(
        toPubkey,
        { mint: mintPubkey }
    )
    console.log(AccountLayout.decode(toTokenAccount.value[0].account.data))
    const tx = new Transaction().add(
        // createTransferCheckedInstruction(
        //     fromTokenAccount.value[0].pubkey,
        //     mintPubkey,
        //     toTokenAccount.value[0].pubkey,
        //     fromKeyPair.publicKey,
        //     value,
        //     8
        // )
        createTransferInstruction(
            fromTokenAccount.value[0].pubkey,
            toTokenAccount.value[0].pubkey,
            fromKeyPair.publicKey,
            value*LAMPORTS_PER_SOL,
            [],
            TOKEN_PROGRAM_ID
        )
    )
    const txhash = await sendAndConfirmTransaction(connection, tx, [fromKeyPair])
    console.log("tx hash", txhash)
}

async function transferSol(fromKeyPair, toPubKey, value) {
    let tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeyPair.publicKey,
            toPubkey: toPubKey,
            lamports: value * web3.LAMPORTS_PER_SOL
        })
    )
    let txhash = await web3.sendAndConfirmTransaction(connection, tx, [fromKeyPair])
    console.log("hash", txhash)
}

async function getAllTokenByOwner(ownerAddress, isExistAmount) {

    var result = []
    let response2 = await connection.getTokenAccountsByOwner(
        new PublicKey(ownerAddress), // owner here
        {
            programId: TOKEN_PROGRAM_ID,
        }
    );
    response2.value.forEach((e) => {
        const accountInfo = AccountLayout.decode(e.account.data);
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

async function getTokenAccount(ownerAddress, mintAddress){
    let ownerPubkey = new PublicKey(ownerAddress)
    let mintPubKey = new PublicKey(mintAddress)
    let response = await connection.getParsedTokenAccountsByOwner(ownerPubkey, {
        mint: mintPubKey,
    });
    return response
}

const getKeypair = (mnemonic, i) => {
    const path = `m/44'/501'/${i}'/0'`;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const derivedSeed = ed.derivePath(path, seed.toString('hex')).key;
    return anchor.web3.Keypair.fromSeed(derivedSeed.slice(0, 32));
}

module.exports = {
    transferSplToken,
    transferSol,
    getAllTokenByOwner,
    getTokenAccount
}