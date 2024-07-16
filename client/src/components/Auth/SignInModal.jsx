/* eslint-disable react/prop-types */

import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { HiLockClosed, HiMail } from 'react-icons/hi';
import logo from '../../assets/images/logo.svg';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SignInStart, SignInSuccess, SignInFailure } from "../../redux/user/userSlice";
import OAuth from "../OAuth/OAuth";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";


export default function SignInModal({ show, onClose, onOpenSignUp, onOpenForgotPassword }) {
    const { loading, error: errorMessage } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Vui lòng điền vào Email')
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
            password: Yup.string()
                .required('Vui lòng điền vào Mật khẩu')
        }),
        onSubmit: async (values) => {

            try {
                dispatch(SignInStart());
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                })
                // eslint-disable-next-line no-unused-vars
                const data = await res.json();
                if (!res.ok) {
                    return dispatch(SignInFailure(data.message));
                }
                dispatch(SignInSuccess(data))
                toast(`Chào mừng ${data.username}`,
                    { icon: '🤩' },
                    { duration: 3000 }
                );
                onClose();

            } catch (error) {
                dispatch(SignInFailure(error.message));
            }
        }
    });

    const handleClose = () => {
        dispatch(SignInFailure(null));
        onClose();
    };

    const handleOpenSignUp = () => {
        dispatch(SignInFailure(null));
        onOpenSignUp();
    }

    const handleOpenForgotPassword = () => {
        dispatch(SignInFailure(null));
        onOpenForgotPassword();
    }

    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="select-none">
                            <h3 className="text-2xl text-center uppercase font-black text-gray-700 dark:text-white">Đăng nhập</h3>
                            <div className="flex justify-center items-center mt-2">
                                <p className="text-gray-500">Vào</p>
                                <img src={logo} alt="logo" className='mr-1 h-10 rounded-full object-contain' />

                            </div>
                        </div>
                        {
                            errorMessage && (
                                <Alert className="mt-5 inset-x-0 items-center" color='failure'>
                                    {errorMessage}
                                </Alert>
                            )
                        }
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label className="select-none" htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Nhập Email"
                                    icon={HiMail}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    color={formik.errors.email && formik.touched.email ? 'failure' : ''}
                                />
                                {
                                    formik.errors.email && formik.touched.email ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.email}</div>
                                    ) : null
                                }
                            </div>

                            <div className="relative mb-6">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="password" value="Mật khẩu" />
                                </div>
                                <TextInput
                                    id="password"
                                    name="password"
                                    placeholder="Nhập Mật Khẩu"
                                    type={showPassword ? 'text' : 'password'}
                                    icon={HiLockClosed}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    color={formik.errors.password && formik.touched.password ? 'failure' : ''}
                                />
                                <div className="absolute md:bottom-2.5 bottom-2 right-3 select-none" onClick={() => setShowPassword(!showPassword)}>
                                    {formik.values.password && (
                                        <>
                                            {
                                                showPassword ? (
                                                    <AiFillEye
                                                        className="cursor-pointer text-2xl md:text-lg"

                                                    />
                                                ) : (
                                                    <AiFillEyeInvisible
                                                        className="cursor-pointer text-2xl md:text-lg"
                                                    />
                                                )}
                                        </>
                                    )}
                                </div>

                                {
                                    formik.errors.password && formik.touched.password ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.password}</div>
                                    ) : null
                                }
                            </div>

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={loading}>
                                {
                                    loading ? (
                                        <>
                                            <Spinner size='sm' />
                                            <span className="pl-3">Loading...</span>
                                        </>
                                    ) : 'Đăng nhập'
                                }
                            </Button>

                        </form>

                        <div className="flex justify-center">
                            <div className="text-sm text-cyan-700 hover:underline dark:text-cyan-500 cursor-pointer" onClick={handleOpenForgotPassword}>
                                Quên mật khẩu ?
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">hoặc</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <OAuth onSuccess={handleClose} />
                        </div>

                        <div className="flex justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                            <p>Bạn chưa có tài khoản ?</p>
                            <div className="text-cyan-700 hover:underline dark:text-cyan-500 capitalize cursor-pointer" onClick={handleOpenSignUp}>
                                Đăng ký
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
