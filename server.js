const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const secrets = require('./config/secrets');
const auth = require('./routes/auth');
const users = require('./routes/users');
const threads = require('./routes/threads');
const comments = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || secrets.mongo_connection, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


const allowCrossDomain = (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/api/auth",auth);
app.use('/api/users',users);
app.use('/api/threads',threads);
app.use('/api/comments',comments);



const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("Connected to database");

});

if(process.env.NODE_ENV === "production")
{
    app.use(express.static('client/build'));
}
app.listen(PORT, () => console.log('Server listening on port 3001'));

module.exports = app;
