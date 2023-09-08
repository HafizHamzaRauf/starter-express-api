// Import required packages
const mongoose = require('mongoose');
require('dotenv').config();

let db ;
const makeConnection = async ()=> {
try{
// Connect to MongoDB using Mongoose
await  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  db = mongoose.connection;
}
catch(err)
{
    console.log(err)
}
}

const getConnection=async()=>{
    if(db)
    return db;
    await makeConnection();
    return db;
}
module.exports.makeConnection=  makeConnection
module.exports.getConnection = getConnection