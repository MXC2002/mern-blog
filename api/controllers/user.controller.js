
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({ message: 'API is working' });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép cập nhật người dùng này'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Mật khẩu phải có ít nhất 6 ký tự'));
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.username) {

        if (req.body.username.length < 5 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Tên người dùng phải có từ 7 đến 20 ký tự'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Tên người dùng không thể chứa khoảng cách'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Tên người dùng chỉ có thể chứa chữ cái và số'));
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép xóa người dùng này'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('Người dùng đã bị xóa')
    } catch (error) {
        next(error);
    }
}