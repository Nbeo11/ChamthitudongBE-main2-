/* eslint-disable indent */
// file: controllers/authController.js
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { studentService } from '~/services/studentService';
const getUserByEmail = async (email) => {
    try {
        const user = await GET_DB().collection('users').findOne({ email });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu bằng tên đăng nhập
        const user = await getUserByEmail(email);

        // Kiểm tra xem người dùng có tồn tại không và so sánh mật khẩu
        if (user && await bcrypt.compare(password, user.password)) {
            console.log(user.user_id);
            if (user.role == 'sinhvien') {
                // Nếu role là 'sinhvien', lấy thông tin chi tiết của sinh viên
                const studentDetails = await studentService.getDetails(user.user_id);
                // Xử lý thông tin sinh viên ở đây (ví dụ: gửi về client)
                // Ví dụ: res.json({ success: true, message: 'Đăng nhập thành công', user, studentDetails });
                return res.json({ success: true, message: 'Đăng nhập thành công', user, studentDetails });
            } else {
                // Nếu role không phải là 'sinhvien'
                return res.json({ success: true, message: 'Đăng nhập thành công', user });
            }
        } else {
            return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi khi đăng nhập:', error);
        return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi đăng nhập' });
    }
};


export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!id || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Missing id, oldPassword, newPassword, or confirmPassword' });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await GET_DB().collection('users').findOne({ _id: new ObjectId(id) });

        // Kiểm tra mật khẩu cũ bằng cách so sánh với mật khẩu đã lưu trong cơ sở dữ liệu bằng bcrypt
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Kiểm tra mật khẩu mới và mật khẩu cũ
        if (newPassword == oldPassword) {
            return res.status(400).json({ message: 'New password and old password match' });
        }

        // Kiểm tra xác nhận mật khẩu mới
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        // Băm mật khẩu mới trước khi cập nhật
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới cho người dùng
        const result = await GET_DB().collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: hashedNewPassword } }
        );

        if (result.modifiedCount === 1) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found or password not updated' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};