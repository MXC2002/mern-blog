import { Alert, Button, Textarea } from 'flowbite-react'
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export default function CommentSection({postId}) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }

        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setCommentError(data.message);
                return;
            }
            if (res.ok) {
                setComment('')
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(error.message);
        }

    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3 border-t'>
            {currentUser ? (
                <div className="flex items-center gap-1 my-3 text-gray-500 text-sm">
                    <p>Đăng nhập với</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username} />
                    <Link to={'/dashboard?tab=profile'} className='text-sm text-cyan-500 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-1 my-3 text-gray-500 text-sm">
                    <p>Đăng nhập để bình luận.</p>
                    <Link className='text-sm font-medium text-blue-600 hover:underline' to={'/login'}>
                        Đăng nhập
                    </Link>
                </div>
            )}
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea placeholder='Viết bình luận' rows='3' maxLength='200' 
                    onChange={(e) => {
                        setComment(e.target.value),
                        setCommentError(null)
                    }} 
                    value={comment}/>
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-sm'>Còn lại {200 - comment.length} ký tự</p>
                        <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                            Bình luận
                        </Button>
                    </div>
                    {commentError &&
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    }
                </form>
            )}
        </div>
    )
}
