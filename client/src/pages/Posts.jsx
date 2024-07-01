import { useEffect, useState } from 'react';
import PostCard from '../components/Post/PostCard';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getposts');
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setPosts([...posts, ...data.posts])
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const res = await fetch(`api/post/getposts?startIndex=${startIndex}`);
    const data = await res.json();
    if (res.ok) {
      setPosts([...posts, ...data.posts])
      if (data.posts.length < 9) {
        setShowMore(false);
      }
    }
  }


  return (
    <div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col'>
        {
          loading && (
            <div className='mx-auto flex justify-center items-center min-h-96'>
              Đang tải...
            </div>
          )
        }
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-8 my-3">
              <h2 className='lg:text-5xl text-3xl border-b dark:border-gray-600 pb-3 text-center text-teal-500 dark:text-teal-300 font-extrabold uppercase'>Bài Viết</h2>
              <div className="flex flex-wrap lg:gap-4 gap-7 justify-center">
                {
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                }
              </div>
              {
                showMore && <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>
                  Xem thêm
                </button>
              }
            </div>
          )
        }

      </div>
    </div>
  )
}
