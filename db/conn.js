const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((con) => {
    console.log('connection successful');
}).catch((err) => {
    console.log("the error is "+err);
});
