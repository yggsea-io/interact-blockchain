const sqlite3 = require('sqlite3').verbose()
const path = require("path")

const USER_SOURCE = path.join(__dirname, './source/users')
const TEST_TRANSACTION_SOURCE = path.join(__dirname, './source/transaction/bsc')

let user = new sqlite3.Database(USER_SOURCE, (err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('Connected to the SQLite database')
    user.get('SELECT * from user',[], (err) =>{
        if(err){
            user.run(
                `CREATE TABLE user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name text, 
                    email text UNIQUE, 
                    password text, 
                    CONSTRAINT email_unique UNIQUE (email)
                )`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })}
        })
    
    // })
})


module.exports = {
    user,
}