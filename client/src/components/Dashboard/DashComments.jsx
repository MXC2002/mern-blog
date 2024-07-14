/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';


export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user)
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/comment/getcomments`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                    setLoading(false);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error.message);
            }
        };
        
        if (currentUser.isAdmin) {
            fetchComments();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    if (loading) {
        return (
            <div className='md:mx-auto flex justify-center items-center min-h-96'>
                <Spinner size='xl' />
            </div>
        )
    }

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className="shadow-sm text-center">
                        <Table.Head>
                            <Table.HeadCell>Ngày tạo</Table.HeadCell>
                            <Table.HeadCell>Ngày cập nhật</Table.HeadCell>
                            <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
                            <Table.HeadCell>Số lượt thích</Table.HeadCell>
                            <Table.HeadCell>Tên bài viết</Table.HeadCell>
                            <Table.HeadCell>Tên người dùng</Table.HeadCell>
                            <Table.HeadCell>Xóa</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800">
                                    <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId?.title}</Table.Cell>
                                    <Table.Cell>{comment.userId?.username}</Table.Cell>
                                    <Table.Cell>
                                        <HiOutlineTrash onClick={() => {
                                            setShowModal(true);
                                            setCommentIdToDelete(comment._id)
                                        }} className="text-red-500 cursor-pointer text-xl hover:scale-110" title="Xóa" />
                                    </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-base py-5">
                                Xem thêm
                            </button>
                        )
                    }
                </>
            ) : (
                <p>Chưa có bình luận nào</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />

                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-red-400 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-600'>Bạn có chắc chắn muốn xóa bình luận này?</h3>
                        <div className='flex justify-evenly'>
                            <Button color='failure' onClick={handleDeleteComment}>Chắc chắn</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>Hủy bỏ</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
