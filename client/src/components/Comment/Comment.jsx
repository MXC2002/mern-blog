/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/vi';
import { FaThumbsUp } from 'react-icons/fa';
import { Button, Textarea } from "flowbite-react";
import { useSelector } from 'react-redux'

moment.locale('vi');


export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user)
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            setIsEditing(false);
            onEdit(comment, editedContent);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={`flex p-4 border-b dark:border-gray-600 text-sm ${user?._id ? '' : ''}`}>
            <div className="flex-shrink-0 mr-3">
                { user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        ?
                    </div>
                )}
            </div>
            <div className={`flex-1 ${ user?._id ? '' : '-mb-4'}`}>
                <div className="flex items-center mb-1 gap-2">
                    <span className="flex-3 font-bold mr-1 text-xs">
                        { user?.username ? `@${user.username}` : 'Người dùng đã bị xóa'}
                    </span>
                    <span className="flex-1 text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            className="mb-2"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button type="button" outline gradientDuoTone="purpleToBlue" size="sm" onClick={() => {
                                setIsEditing(false);
                            }}>
                                Hủy
                            </Button>
                            <Button type="button" gradientDuoTone="purpleToBlue" size="sm" onClick={handleSave} >
                                Lưu
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 pb-2 ml-2">{comment.content}</p>

                        <div className="ml-2 mt-1 flex gap-2 pt-2 text-xs border-t dark:border-gray-800 max-w-fit">
                            {
                                user?._id ? (
                                    <>
                                        <button type="button" onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                                            }`}>
                                            <FaThumbsUp className="text-sm" />
                                        </button>

                                        {
                                            comment.numberOfLikes > 0 &&
                                            <p className="text-gray-400 -mb-1">
                                                {
                                                    comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                                }
                                            </p>

                                        }
                                    </>
                                ) : ''
                            }

                            {
                                currentUser && (currentUser._id === comment.userId && (
                                    <>
                                        <button type="button" className="-mb-1 text-gray-400 hover:text-blue-500 border-l dark:border-gray-800 pl-2" onClick={handleEdit}>
                                            Sửa
                                        </button>
                                        <button type="button" className="-mb-1 text-gray-400 hover:text-red-400 border-l dark:border-gray-800 pl-2" onClick={() => onDelete(comment._id)}>
                                            Xóa
                                        </button>
                                    </>
                                )) || (currentUser?.isAdmin && (
                                    <button type="button" className={`-mb-1 text-gray-400 hover:text-red-400 border-l dark:border-gray-800 pl-2 ${ user?._id ? '' : 'border-none -ml-2 mb-4'}`} onClick={() => onDelete(comment._id)}>
                                        Xóa
                                    </button>
                                ))
                            }
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}
