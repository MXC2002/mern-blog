import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

// eslint-disable-next-line react/prop-types
export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();

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
            setComment('')
            setCommentError(null);
            setComments([data, ...comments]);
        } catch (error) {
            setCommentError(error.message);
        }

    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getpostcomments/${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    return;
                }

                setComments(data);

            } catch (error) {
                console.log(error.message);
            }
        };
        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/login');
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`, {
                method: 'PUT',
            })
            const data = await res.json();
            if (res.ok) {
                setComments(comments.map((comment) => {
                    return comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    } : comment
                }
                ));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? {
                    ...c,
                    content: editedContent
                } : c

            )
        );
    };

    const handleDeleteComment = async (commentId) => {
        setShowModal(false);
        try {
            if (!currentUser) {
                navigate('/login');
                return;
            }
            const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            // comments.map((comment) => {
            //     comment._id === commentId && setComments(comments.filter((comment) => comment._id !== commentId));
            // })
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.log(error.message);
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
                        value={comment} />
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
            {
                comments.length === 0 ? (
                    <div className='text-gray-500 my-5 flex justify-center'>Chưa có bình luận nào.</div>
                ) : (
                    <>
                        <div className='my-5 flex items-center gap-1'>
                            <p>Số bình luận:</p>
                            <div className='border border-gray-400 py-1 px-2 rounded-md'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {
                            comments.map((comment) => (
                                <Comment key={comment._id}
                                    comment={comment}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                    onDelete={() => {
                                        setShowModal(true);
                                        setCommentToDelete(comment._id);
                                    }} />
                            ))
                        }
                    </>
                )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />

                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-red-400 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-600'>Bạn có chắc chắn muốn xóa bình luận này?</h3>
                        <div className='flex justify-evenly'>
                            <Button color='failure' onClick={() => handleDeleteComment(commentToDelete)}>Chắc chắn</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>Hủy bỏ</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
