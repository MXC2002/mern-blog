
/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import { useState } from "react";
import toast from 'react-hot-toast';
import { HiOutlineKey } from "react-icons/hi";
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function VerifyModal({ show, onClose, onOpenSignIn }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const activationToken = localStorage.getItem('activationToken');

    const formik = useFormik({
        initialValues: {
            otp: ''
        },
        validationSchema: Yup.object({
            otp: Yup.number()
                .required('Vui lòng nhập mã xác thực')
                .typeError('Vui lòng chỉ nhập số'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);
                setErrorMessage(null)
                const res = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        otp: Number(values.otp),
                        activationToken
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
                toast.success('Xác thực tài khoản thành công', { duration: 3000 })
                onOpenSignIn();
            } catch (error) {
                setErrorMessage(error.message)
                setSubmitting(false)
            }
        }
    });


    const handleClose = () => {
        setErrorMessage(null);
        localStorage.clear();
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
                            <h3 className="text-2xl uppercase font-black text-gray-700 dark:text-white">Xác thực tài khoản</h3>

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
                                    <Label htmlFor="otp" value="Mã xác thực" />
                                </div>
                                <TextInput
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="Nhập mã (6 ký tự số)"
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

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={formik.isSubmitting}>
                                {
                                    formik.isSubmitting ? (
                                        <>
                                            <Spinner size='sm' />
                                            <span className="pl-3">Loading...</span>
                                        </>
                                    ) : 'Xác thực'
                                }
                            </Button>

                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}
