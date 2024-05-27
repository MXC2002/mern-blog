import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import OAuth from "../components/OAuth";
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

    setErrorMessage(null)
    setLoading(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      return setErrorMessage('Vui lòng điền vào tất cả các trường')
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
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      if (res.ok) {
        navigate('/login')
      }
      setLoading(false)
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen mt-20 md:mb-0 mb-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/"
            className="font-semibold dark:text-white text-4xl">
            <span className="px-2 pt-1.5 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
            Blog

          </Link>
          <p className="text-sm mt-5">
            Chào mừng đến với Blog IT Sharing - nơi bạn có thể khám phá những nguồn thông tin hữu ích, chia sẻ kiến thức và kết nối với cộng đồng đam mê công nghệ
          </p>
        </div>

        {/* right */}
        <div className="flex-1 relative">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Tên Người Dùng" />
              <TextInput
                type="text"
                placeholder="Tên Người Dùng"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="text"
                placeholder="Email (vd: example@gmail.com)"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Label value="Mật khẩu" />
              <TextInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                id="password"
                onChange={handleChange}
              />
              {formData.password && (
                <div className="absolute md:bottom-2.5 bottom-2 right-3">
                  {showPassword ? (
                    <FiEye
                      onClick={handleShowPassword}
                      className="cursor-pointer text-2xl md:text-lg"

                    />
                  ) : (
                    <FiEyeOff
                      onClick={handleShowPassword}
                      className="cursor-pointer text-2xl md:text-lg"
                    />
                  )}
                </div>
              )}
            </div>
            <Button gradientDuoTone='purpleToBlue' type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : 'Đăng ký'
              }
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Bạn đã có tài khoản ?</span>
            <Link to='/login' className="text-blue-500">
              Đăng nhập
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className="mt-5 absolute inset-x-0 items-center" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
