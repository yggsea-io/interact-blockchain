module.exports = app => {  
    var tutorialRouter = require('./turorial.routes')
    app.use("/api/tutorials", tutorialRouter);
  };
  