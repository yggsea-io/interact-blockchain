const { user } = require("../db/database")

const userApi = app => {
    app.post('/api/user/', (req, res) =>{
        var errors = []
        if(!req.body.password || !req.body.email){
            errors.push("No email or passwork specified")
        }
        if(errors.length){
            res.status(400).json({"error" : errors.join(",")})
            return
        }
        var data = {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }
        var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
        var params =[data.name, data.email, data.password]
        user.run(sql, params, function(err, result){
            if(err){
                res.status(400).json({"error" : err.message})
                return
            }
            res.json({
                "message" : "success",
                "data" : data,
                "id" : this.lastID
            })
        })
    })

    app.get("/api/users", (req, res, next) => {
        var sql = "select * from user"
        var params = []
        user.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });
    
}
module.exports = userApi