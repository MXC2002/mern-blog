import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import sendMail from "../services/sendMail.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'Tất cả các trường là bắt buộc'))
    }

    if (username.length < 4 || username.length > 20) {
        return next(errorHandler(400, 'Tên người dùng phải có từ 4 đến 20 ký tự'));
    }

    if (password.length < 6) {
        return next(errorHandler(400, 'Mật khẩu phải có ít nhất 6 ký tự'));
    }

    const user = await User.findOne({ email });

    if (user) {
        return next(errorHandler(409, 'Email đã tồn tại'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    const otp = Math.floor(Math.random() * 1000000)

    const activationToken = jwt.sign(
        { user: newUser, otp },
        process.env.ACTIVATION_SECRET,
        { expiresIn: '5m' }
    )

    await sendMail(
        email,
        'Xác thực tài khoản',
        `Mã Xác thực của bạn là: ${otp}`
    )

    try {
        res.status(200).json({
            message: 'Mã xác thực đã gởi đến Mail của bạn',
            activationToken
        })

    } catch (error) {
        next(error);
    }

}

export const verifyUser = async (req, res, next) => {
    try {
        const { otp, activationToken } = req.body;

        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

        if (!verify) {
            return next(errorHandler(401, 'Mã xác thực đã hết hạn'))
        }
        if (verify.otp !== otp) {
            return next(errorHandler(401, 'Mã xác thực không đúng'))
        }

        await User.create({
            username: verify.user.username,
            email: verify.user.email,
            password: verify.user.password
        })

        res.status(200).json({
            message: 'Xác thực tài khoản thành công'
        })
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || email === '') {
            return next(errorHandler(400, 'Vui lòng nhập Email'))
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'Không tìm thấy người dùng với Email này'))
        }

        const otp = Math.floor(Math.random() * 1000000)

        const resetToken = jwt.sign(
            { user: user, otp },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '10m' }
        );

        await sendMail(
            email,
            'Đặt lại mật khẩu',
            `Mã đặt lại mật khẩu của bạn là: ${otp}`
        )

        res.status(200).json({
            message: 'Mã đặt lại mật khẩu đã gởi đến Mail của bạn',
            resetToken
        })

    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { otp, resetToken, password } = req.body;

        const verify = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);


        if (!verify) {
            return next(errorHandler(401, 'Mã đặt lại mật khẩu đã hết hạn'))
        }
        if (verify.otp !== otp) {
            return next(errorHandler(401, 'Mã đặt lại mật khẩu không đúng'))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        await User.updateOne({ email: verify.user.email },
            {
                $set: {
                    password: hashedPassword
                }

            }
        )

        res.status(200).json({
            message: 'Đặt lại mật khẩu thành công'
        })
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Tất cả các trường là bắt buộc'))
    }

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'Không tìm thấy người dùng'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Mật khẩu không đúng'))
        }
        const token = jwt.sign(
            {
                id: validUser._id,
                isAdmin: validUser.isAdmin
            },
            process.env.JWT_SECRET

        );
        const { password: pass, ...rest } = validUser._doc

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'strict',
        }).json(rest)
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password: pass, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'strict',
            }).json(rest)

        }
    } catch (error) {
        next(error);
    }
}