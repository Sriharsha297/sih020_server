const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

//for cors request
const cors = require('cors');

// config dotenv to use process.env
dotenv.config();

const app = express();

async function connectToDatabase(){
    try{
        const connection = await mongoose.connect('mongodb+srv://Major:Major@major-project-yg9mm.mongodb.net/nyks?retryWrites=true',{
            useNewUrlParser: true
        }); 
        console.log(`connection established successfully`);
        return connection;
    }
    catch(err){
        console.log(`connection was unsucessfull ${err}`);
    }
};
connectToDatabase().then(() => {

    //for cross origin resource sharing
    app.use(cors());

    //static
    app.use('/', express.static(path.join(__dirname, './')));

    //using body-parser
    app.use(bodyParser.json({
        limit: '10mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '10mb',
        parameterLimit: 100000
    }));

    //routes
    const employee = require('./routes/employee');
    app.use('/employee',employee);

    const admin = require('./routes/admin');
    app.use('/admin',admin)

    const hr = require('./routes/hr');
    app.use('/hr',hr)


});

app.listen(process.env.PORT || 8080 , () => {
    console.log(`listening on port 8080.....`);
})