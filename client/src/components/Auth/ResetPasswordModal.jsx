
/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import { useState } from "react";
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { HiLockClosed, HiOutlineKey } from "react-icons/hi";
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function ResetPasswordModal({ show, onClose, onOpenSignIn }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const resetToken = localStorage.getItem('resetToken');

    const formik = useFormik({
        initialValues: {
            otp: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            otp: Yup.number()
                .required('Vui lòng điền vào Mã đặt lại mật khẩu')
                .typeError('Vui lòng chỉ nhập số'),
            newPassword: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                .required('Vui lòng điền vào Mật khẩu mới'),
            confirmPassword: Yup.string()
                .required('Vui lòng điền vào Xác nhận mật khẩu')
                .oneOf([Yup.ref('newPassword'), null], 'Không trùng khớp với Mật khẩu mới')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true)
                setErrorMessage(null)
                const res = await fetch('/api/auth/reset-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        otp: Number(values.otp),
                        password: values.newPassword,
                        resetToken
                    }),
                })
                // eslint-disable-next-line no-unused-vars
                const data = await res.json();
                if (!res.ok) {
                    setSubmitting(false)
                    return setErrorMessage(data.message)
                }
                setSubmitting(false)
                localStorage.clear();
                toast.success('Đặt lại mật khẩu thành công', { duration: 3000 })
                onOpenSignIn();
            } catch (error) {
                setErrorMessage(error.message)
                setSubmitting(false)
            }
        }
    });

    const handleClose = () => {
        localStorage.clear()
        formik.resetForm()
        setErrorMessage(null)
        onClose()
    };

    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="select-none flex flex-col items-center gap-2">
                            <img src={logo} alt="logo" className='mr-1 h-10 rounded-full object-contain' />
                            <h3 className="text-2xl uppercase font-black text-gray-700 dark:text-white">Đặt lại mật khẩu</h3>

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
                                    <Label htmlFor="otp" value="Mã Đặt Lại Mật Khẩu" />
                                </div>
                                <TextInput
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="Nhập Mã"
                                    icon={HiOutlineKey}
                                    required
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    color={formik.errors.otp && formik.touched.otp ? 'failure' : ''}
                                />
                                {
                                    formik.errors.otp && formik.touched.otp ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.otp}</div>
                                    ) : null
                                }
                            </div>

                            <div className="mb-6">
                                <div className="relative">
                                    <div className="mb-2 block select-none">
                                        <Label htmlFor="newPassword" value="Mật Khẩu Mới" />
                                    </div>
                                    <TextInput
                                        id="newPassword"
                                        placeholder="Nhập Mật Khẩu Mới"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        icon={HiLockClosed}
                                        value={formik.values.newPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        color={formik.errors.newPassword && formik.touched.newPassword ? 'failure' : ''}
                                    />
                                    <div className="absolute md:bottom-2.5 bottom-2 right-3 select-none" onClick={() => setShowPassword(!showPassword)}>
                                        {formik.values.newPassword && (
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
                                    formik.errors.newPassword && formik.touched.newPassword ? (
                                        <div className="text-sm mt-1 text-red-600">{formik.errors.newPassword}</div>
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
                                        placeholder="Nhập Xác Nhận Mật Khẩu"
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
                                    ) : 'Xác nhận'
                                }
                            </Button>

                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

