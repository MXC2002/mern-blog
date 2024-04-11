import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi'


export default function DashProfile() {
  const { currentUser, error } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const filePickerRef = useRef()
  const dispatch = useDispatch()

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
        setImageFileUploadError('Không thể tải lên hình ảnh (Tập tin phải nhỏ hơn 2 MB)');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null)
    setUpdateUserSuccess(null)

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Không có thay đổi nào được thực hiện')
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Vui lòng chờ hình ảnh được tải lên')
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Hồ sơ người dùng được cập nhật thành công');

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
          object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadError && <Alert color='failure'>
          {imageFileUploadError}
        </Alert>}
        <TextInput type='text' id='username' placeholder='Tên tài khoản' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='Mật khẩu' onChange={handleChange} />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Cập nhật
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Xóa tài khoản</span>
        <span className='cursor-pointer'>Đăng xuất</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5 absolute inset-x-0 items-center'>
          {updateUserSuccess}
        </Alert>
      )}
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
