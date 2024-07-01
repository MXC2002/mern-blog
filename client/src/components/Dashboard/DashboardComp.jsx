import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiOutlineDocumentText,
    HiOutlineUserGroup
} from 'react-icons/hi'
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.posts)
                    setTotalPosts(data.totalPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments?limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Users */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Tổng số người dùng</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp className="text-xl"/>
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500 ">Người dùng ở tháng trước</div>
                    </div>
                </div>

                {/* Posts */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Tổng số bài viết</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiOutlineDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp className="text-xl"/>
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500 ">Bài viết ở tháng trước</div>
                    </div>
                </div>
                {/* Comments */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Tổng số bình luận</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp className="text-xl"/>
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500 ">Bình luận ở tháng trước</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                {/* Users */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Người dùng gần đây</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={`/dashboard?tab=users`}>Xem hết</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Ảnh</Table.HeadCell>
                            <Table.HeadCell>Tên người dùng</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full bg-gray-500" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                {/* Posts */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Bài viết gần đây</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={`/dashboard?tab=posts`}>Xem hết</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Ảnh</Table.HeadCell>
                            <Table.HeadCell>Tên bài viết</Table.HeadCell>
                            <Table.HeadCell>Danh mục</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img src={post.image} alt="post" className="w-14 h-10 rounded-md bg-gray-500" />
                                    </Table.Cell>
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{post.title}</p>
                                    </Table.Cell>
                                    <Table.Cell className="w-5">
                                        {post.category}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                {/* Comments */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Bình luận gần đây</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={`/dashboard?tab=comments`}>Xem hết</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Bình luận</Table.HeadCell>
                            <Table.HeadCell>Số lượt thích</Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map((comment) => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className='w-96'>
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

            </div>
        </div>
    )
}
