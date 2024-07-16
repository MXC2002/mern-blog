
/* eslint-disable react/prop-types */
import { Button, Label, Modal, TextInput, Spinner, Alert } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import toast from 'react-hot-toast';
import { HiMail } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";


export default function ForgotPasswordModal({ show, onClose, onOpenResetPassword }) {

    const [errorMessage, setErrorMessage] = useState(null);

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Vui lòng điền vào Email')
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ')
        }),
        onSubmit: async (values, { setSubmitting } ) => {
            try {
                setSubmitting(true);
                setErrorMessage(null);
                const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: values.email}),
                })
                // eslint-disable-next-line no-unused-vars
                const data = await res.json();
                if (!res.ok) {
                    setSubmitting(false);
                    return setErrorMessage(data.message);
                }
                setSubmitting(false);
                localStorage.setItem("resetToken", data.resetToken);
                toast.success('Mã đặt lại mật khẩu đã gởi đến Mail của bạn', { duration: 3000 })
                onOpenResetPassword();
            } catch (error) {
                setErrorMessage(error.message);
                setSubmitting(false);
            }
        }
    });

    const handleClose = () => {
        formik.resetForm();
        setErrorMessage(null);
        onClose();
    };

    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="select-none flex flex-col items-center gap-2">
                            <img src={logo} alt="logo" className='mr-1 h-10 rounded-full object-contain' />
                            <h3 className="text-2xl uppercase font-black text-gray-700 dark:text-white">Quên mật khẩu ?</h3>

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
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
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

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={formik.isSubmitting}>
                                {
                                    formik.isSubmitting ? (
                                        <>
                                            <Spinner size='sm' />
                                            <span className="pl-3">Loading...</span>
                                        </>
                                    ) : 'Gửi mã đến Mail'
                                }
                            </Button>

                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

