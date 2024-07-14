
/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import { useState } from "react";
import toast from 'react-hot-toast';
import { HiMail } from "react-icons/hi";


export default function ForgotPasswordModal({ show, onClose, onOpenResetPassword }) {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return setErrorMessage('Vui lòng nhập email của bạn')
        }
        try {
            setLoading(true);
            setErrorMessage(null)
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email}),
            })
            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            if (!res.ok) {
                setLoading(false)
                return setErrorMessage(data.message)
            }
            setLoading(false)
            localStorage.setItem("resetToken", data.resetToken);
            toast.success('Mã đặt lại mật khẩu đã gởi đến Mail của bạn', { duration: 3000 })
            onOpenResetPassword();
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
    };

    const handleClose = () => {
        setEmail('');
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
                        <form onSubmit={handleSubmit}>


                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="Nhập Email"
                                    required
                                    icon={HiMail}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                />
                            </div>

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={loading}>
                                {
                                    loading ? (
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

