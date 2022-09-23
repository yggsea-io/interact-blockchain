const resetPass = require('./resetPasword')
main().catch(err => console.log(err))
async function main(){
    const test = await resetPass('kieudaithien2@gmail.com', '12345678', '12345678')
}