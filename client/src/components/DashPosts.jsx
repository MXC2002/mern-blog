import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Spinner, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle, HiOutlineTrash, HiPencilAlt } from 'react-icons/hi';


export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [PostIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);

  console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) { 
          setUserPosts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${PostIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== PostIdToDelete))
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
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-sm">
            <Table.Head>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Ngày cập nhật</Table.HeadCell>
              <Table.HeadCell>Hình ảnh</Table.HeadCell>
              <Table.HeadCell>Tiêu đề</Table.HeadCell>
              <Table.HeadCell>Danh mục</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
              <Table.HeadCell>Sửa</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:bg-gray-800">
                  <Table.Cell>{new Date(post.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <HiOutlineTrash onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id)
                    }} className="text-red-500 cursor-pointer text-xl hover:scale-110" title="Xóa" />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <HiPencilAlt className="text-teal-500 cursor-pointer text-xl hover:scale-110" title="Sửa" />
                    </Link>
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
        <p>Chưa có bài viết nào</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />

        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-600'>Bạn có chắc chắn muốn xóa bài viết này?</h3>
            <div className='flex justify-evenly'>
              <Button color='failure' onClick={handleDeletePost}>Chắc chắn</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Hủy bỏ</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
