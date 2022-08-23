const { default: axios } = require("axios");
(async() =>{
    const { data } = await axios.get("http://localhost:3002/users") 
    console.log(data)
})()
