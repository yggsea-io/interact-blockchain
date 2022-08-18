const { LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { transferSplToken } = require("./src/common/solana/token")
const bs58 = require("bs58");

(async()=>{
    await transferSplToken(
      "4a5gQjCLrUnS5MTGH6427RXWanTWGytRoT7WYHhj7d3Z9XVFmTreW81pXC3v1mzwPZkFvqJ4MXsasLwThQRbYXHD",
      "HbUfzDvVH3r5Y28i7U3XRCFfsud1ZwizaGKP5cAVgn9",
      "6ULxRpk6t4EYTfZnwKVste2hzQ8BQzF9KPdcwiu3ha2a",
      1
    )
})()