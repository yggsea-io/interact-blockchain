const  userApi  = require("../api/user");
const routerSqlite = app => {
    userApi(app)
}
module.exports = routerSqlite
