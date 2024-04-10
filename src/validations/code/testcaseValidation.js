import Joi from 'joi';

const TESTCASE_INPUT_OUTPUT_SCHEMA = Joi.object({
    codeId: Joi.string().required(),
    input: Joi.string().required().trim(),
    expectedOutput: Joi.string().required().trim(),
});

const validateTestCase = async (data) => {
    return await TESTCASE_INPUT_OUTPUT_SCHEMA.validateAsync(data, { abortEarly: false });
};

export const testcaseValidation = {
    validateTestCase,
};
