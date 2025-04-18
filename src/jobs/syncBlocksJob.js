import { syncBlocksAndTxs } from '../lib/syncBlocks.js';
import cron from 'node-cron';

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    await syncBlocksAndTxs();
    console.log('Blockchain sync completed.');
  } catch (err) {
    console.error('Blockchain sync failed:', err);
  }
});

// Optionally run once on startup
(async () => {
  try {
    await syncBlocksAndTxs();
    console.log('Initial blockchain sync completed.');
  } catch (err) {
    console.error('Initial blockchain sync failed:', err);
  }
})();
