
/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import logo from '../../assets/images/logo.svg';
import { useState } from "react";
import toast from 'react-hot-toast';


export default function VerifyModal({ show, onClose, onOpenSignIn }) {
    const [otp, setOtp] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const activationToken = localStorage.getItem('activationToken');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            return setErrorMessage('Vui lòng nhập mã xác thực')
        }
        try {
            setLoading(true);
            setErrorMessage(null)
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: Number(otp),
                    activationToken
                }),
            })
            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            if (data.success === false) {
                setLoading(false)
                return setErrorMessage(data.message)
            }
            if (res.ok) {
                localStorage.clear();
                toast.success('Xác thực tài khoản thành công', { duration: 4000 })
                onOpenSignIn();
            }
            setLoading(false)
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
    };

    const handleClose = () => {
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
                        <form onSubmit={handleSubmit}>


                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="otp" value="Mã xác thực" />
                                </div>
                                <TextInput
                                    id="otp"
                                    type="text"
                                    placeholder="Nhập mã xác thực (6 ký tự số)"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.trim())}
                                />
                            </div>

                            <Button gradientDuoTone='purpleToBlue' type="submit" className="capitalize w-full" disabled={loading}>
                                {
                                    loading ? (
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
