import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({ message: 'API is working' });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép cập nhật người dùng này'));
    }

    // Lấy các trường dữ liệu từ request body
    const { username, email, profilePicture, currentPassword, newPassword } = req.body;

    // Kiểm tra mật khẩu hiện tại và cập nhật mật khẩu mới nếu có
    if (currentPassword && currentPassword !== '') {
        const user = await User.findById(req.params.userId);
        const isMatch = bcryptjs.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return next(errorHandler(401, 'Mật khẩu hiện tại không đúng'));
        }
        if (!newPassword) {
            return next(errorHandler(400, 'Phải nhập mật khẩu mới'));
        }
    }

    // Xử lý mật khẩu mới nếu được cung cấp
    let hashedPassword;
    if (newPassword && newPassword !== '') {
        if (newPassword.length < 6) {
            return next(errorHandler(400, 'Mật khẩu mới phải có ít nhất 6 ký tự'));
        }
        hashedPassword = bcryptjs.hashSync(newPassword, 10);
    }

    // Xây dựng đối tượng chứa các trường dữ liệu cần cập nhật
    const updateFields = {};
    if (username) {
        if (username.length < 4 || username.length > 20) {
            return next(errorHandler(400, 'Tên người dùng phải có từ 4 đến 20 ký tự'));
        }
        updateFields.username = username;
    }
    if (email) {
        updateFields.email = email;
    }
    if (profilePicture) {
        updateFields.profilePicture = profilePicture;
    }
    if (hashedPassword) {
        updateFields.password = hashedPassword;
    }

    try {
        // Thực hiện cập nhật và trả về người dùng đã cập nhật
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateFields, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép xóa người dùng này'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('Người dùng đã bị xóa')
    } catch (error) {
        next(error);
    }
}

export const logout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('Người dùng đã được đăng xuất');
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Bạn không được phép xem danh sách người dùng'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: oneMonthAgo
            }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, 'Không tìm thấy người dùng'));
        };
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}