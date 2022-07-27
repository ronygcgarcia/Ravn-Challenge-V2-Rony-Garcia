import Bull from 'bull';

const bull = new Bull('notifications' ,{
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

bull.on('completed', () => {
  console.log(`Job completed`);
})


export default bull;