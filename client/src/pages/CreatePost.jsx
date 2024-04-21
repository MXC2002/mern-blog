import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Vui lòng chọn 1 hình ảnh!');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0))
                },
                // eslint-disable-next-line no-unused-vars
                (error) => {
                    setImageUploadError('Không thể tải hình ảnh lên');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({
                            ...formData,
                            image: downloadURL
                        });
                    });
                }
            )
        } catch (error) {
            setImageUploadError('Không thể tải hình ảnh lên')
            setImageUploadProgress(null);
            console.log(error);
        }
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Tạo bài viết</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder='Tiêu đề' required id='title' className='flex-1' />
                    <Select>
                        <option value="uncategorized">Chọn danh mục</option>
                        <option value="javascript">Javascript</option>
                        <option value="nodejs">Nodejs</option>
                        <option value="reactjs">ReactJS</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                </div>
                            ) : (
                                'Tải hình ảnh lên'
                            )
                        }
                    </Button>
                </div>
                {
                    imageUploadError && (
                        <Alert color='failure'>{imageUploadError}</Alert>
                    )
                }
                {
                    formData.image && (
                        <img src={formData.image} alt="upload" className='w-full h-auto object-contain' />
                    )
                }
                <ReactQuill theme='snow' placeholder='Viết nội dung...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Đăng bài
                </Button>
            </form>
        </div>
    )
}
