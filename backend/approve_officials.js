const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const User = require('./models/User');

const approveOfficials = async () => {
    await connectDB();

    try {
        const result = await User.updateMany(
            { role: 'official', isApproved: false },
            { $set: { isApproved: true } }
        );
        console.log(`Successfully approved ${result.modifiedCount} official accounts!`);
    } catch (err) {
        console.error('Error approving accounts:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

approveOfficials();
