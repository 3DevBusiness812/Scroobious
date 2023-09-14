// TODO: turn this into a script that can be run more easily
import { Queue } from 'bullmq';
import { getRedisConnection, loadConfig, QueuePayload } from '../src/core';

async function removeJobs(queueName: string) {
  const connection = getRedisConnection();
  const queue = new Queue<QueuePayload<{ timestamp: string }>>(queueName, {
    connection,
  });

  const repeatableJobs = await queue.getRepeatableJobs();

  if (repeatableJobs.length > 0) {
    // console.log('Current repeatable configs: ', repeatableJobs);

    repeatableJobs.forEach(async (job) => {
      await queue.removeRepeatableByKey(job.key);
    });
  }
}

async function removeAllJobs() {
  const connection = getRedisConnection();
  const queueNameRegExp = new RegExp('(.*):(.*):id');
  const keys = await connection.keys('*:*:id');
  const queues = keys.map(function (key) {
    const match = queueNameRegExp.exec(key);
    if (match) {
      return {
        prefix: match[1],
        name: match[2],
      };
    }
    return {};
  });

  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];

    await removeJobs(queue.name!);
  }
}

if (require.main === module) {
  loadConfig();

  removeAllJobs()
    .then(() => {
      process.exit(0);
    })
    .catch(console.error);
}
