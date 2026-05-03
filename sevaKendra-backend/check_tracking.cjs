const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Tracking = require('./src/modules/tracking/tracking.model.js');

async function checkCounts() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const stats = await Tracking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('Tracking Status Counts:');
    console.log(JSON.stringify(stats, null, 2));
    
    const total = await Tracking.countDocuments();
    console.log('Total Tracking Records:', total);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCounts();
