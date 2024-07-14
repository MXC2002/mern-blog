
/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import { useState } from "react";
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { HiLockClosed, HiOutlineKey } from "react-icons/hi";


export default function ResetPasswordModal({ show, onClose, onOpenSignIn }) {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const resetToken = localStorage.getItem('resetToken');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

        setErrorMessage(null)
        setLoading(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
            return setErrorMessage('Vui lòng điền vào tất cả các trường')
        }
        if (formData.newPassword !== formData.confirmPassword) {
            return setErrorMessage('Mật khẩu mới và xác nhận mật khẩu phải trùng nhau')
        }

        if (formData.newPassword.length < 6) {
            return setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự')
        }

        try {
            setLoading(true);
            setErrorMessage(null)
            const res = await fetch('/api/auth/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: Number(formData.otp),
                    password: formData.newPassword,
                    resetToken
                }),
            })
            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            if (!res.ok) {
                setLoading(false)
                return setErrorMessage(data.message)
            }
            setLoading(false)
            localStorage.clear();
            toast.success('Đặt lại mật khẩu thành công', { duration: 3000 })
            onOpenSignIn();
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
    };

    const handleClose = () => {
        localStorage.clear();
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
                            <h3 className="text-2xl uppercase font-black text-gray-700 dark:text-white">Đặt lại mật khẩu</h3>

                        </div>
                        {
                            errorMessage && (
                                <Alert className="mt-5 inset-x-0 items-center" color='failure'>
                                    {errorMessage}
                                </Alert>
                            )
                        }
                        <form onSubmit={handleSubmit}>


                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="otp" value="Mã đặt lại mật khẩu" />
                                </div>
                                <TextInput
                                    id="otp"
                                    type="text"
                                    placeholder="Nhập mã (6 ký tự số)"
                                    icon={HiOutlineKey}
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-6">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="newPassword" value="Mật khẩu" />
                                </div>
                                <TextInput onChange={handleChange} id="newPassword" placeholder="Nhập Mật Khẩu" type={showPassword ? 'text' : 'password'} required icon={HiLockClosed} />
                                <div className="absolute md:bottom-2.5 bottom-2 right-3" onClick={() => setShowPassword(!showPassword)}>
                                    {formData.newPassword && (
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

                            <div className="relative mb-6">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="confirmPassword" value="Xác nhận mật khẩu" />
                                </div>
                                <TextInput onChange={handleChange} id="confirmPassword" placeholder="Nhập Mật Khẩu" type={showConfirmPassword ? 'text' : 'password'} required icon={HiLockClosed} />
                                <div className="absolute md:bottom-2.5 bottom-2 right-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {formData.confirmPassword && (
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

                            

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={loading}>
                                {
                                    loading ? (
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

