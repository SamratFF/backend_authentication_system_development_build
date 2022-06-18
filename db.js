const mongoose = require('mongoose');

const mongoURI = `mongodb://localhost:27017/authentication_api`;
// const uri = process.env.MONGODB_URI;

const connectToMongo = async () => {
     await mongoose.connect(mongoURI, () => {
         console.log(`Connected to Mongo Successfully`);
     });
	//  await mongoose.connect(uri, () => {
     //      console.log(`Connected to Mongo Successfully`);
     // });
}

module.exports = connectToMongo;