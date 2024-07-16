/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { HiLockClosed, HiMail, HiUser } from 'react-icons/hi';
import logo from '../../assets/images/logo.svg';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import OAuth from "../OAuth/OAuth";
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function SignUpModal({ show, onClose, onOpenSignIn, onOpenVerify }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Vui lòng điền vào Tên người dùng')
                .min(4, 'Tên người dùng phải có ít nhất 4 ký tự'),
            password: Yup.string()
                .required('Vui lòng điền vào Mật khẩu')
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
            email: Yup.string()
                .required('Vui lòng điền vào Email')
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
            confirmPassword: Yup.string()
                .required('Vui lòng điền vào Xác nhận mật khẩu')
                .oneOf([Yup.ref('password'), null], 'Không trùng khớp với Mật khẩu')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);
                setErrorMessage(null)
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                })
                // eslint-disable-next-line no-unused-vars
                const data = await res.json();
                if (!res.ok) {
                    setSubmitting(false)
                    return setErrorMessage(data.message)
                }
                setSubmitting(false)
                localStorage.setItem("activationToken", data.activationToken);
                toast.success('Mã xác thực đã gởi đến Mail của bạn', { duration: 3000 })
                onOpenVerify();
            } catch (error) {
                setErrorMessage(error.message)
                setSubmitting(false)
            }
        }
    });

    const handleOpenSignIn = () => {
        setErrorMessage(null);
        onOpenSignIn();

    };

    return (
        <>
            <Modal show={show} size="md" onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="select-none">
                            <h3 className="text-2xl text-center uppercase font-black text-gray-700 dark:text-white">Đăng ký</h3>
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
                                    <Label htmlFor="username" value="Tên Người Dùng" />
                                </div>
                                <TextInput
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Nhập Tên Người Dùng"
                                    required
                                    icon={HiUser}
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    color={formik.errors.username && formik.touched.username ? 'failure' : ''}
                                />
                                {
                                    formik.errors.username && formik.touched.username ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.username}</div>
                                    ) : null
                                }
                            </div>

                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Nhập Email"
                                    required
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

                            <div className="mb-6">
                                <div className="relative">
                                    <div className="mb-2 block select-none">
                                        <Label htmlFor="password" value="Mật Khẩu" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        placeholder="Nhập Mật Khẩu"
                                        type={showPassword ? 'text' : 'password'}
                                        required
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

                                </div>
                                {
                                    formik.errors.password && formik.touched.password ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.password}</div>
                                    ) : null
                                }
                            </div>

                            <div className="mb-6">
                                <div className="relative">
                                    <div className="mb-2 block select-none">
                                        <Label htmlFor="confirmPassword" value="Xác Nhận Mật Khẩu" />
                                    </div>
                                    <TextInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Nhập Mật Khẩu"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        icon={HiLockClosed}
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        color={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'failure' : ''}
                                    />
                                    <div className="absolute md:bottom-2.5 bottom-2 right-3 select-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {formik.values.confirmPassword && (
                                            <>
                                                {
                                                    showConfirmPassword ? (
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

                                </div>
                                {
                                    formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.confirmPassword}</div>
                                    ) : null
                                }
                            </div>

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={formik.isSubmitting}>
                                {
                                    formik.isSubmitting ? (
                                        <>
                                            <Spinner size='sm' />
                                            <span className="pl-3">Loading...</span>
                                        </>
                                    ) : 'Đăng ký'
                                }
                            </Button>

                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">hoặc</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <OAuth onSuccess={onClose} />
                        </div>

                        <div className="flex justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                            <p>Bạn đã có tài khoản ?</p>
                            <div className="text-cyan-700 hover:underline dark:text-cyan-500 capitalize cursor-pointer" onClick={handleOpenSignIn}>
                                Đăng nhập
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
