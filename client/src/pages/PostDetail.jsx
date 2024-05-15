import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setLoading(false);
                    setPost(null);
                    return;
                }
                if (res.ok && data.posts.length > 0) {
                    const fetchedPost = data.posts[0];
                    fetchedPost.readingTime = (fetchedPost.content.length / 1000).toFixed(0);
                    fetchedPost.dateString = new Date(fetchedPost.createdAt).toLocaleDateString();
                    setPost(fetchedPost);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug]);
    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        )
    }
    return post ? (
        <div className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post.title}</h1>
            {!post.category === 'uncategorized' && (
                <Link to={`/search?category=${post.category}`} className='self-center mt-5'>
                    <Button color='gray' pill size='xs'>{post && post.category}</Button>
                </Link>
            )}
            <img src={post.image} alt={post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm'>
                <span>{post.dateString}</span>
                <span className='italic'>{post.readingTime} phút để đọc</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post.content }}></div>

            <CommentSection postId={post._id} />
        </div>

    ) : (
        <div className="text-center text-xl mt-10 min-h-screen">
            <p>Bài viết không tồn tại hoặc đã bị xóa.</p>
        </div>
    )
}
