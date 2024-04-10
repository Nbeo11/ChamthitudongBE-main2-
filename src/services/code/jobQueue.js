/* eslint-disable indent */
const Queue = require('bull');

import { JobModel } from '~/models/code/JobModel';
import { executeCpp } from './executeCpp';
import { executePy } from './executePy';

const jobQueue = new Queue('job-runner-queue');
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
    const jobId = data.id;
    console.log('jobQueue', jobId)
    const job = await JobModel.findById(jobId);
    
    if (job === undefined) {
        throw Error(`cannot find Job with id ${jobId}`);
    }
    console.log('job', job);

    try {
        let output;
        job['startedAt'] = new Date();
        if (job.language === 'cpp') {
            output = await executeCpp(job.filepath);
            console.log('executeCpp was called successfully'); // Add this line
            console.log(job);
        } else if (job.language === 'py') {
            output = await executePy(job.filepath);
        }
        job['completedAt'] = new Date();
        job['output'] = output;
        job['status'] = 'success';
        await job.save();
        return true;
    } catch (err) {
        job['completedAt'] = new Date();
        job['output'] = JSON.stringify(err);
        job['status'] = 'error';
        await job.save();
        throw Error(JSON.stringify(err));
    }
});

jobQueue.on('failed', (error) => {
    console.error(error.data.id, error.failedReason);
});

export const addJobToQueue = async (jobId) => {
    jobQueue.add({
        id: jobId,
    });
    console.log(jobId)
};
