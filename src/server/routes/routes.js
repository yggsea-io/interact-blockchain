const  userApi  = require("../api/user");

const users = [
    {
        id: 1,
        name: "Richard Hendricks",
        email: "richard@piedpiper.com",
    },
    {
        id: 2,
        name: "Bertram Gilfoyle",
        email: "gilfoyle@piedpiper.com",
    },
];
const router = app => {
    userApi(app)
}

module.exports = router
