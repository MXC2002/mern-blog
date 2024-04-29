import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineTrash, HiPencilAlt } from 'react-icons/hi';


export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) {
          setUserPosts(data.posts)
          if (data.posts.length < 8) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser._id) {
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
        if (data.posts.length < 8) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-sm">
            <Table.Head>
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
                    <HiOutlineTrash className="text-red-500 cursor-pointer text-xl hover:scale-110" title="Xóa" />
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
    </div>
  )
}
