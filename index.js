const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://hemandh:hemandh@cluster0.w6tzhry.mongodb.net/office?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/userRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
