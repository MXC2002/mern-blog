/* eslint-disable react/prop-types */

import { Button, Alert, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { HiMail } from 'react-icons/hi';
import logo from '../../assets/images/logo.svg';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SignInStart, SignInSuccess, SignInFailure } from "../../redux/user/userSlice";
import OAuth from "../OAuth/OAuth";


export default function SignInModal({ show, onClose, onOpenSignUp }) {

    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

        dispatch(SignInFailure(null))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.password || !formData.email) {
            return dispatch(SignInFailure('Vui lòng điền vào tất cả các trường'))
        }
        try {
            dispatch(SignInStart());
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            if (data.success === false) {
                return dispatch(SignInFailure(data.message))
            }

            if (res.ok) {
                dispatch(SignInSuccess(data))
                onClose();
            }
        } catch (error) {
            dispatch(SignInFailure(error.message))
        }
    };

    const handleClose = () => {
        dispatch(SignInFailure(null));
        onClose();
    };

    const handleOpenSignUp = () => {
        dispatch(SignInFailure(null));
        onOpenSignUp();
    }

    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl text-center uppercase font-black text-gray-900 dark:text-white">Đăng nhập</h3>
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
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="your_email@gmail.com"
                                    required
                                    icon={HiMail}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-6">
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Mật khẩu" />
                                </div>
                                <TextInput onChange={handleChange} id="password" placeholder="**********" type={showPassword ? 'text' : 'password'} required />
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
                            <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                                Quên mật khẩu ?
                            </a>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">hoặc</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <OAuth />
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
