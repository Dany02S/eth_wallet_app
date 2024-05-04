const mongoose = require('mongoose');

module.exports = () => {
    const conneectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(process.env.MONGODB_URI, conneectionParams);
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to the database. \n', error);
    }
}