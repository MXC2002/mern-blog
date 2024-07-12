import { useEffect, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { useSelector } from 'react-redux'

export default function ListFavoritePost() {
    const { currentUser } = useSelector(state => state.user);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        const fetchFavoritePosts = async () => {
            try {
                setLoading(true);

                // Lấy danh sách bài viết yêu thích của người dùng
                const favoritesRes = await fetch(`/api/favorite/user/${currentUser._id}`);
                const favoritesData = await favoritesRes.json();
                const favoritePostIds = favoritesData.map(favorite => favorite.postId);

                // Lấy thông tin các bài viết
                const postsRes = await fetch('/api/post/getposts');
                const postsData = await postsRes.json();

                // Lọc ra các bài viết yêu thích
                const userFavoritePosts = postsData.posts.filter(post => favoritePostIds.includes(post._id));

                setFavoritePosts(userFavoritePosts);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error.message);
            }
        };

        if (currentUser) {
            fetchFavoritePosts();
        }
    }, [currentUser._id]);

    const handleDeleteFavorite = async (postId) => {
        try {
            const res = await fetch(`/api/favorite/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id }),
            });

            if (res.ok) {
                setFavoritePosts(favoritePosts.filter(post => post._id !== postId));
            } else {
                const data = await res.json();
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    if (loading) {
        return <div className='text-center mt-5 text-gray-700 dark:text-gray-200'>Đang tải...</div>;
    }

    if (favoritePosts.length === 0) {
        return <div className='text-center mt-5 text-gray-700 dark:text-gray-200'>Không có bài viết yêu thích.</div>;
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700 dark:text-gray-200">Danh sách bài viết yêu thích</h2>
            <ul className='max-h-[500px] overflow-y-auto'>
                {favoritePosts.map(post => (
                    <li key={post._id} className="mb-6 relative flex justify-between items-center">
                        <a href={`/post/${post.slug}`} className="text-blue-500 hover:underline flex gap-3">
                            <img className='w-20 h-14 object-cover' src={post.image} alt={post.title} />
                            <p className='max-w-xs self-center line-clamp-2'>{post.title}</p>
                        </a>

                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(dropdownOpen === post._id ? null : post._id)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-2xl"
                            >
                                <AiOutlineMore />
                            </button>
                            {dropdownOpen === post._id && (
                                <div className="absolute top-0 right-9 w-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 rounded-md shadow-lg">
                                    <button
                                        onClick={() => handleDeleteFavorite(post._id)}
                                        className="text-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-500"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            )}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}
