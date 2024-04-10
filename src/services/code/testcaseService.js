/* eslint-disable indent */
import { testcaseModel } from '~/models/code/testcaseModel';

const createTestCase = async (data) => {
    try {
        return await testcaseModel.createNew(data);
    } catch (error) {
        throw new Error(error);
    }
};

const getTestCasesByCodeId = async (codeId) => {
    try {
        return await testcaseModel.getTestCasesByCodeId(codeId);
    } catch (error) {
        throw new Error(error);
    }
};

export const testcaseService = {
    createTestCase,
    getTestCasesByCodeId,
};
