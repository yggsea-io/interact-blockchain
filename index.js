const bs58 = require('bs58');
const { clusterApiUrl, Keypair, Connection } = require("@solana/web3.js");
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, './.env') });
const connection = new Connection(clusterApiUrl("devnet"));

const ownerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.ACCOUNT1_PRIVATE_KEY));


const { createListNftTest, getAllNftByOwner } = require("./src/common/solana/nft");

main().catch(err => console.log(err))
async function main(){
    await createListNftTest(
        connection,
        ownerKeyPair,
        'https://assets.mixmob.io/metadata/Y-99QgrjQI9JqffcgS0z4.json',
        'MXM')
    // const allNft = await getAllNftByOwner(ownerKeyPair.publicKey)
    // console.log(JSON.parse(allNft))
}