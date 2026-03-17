const cron = require('node-cron');
const Idea = require('../models/Idea');

const initCronJobs = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running expiry check...');
    try {
      const now = new Date();
      const result = await Idea.updateMany(
        {
          expiryTime: { $lte: now },
          isArchived: false
        },
        {
          isArchived: true
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`Archived ${result.modifiedCount} expired ideas.`);
      }
    } catch (error) {
      console.error('Error in expiry cron job:', error);
    }
  });
};

module.exports = initCronJobs;
