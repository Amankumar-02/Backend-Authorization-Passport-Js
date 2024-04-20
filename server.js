import dotenv from 'dotenv';
import dbConnection from './db/index.js';
import {app, port} from './app.js';

dotenv.config({path:"./env"});

dbConnection()
.then(()=>{
    app.listen(port, ()=>{
        console.log("Server is running on port: ", port);
    });
})
.catch(err=>{console.log(err)});