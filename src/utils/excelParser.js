/* eslint-disable indent */
/* eslint-disable semi */
// utils/excelParser.js

import exceljs from 'exceljs';

/**
 * Phân tích dữ liệu từ file Excel và trả về dưới dạng mảng các đối tượng sinh viên.
 * @param {string} filePath Đường dẫn đến file Excel
 * @returns {Promise<Array>} Mảng các đối tượng sinh viên
 */
export const parseExcelFile = async (filePath) => {
    try {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        const studentsData = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) { // Bỏ qua dòng tiêu đề
                const student = {
                    courseId: row.getCell(1).value,
                    ologyId: row.getCell(2).value,
                    gradeId: row.getCell(3).value,
                    username: row.getCell(4).value,
                    email: row.getCell(5).value,
                    password: row.getCell(6).value,
                    birth: row.getCell(7).value,
                    gender: row.getCell(8).value,
                    phoneNumber: row.getCell(9).value,
                    role: row.getCell(10).value,
                    note: row.getCell(11).value
                };
                studentsData.push(student);
            }
        });

        return studentsData;
    } catch (error) {
        throw new Error('Error parsing Excel file: ' + error.message);
    }
};
