import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/"
            className="font-semibold dark:text-white text-4xl">
            <span className="px-2 pt-1 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
            Blog

          </Link>
          <p className="text-sm mt-5">
            Chào mừng đến với Blog IT Sharing - nơi bạn có thể khám phá những nguồn thông tin hữu ích, chia sẻ kiến thức và kết nối với cộng đồng đam mê công nghệ
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Tên tài khoản" />
              <TextInput
                type="text"
                placeholder="Tên, email hoặc số điện thoại"
                id="username"
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="text"
                placeholder="example@gmail.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Mật khẩu" />
              <TextInput
                type="text"
                placeholder="Mật khẩu"
                id="password"
              />
            </div>
            <Button gradientDuoTone='purpleToBlue' type="submit">
              Đăng ký
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Bạn đã có tài khoản ?</span>
            <Link to='/login' className="text-blue-500">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
