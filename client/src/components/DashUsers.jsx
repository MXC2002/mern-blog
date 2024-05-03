import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { HiCheckCircle, HiOutlineExclamationCircle, HiOutlineTrash, HiXCircle } from 'react-icons/hi';


export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    console.log(users);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 8) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser._id) {
            fetchUsers()
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users])
                if (data.users.length < 8) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-sm">
                        <Table.Head>
                            <Table.HeadCell>Ngày cập nhật</Table.HeadCell>
                            <Table.HeadCell>Hình ảnh</Table.HeadCell>
                            <Table.HeadCell>Tên người dùng</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Xóa</Table.HeadCell>
                            {/* <Table.HeadCell>Sửa</Table.HeadCell> */}
                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800">
                                    <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>

                                        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />

                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {
                                            user.isAdmin ? (
                                                <HiCheckCircle className="text-green-500 mx-auto" />

                                            ) : (
                                                <HiXCircle className="text-red-500 mx-auto" />
                                            )
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HiOutlineTrash onClick={() => {
                                            setShowModal(true);
                                            setUserIdToDelete(user._id)
                                        }} className="text-red-500 cursor-pointer text-xl hover:scale-110" title="Xóa" />
                                    </Table.Cell>
                                    {/* <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <HiPencilAlt className="text-teal-500 cursor-pointer text-xl hover:scale-110" title="Sửa" />
                    </Link>
                  </Table.Cell> */}
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
                <p>Chưa có người dùng nào</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />

                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-red-400 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-600'>Bạn có chắc chắn muốn xóa người dùng này?</h3>
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
