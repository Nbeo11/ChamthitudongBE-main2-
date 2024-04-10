/* eslint-disable indent */
import express from 'express';
import { testcaseController } from '~/controllers/code/testcaseController.js';
import { testcaseValidation } from '~/validations/code/testcaseValidation.js';

const Router = express.Router();

Router.post('/', async (req, res) => {
    try {
        await testcaseValidation.validateTestCase(req.body);
        await testcaseController.createTestCase(req, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.get('/:codeId', async (req, res) => {
    try {
        await testcaseController.getTestCasesByCodeId(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default Router;
