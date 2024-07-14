/* eslint-disable react/prop-types */
import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { HiLockClosed, HiMail, HiUser } from 'react-icons/hi';
import logo from '../../assets/images/logo.svg';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {useState } from "react";
import OAuth from "../OAuth/OAuth";
import toast from 'react-hot-toast';


export default function SignUpModal({ show, onClose, onOpenSignIn, onOpenVerify }) {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

        setErrorMessage(null)
        setLoading(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.email || !formData.confirmPassword) {
            return setErrorMessage('Vui lòng điền vào tất cả các trường')
        }

        if (formData.password !== formData.confirmPassword) {
            return setErrorMessage('Mật khẩu và Xác nhận mật khẩu phải trùng nhau')
        }

        try {
            setLoading(true);
            setErrorMessage(null)
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            if (!res.ok) {
                setLoading(false)
                return setErrorMessage(data.message)
            }
            setLoading(false)
            localStorage.setItem("activationToken", data.activationToken);
            toast.success('Mã xác thực đã gởi đến Mail của bạn', { duration: 3000 })
            onOpenVerify();
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
    };

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
                        <form onSubmit={handleSubmit}>


                            <div className="mb-4">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="username" value="Tên Người Dùng" />
                                </div>
                                <TextInput
                                    id="username"
                                    type="text"
                                    placeholder="Nhập Tên Người Dùng"
                                    required
                                    icon={HiUser}
                                    onChange={handleChange}
                                />
                            </div>

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
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-6">
                                <div className="mb-2 block select-none">
                                    <Label htmlFor="password" value="Mật Khẩu" />
                                </div>
                                <TextInput onChange={handleChange} id="password" placeholder="Nhập Mật Khẩu" type={showPassword ? 'text' : 'password'} required icon={HiLockClosed} />
                                <div className="absolute md:bottom-2.5 bottom-2 right-3" onClick={() => setShowPassword(!showPassword)}>
                                    {formData.password && (
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
                                    <Label htmlFor="confirmPassword" value="Xác Nhận Mật Khẩu" />
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
