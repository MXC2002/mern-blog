/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/vi';
import { FaReply, FaThumbsUp } from 'react-icons/fa';
import { Button, Textarea } from "flowbite-react";
import { useSelector } from 'react-redux'

moment.locale('vi');


export default function Comment({ comment, onLike }) {
    const [user, setUser] = useState({});
    const [reply, setReply] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const {currentUser} = useSelector(state => state.user)

    useEffect(() => {
        const getUser = async () => {
            try {

                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    return;
                }
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment]);
    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200" />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">
                        {user ? `@${user.username}` : 'Người dùng ẩn danh'}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className="text-gray-600 pb-2 ml-2">{comment.content}</p>

                <div className="ml-2 mt-1 flex gap-2 items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
                    <button type="button" onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${
                        currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                    }`}>
                        <FaThumbsUp className="text-sm"/>
                    </button>
                    <p className="text-gray-400">
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes  === 1 ? 'like' : 'likes')
                        }
                    </p>
                </div>

                {/* Reply */}
                <div className="mt-2 ml-2">
                    <FaReply onClick={() => setReply(true)} className="text-gray-400 hover:text-gray-500" />
                </div>
                {
                    reply ? (
                        <form className='mt-2 ml-2 border border-teal-500 rounded-md p-3'>
                            <Textarea placeholder='Viết bình luận' rows='2' maxLength='200'
                                onChange={(e) => setReplyContent(e.target.value)}
                                value={replyContent} />
                            <div className='md:flex justify-between items-center mt-2'>
                                <p className='text-gray-500 text-sm'>Còn lại {200 - replyContent.length} ký tự</p>
                                <div className="flex gap-3 justify-end mt-2">
                                    <Button onClick={() => setReply(false)} type='submit' outline gradientDuoTone='purpleToPink'>
                                        Hủy bỏ
                                    </Button>
                                    <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                                        Bình luận
                                    </Button>
                                </div>
                            </div>

                        </form>
                    ) : null
                }
                {/* end reply */}
            </div>
        </div>
    )
}
