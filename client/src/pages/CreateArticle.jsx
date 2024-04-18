import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateArticle() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Tạo bài viết</h1>
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Tiêu đề' required id='title' className='flex-1'/>
                <Select>
                    <option value="uncategorized">Chọn danh mục</option>
                    <option value="javascript">Javascript</option>
                    <option value="nodejs">Nodejs</option>
                    <option value="reactjs">ReactJS</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*'/>
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline>Tải lên hình ảnh</Button>
            </div>
            <ReactQuill theme='snow' placeholder='Viết nội dung...' className='h-72 mb-12' required/>
            <Button type='submit' gradientDuoTone='purpleToPink'> 
                Đăng bài
            </Button>
        </form>
    </div>
  )
}
