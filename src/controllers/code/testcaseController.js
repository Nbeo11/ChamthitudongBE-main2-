/* eslint-disable indent */
import { testcaseService } from '~/services/code/testcaseService';

const createTestCase = async (req, res) => {
    try {
        const { codeId, input, expectedOutput } = req.body;
        const testCaseData = { codeId, input, expectedOutput };
        const testCase = await testcaseService.createNew(testCaseData);
        res.json(testCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTestCase = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedTestCase = await testcaseService.updateTestCase(id, updateData);
        res.json(updatedTestCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTestCasesByCodeId = async (req, res) => {
    try {
        const { codeId } = req.params;
        const testCases = await testcaseService.getTestCasesByCodeId(codeId);
        res.json(testCases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const testcaseController = {
    createTestCase,
    getTestCasesByCodeId,
    updateTestCase
};
