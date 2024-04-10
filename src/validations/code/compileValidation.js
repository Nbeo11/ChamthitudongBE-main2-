const validateCompileRequest = (req, res, next) => {
    const { sourceCode, input } = req.body; // Kiểm tra cả sourceCode và input

    if (!sourceCode || typeof sourceCode !== 'string') {
        return res.status(400).json({ error: 'Invalid source code', message: 'Source code must be a string' });
    }

    // Kiểm tra input, nếu input không tồn tại hoặc không phải là một string, bạn có thể thực hiện kiểm tra tùy thuộc vào yêu cầu của bạn

    next();
};

export const compileValidation = {
    validateCompileRequest
};
