/* eslint-disable indent */
import { JobModel } from '~/models/code/JobModel';
import { executeCpp } from '~/services/code/executeCpp';
import { generateFile } from '~/services/code/generateFile';

export const runJob = async (req, res) => {
    const { language = 'cpp', code } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: 'Empty code body!' });
    }

    console.log(language, 'Length:', code.length);

    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    const output = await executeCpp(filepath)

    return res.json({filepath, output})
};


export const getJobStatus = async (req, res) => {
    const jobId = req.query.id;

    if (jobId === undefined) {
        return res
            .status(400)
            .json({ success: false, error: 'missing id query param' });
    }

    const job = await JobModel.findById(jobId);

    if (!job) {
        return res.status(400).json({ success: false, error: 'could not find job' });
    }

    return res.status(200).json({ success: true, job });
};
