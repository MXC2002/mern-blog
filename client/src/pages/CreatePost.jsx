import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [PublishError, setPublishError] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Đã xảy ra lỗi');
        }
    };

    //custom toolbar react quill
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'], [{ 'code-block': true }],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list',
        'link', 'image', 'code-block',
    ];

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Tạo bài viết</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder='Tiêu đề' required id='title' className='flex-1' onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    } />
                    <Select onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }>
                        <option value="uncategorized">--Chọn danh mục--</option>
                        <option value="javascript">Javascript</option>
                        <option value="nodejs">NodeJS</option>
                        <option value="reactjs">ReactJS</option>
                        <option value="other">Other</option>
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
                <ReactQuill theme='snow' placeholder='Viết nội dung...' className='h-72 mb-12' required onChange={(value) => setFormData({
                    ...formData,
                    content: value
                })} modules={modules}
                    formats={formats} />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Đăng bài
                </Button>
                {
                    PublishError && (
                        <Alert className='mt-5' color='failure'>{PublishError}</Alert>
                    )
                }
            </form>
        </div>
    )
}
