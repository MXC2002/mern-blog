import { Button, TextInput } from 'flowbite-react'
import { useSelector } from 'react-redux'

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Hồ sơ</h1>
      <form className='flex flex-col gap-4'>
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img src={currentUser.profilePicture} alt="Người dùng" className='rounded-full w-full h-full border-8 border-[lightgray]
          object-cover' />
        </div>
        <TextInput type='text' id='username' placeholder='Tên tài khoản' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Mật khẩu' />
        <Button type='submit' gradientDuoTone='purpleToBlue'>
          Cập nhật
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Xóa tài khoản</span>
        <span className='cursor-pointer'>Đăng xuất</span>
      </div>
    </div>
  )
}
