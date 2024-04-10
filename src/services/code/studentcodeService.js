/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import { student_examModel } from '~/models/Exam/student_examModel';
import { studentcodeModel } from '~/models/code/studentcodeModel';
import { compileCppCode } from '~/services/code/compileService';
import ApiError from '~/utils/ApiError';
import { question_bankService } from '../Exam/question_bankService';
import { student_examService } from '../Exam/student_examService';


const createNewStudentCode = async (reqBody) => {
    try {
        const newStudentCode = {
            ...reqBody
        };
        const data = await question_bankService.getDetails(newStudentCode.question_bankId);
        const data2 = await student_examService.getDetails(newStudentCode.student_examId);

        let questionScore = 0;
        if (ObjectId.isValid(newStudentCode.question_bankId)) {
            const questionData = data2.question.find(item => item.question_bankId.equals(new ObjectId(newStudentCode.question_bankId)));

            if (questionData) {
                questionScore = questionData.question_score;
                console.log('questionScore:', questionScore);
            } else {
                console.log('No question data found for question_bankId:', newStudentCode.question_bankId);
            }
        } else {
            console.log('newStudentCode.question_bankId is not a valid ObjectId:', newStudentCode.question_bankId);
        }

        const inputs = data.inputs;
        const allInputs = inputs.map(item => item.input);
        newStudentCode.startedAt = new Date();

        const compileResult = await compileCppCode(newStudentCode.sourceCode, allInputs);
        const output = [];

        // Duyệt qua mảng kết quả thực thi từ compileCppCode

        let scoregot = 0;
        compileResult.results.forEach((result, index) => {
            // Lấy kết quả thực thi của mỗi lần chạy
            const executionOutput = result.executionOutput.trim();
            const executionError = result.executionError;
            const expectedOutput = inputs[index].testcase;
            const input = inputs[index].input;
            const check = executionOutput === inputs[index].testcase;
            let score = 0;
            if (check) {
                score = inputs[index].score_percentage * questionScore / 100;
                scoregot += score;
            }

            console.log('score: ', score)
            // Push kết quả thực thi vào mảng output
            output.push({ input: input, expectedOutput: expectedOutput, executionOutput: executionOutput, executionError: executionError, check: check, score: score });
        });

        

        newStudentCode.completedAt = new Date();
        const start = moment(newStudentCode.startedAt);
        const end = moment(newStudentCode.completedAt);
        const executionTime = `${end.diff(start, 'second', true).toFixed(3)}s`;

        console.log('runtime: ', executionTime)
        console.log('questionScore: ', questionScore)

        console.log('data: ', inputs)
        // Gán mảng output vào newStudentCode
        newStudentCode.output = output;
        newStudentCode.scoregot = scoregot;
        newStudentCode.executionTime = executionTime;

        //newStudentCode.output = compileResult.output;
        const createdStudentCode = await studentcodeModel.createNew(newStudentCode);
        const getNewStudentCode = await studentcodeModel.findOneById(createdStudentCode.insertedId);
        await student_examModel.calculateAndUpdateFinalScore(getNewStudentCode.student_examId)
        return getNewStudentCode;
    } catch (error) {
        throw error;
    }
};

const getAllByStudentExamId = async (student_examId) => {
    try {
        const allStudentCodes = await studentcodeModel.getAllByStudentExamId(student_examId);
        return allStudentCodes;
    } catch (error) {
        throw error;
    }
};

const getStudentCodeDetails = async (studentCodeId) => {
    try {
        const studentCode = await studentcodeModel.getDetails(studentCodeId);
        if (!studentCode) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student code not found!');
        }
        return studentCode;
    } catch (error) {
        throw error;
    }
};

const findOneByQuestionAndExamId = async (student_examId, question_bankId) => {
    try {
        const result = await studentcodeModel.findOneByQuestionAndExamId(student_examId, question_bankId);
        return result;

    } catch (error) {
        throw new Error(error);
    }
}
const getDetails = async (student_codeId) => {
    try {
        const student_code = await studentcodeModel.getDetails(student_codeId)
        if (!student_code) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'student_code not found!')
        }

        return student_code
    } catch (error) {
        throw error
    }
}


const updateStudentCode = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        };
        // Kiểm tra xem source code đã được cập nhật hay không
        if (reqBody.sourceCode) {
            // Nếu có, thực hiện biên dịch lại và cập nhật kết quả thực thi mới
            const data = await question_bankService.getDetails(updateData.question_bankId);
            const data2 = await student_examService.getDetails(updateData.student_examId);

            let questionScore = 0;
            if (ObjectId.isValid(updateData.question_bankId)) {
                const questionData = data2.question.find(item => item.question_bankId.equals(new ObjectId(updateData.question_bankId)));

                if (questionData) {
                    questionScore = questionData.question_score;
                    console.log('questionScore:', questionScore);
                } else {
                    console.log('No question data found for question_bankId:', updateData.question_bankId);
                }
            } else {
                console.log('updateData.question_bankId is not a valid ObjectId:', updateData.question_bankId);
            }

            const inputs = data.inputs;
            const allInputs = inputs.map(item => item.input);
            updateData.startedAt = new Date();

            const compileResult = await compileCppCode(updateData.sourceCode, allInputs);
            const output = [];

            // Duyệt qua mảng kết quả thực thi từ compileCppCode

            let scoregot = 0;
            compileResult.results.forEach((result, index) => {
                // Lấy kết quả thực thi của mỗi lần chạy
                const executionOutput = result.executionOutput.trim();
                const executionError = result.executionError;
                const expectedOutput = inputs[index].testcase;
                const input = inputs[index].input;
                const check = executionOutput === inputs[index].testcase;
                let score = 0;
                if (check) {
                    score = inputs[index].score_percentage * questionScore / 100;
                    scoregot += score;
                }

                // Push kết quả thực thi vào mảng output
                output.push({ input: input, expectedOutput: expectedOutput, executionOutput: executionOutput, executionError: executionError, check: check, score: score });
            });

            updateData.completedAt = new Date();
            const start = moment(updateData.startedAt);
            const end = moment(updateData.completedAt);
            const executionTime = `${end.diff(start, 'second', true).toFixed(3)}s`;

            console.log('runtime: ', executionTime)
            console.log('questionScore: ', questionScore)

            console.log('data: ', inputs)
            // Gán mảng output vào updateData
            updateData.output = output;
            updateData.scoregot = scoregot;
            console.log('scoregot: ', scoregot)
            updateData.executionTime = executionTime;
            

        }
        // Cập nhật thông tin mới của StudentCode
        const updatedStudentCode = await studentcodeModel.update(id, updateData);
        await student_examModel.calculateAndUpdateFinalScore(updatedStudentCode.student_examId);

        return updatedStudentCode;
    } catch (error) {
        throw error;
    }
};

const deleteStudentCode = async (studentCodeId) => {
    try {
        const targetStudentCode = await studentcodeModel.findOneById(studentCodeId);
        if (!targetStudentCode) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Student code not found!');
        }
        await studentcodeModel.deleteOneById(studentCodeId);
        return { deleteResult: 'The student code and its references have been deleted!' };
    } catch (error) {
        throw error;
    }
};

export const studentcodeService = {
    createNewStudentCode,
    getAllByStudentExamId,
    getDetails,
    getStudentCodeDetails,
    updateStudentCode,
    deleteStudentCode,
    findOneByQuestionAndExamId
};
