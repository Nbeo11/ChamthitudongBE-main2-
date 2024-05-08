/* eslint-disable indent */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


exports.compileCppCode = async (sourceCode, inputs = []) => {
    try {
        // Tạo thư mục tạm nếu nó chưa tồn tại
        const dirCodes = path.join(__dirname, 'temp');
        if (!fs.existsSync(dirCodes)) {
            fs.mkdirSync(dirCodes, { recursive: true });
        }

        const jobId = uuid();
        const filename = `${jobId}.cpp`
        const fileout = `${jobId}`

        // Xác định đường dẫn đến file exe đã tạo
        const exeFilePath = path.join(dirCodes, fileout);

        // Ghi source code vào file tạm

        const filepath = path.join(dirCodes, filename);
        fs.writeFileSync(filepath, sourceCode);

        console.log('Source code written to file:', filepath);

        // Biên dịch chương trình và tạo file exe mới
        const compileProcess = spawn('g++', ['-o', exeFilePath, filepath]);

        await new Promise((resolve, reject) => {
            // Sau khi quy trình biên dịch đã kết thúc, kiểm tra và xóa tệp exe
            compileProcess.on('close', (code) => {
                if (code === 0) {
                    // Chờ cho quy trình biên dịch kết thúc trước khi xóa tệp exe
                    fs.unlink(exeFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting exe file:', err);
                        } else {
                            console.log('Exe file deleted successfully');
                        }
                    });
                    resolve();
                } else {
                    reject(new Error('Compilation failed with code ' + code));
                }
            });

        });

        console.log('Compilation successful');

        const results = [];

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            console.log('Input:', input);

            // Thực thi chương trình đã biên dịch với dữ liệu đầu vào
            const executionProcess = spawn(exeFilePath, [], { stdio: 'pipe', detached: true });

            let executionOutput = '';
            let executionError = '';

            // Ghi dữ liệu đầu vào vào stdin của chương trình
            executionProcess.stdin.write(input ? input.toString() : '');

            executionProcess.stdin.end();

            executionProcess.stdout.on('data', (data) => {
                executionOutput += data.toString();
            });

            executionProcess.stderr.on('data', (data) => {
                executionError += data.toString();
            });

            await new Promise((resolve) => {
                executionProcess.on('close', () => {
                    results.push({ executionOutput, executionError });
                    resolve();
                });
            });

            console.log('Execution output:', executionOutput);
            console.error('Execution error:', executionError);
            console.log('Execution output result:', results);
        }

        fs.unlinkSync(`${filepath}`);
        fs.unlinkSync(`${exeFilePath}.exe`);

        // Trả về kết quả của quá trình biên dịch và thực thi
        return { message: 'Compilation and execution successful', results };

    } catch (error) {
        throw new Error('Compilation failed: ' + error.message);
    }
};