/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function FavoritePost({ postId }) {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [favorited, setFavorited] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const res = await fetch(`/api/favorite/${postId}`);
                const data = await res.json();
                if (res.ok) {
                    setFavorited(data.isFavorited);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser) {
            fetchFavoriteStatus();
        }

        const fetchFavoriteCounts = async () => {
            try {
                const countRes = await fetch(`/api/favorite/${postId}/count`);
                const countData = await countRes.json();
                if (countRes.ok) {
                    setFavoritesCount(countData.favoritesCount);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchFavoriteCounts();
    }, [postId, currentUser]);

    const handleFavorite = async () => {
        try {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            const res = await fetch(`/api/favorite/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                setFavorited(data.isFavorited);
                setFavoritesCount(data.favoritesCount);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <button onClick={handleFavorite} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 focus:outline-none">
                {favorited ? <HiHeart className="text-red-600 dark:text-red-500 lg:text-2xl text-3xl" /> : <HiOutlineHeart className="lg:text-2xl text-3xl" />}
            </button>
            {favoritesCount > 0 && (
                <p>{favoritesCount}</p>
            )}
        </>
    );
}
