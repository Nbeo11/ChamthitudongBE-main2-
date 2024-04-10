/* eslint-disable indent */
import { compileCppCode } from '~/services/code/compileService';

exports.compileCode = async (req, res, next) => {
    try {
        const { sourceCode, input } = req.body; // Lấy cả sourceCode và input từ body của yêu cầu

        // Gọi hàm compileCppCode với cả sourceCode và input
        const result = await compileCppCode(sourceCode, input);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
