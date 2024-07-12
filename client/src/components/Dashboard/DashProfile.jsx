import { Alert, Button, Label, Modal, TextInput } from 'flowbite-react'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutSuccess,
} from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiLockClosed, HiMail, HiOutlineExclamationCircle, HiUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if 
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageFileUploadError('Không thể tải hình ảnh lên (Tập tin phải nhỏ hơn 2 MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL })
          setImageFileUploading(false);
        })
      }
    )
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    dispatch(updateFailure(null));
    setUpdateUserError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null)

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Không có thay đổi nào được thực hiện')
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Vui lòng chờ hình ảnh được tải lên')
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateUserError('Mật khẩu mới và xác nhận mật khẩu phải trùng nhau')
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setImageFileUploadProgress(null);
        setFormData({
          username: '',
          email: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success('Cập nhật hồ sơ thành công', { duration: 4000 });

      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full relative md:mb-0 mb-20'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Hồ sơ</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,

                }
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="Người dùng" className={`rounded-full w-full h-full border-8 border-[lightgray]
          object-cover transition duration-300 ease-in-out hover:scale-125 ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>
        <Label className='text-center'>
          Avatar
        </Label>
        {imageFileUploadError && <Alert color='failure'>
          {imageFileUploadError}
        </Alert>}
        <div className="space-y-6 mt-2">
          <div className="relative">
            <Label
              htmlFor="username"
              className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm"
            >
              Tên Người Dùng
            </Label>

            <TextInput
              icon={HiUser}
              type="text"
              id="username"
              placeholder="Nhập Tên Người Dùng"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Label htmlFor="email" className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm">
              Email
            </Label>

            <TextInput
              icon={HiMail}
              type="email"
              id="email"
              placeholder="Nhập Email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>

          {/* <div className="relative">

            <Label htmlFor="password" className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm">
              Mật khẩu
            </Label>

            <TextInput
              icon={HiLockClosed}
              type="password"
              id="password"
              placeholder="Nhập Mật Khẩu"
              onChange={handleChange}
            />
          </div> */}

          <div className="relative mb-6">
            <Label htmlFor="currentPassword" className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm">
              Mật Khẩu cũ
            </Label>
            <TextInput onChange={handleChange} id="currentPassword" placeholder="Nhập Mật Khẩu cũ" type={showCurrentPassword ? 'text' : 'password'} value={formData.currentPassword} icon={HiLockClosed} />
            <div className="absolute md:bottom-2.5 bottom-2 right-3" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {formData.currentPassword && (
                <>
                  {
                    showCurrentPassword ? (
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
            <Label htmlFor="newPassword" className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm">
              Mật Khẩu Mới
            </Label>
            <TextInput onChange={handleChange} id="newPassword" placeholder="Nhập Mật Khẩu Mới" type={showNewPassword ? 'text' : 'password'} value={formData.newPassword} icon={HiLockClosed} />
            <div className="absolute md:bottom-2.5 bottom-2 right-3" onClick={() => setShowNewPassword(!showNewPassword)}>
              {formData.newPassword && (
                <>
                  {
                    showNewPassword ? (
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
            <Label htmlFor="confirmPassword" className="absolute -top-3.5 left-3 text-sm px-1 text-gray-700 select-none z-10 bg-white dark:bg-[rgb(16,22,40)] dark:text-gray-200 rounded-sm">
              Xác nhận Mật Khẩu
            </Label>
            <TextInput onChange={handleChange} id="confirmPassword" placeholder="Nhập Xác Nhận Mật Khẩu Mới" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} icon={HiLockClosed} />
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
        </div>

        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
          {loading ? 'Đang tải...' : 'Cập nhật'}
        </Button>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                Tạo bài viết
              </Button>
            </Link>

          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Xóa tài khoản</span>
        <span onClick={handleLogout} className='cursor-pointer'>Đăng xuất</span>
      </div>
      {
        updateUserError && (
          <Alert className='mt-5 absolute inset-x-0 items-center' color='failure'>
            {updateUserError}
          </Alert>
        )
      }
      {
        error && (
          <Alert className='mt-5 absolute inset-x-0 items-center' color='failure'>
            {error}
          </Alert>
        )
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />

        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-600'>Bạn có chắc chắn muốn xóa tài khoản của bạn?</h3>
            <div className='flex justify-evenly'>
              <Button color='failure' onClick={handleDeleteUser}>Chắc chắn</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Hủy bỏ</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
