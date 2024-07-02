import { useEffect, useState } from 'react';
import blogImage from '../assets/images/blog.png';
import PostCard from '../components/Post/PostCard'
import { Link } from 'react-router-dom';
 
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getposts?limit=3');
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="relative flex flex-col gap-6 p-4 max-w-6xl mx-auto">
        <img className="opacity-20 h-[260px] object-cover rounded-xl" src={blogImage} alt="" />
        <div className="absolute top-0 left-0 max-w-6xl text-center p-3 md:p-10 m-3">
          <h1 className="text-3xl text-blue-600 dark:text-blue-300 font-black lg:text-6xl">Welcome to IT Sharing Blog</h1>
          <p className="md:text-lg text-base text-justify mt-5 font-black text-gray-700 dark:text-white md:leading-7">Chào mừng bạn đến với IT Sharing Blog - Nền tảng chia sẻ kiến thức IT và học tập! Hãy cùng khám phá những bài viết bổ ích, tìm hiểu về các nguồn học tốt và chia sẻ kiến thức để phát triển sự nghiệp trong lĩnh vực công nghệ thông tin cùng chúng tôi.</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8'>
      {
          loading && (
            <div className='mx-auto flex justify-center items-center min-h-96'>
              Đang tải...
            </div>
          )
        }
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-6 my-3">
              <h2 className='lg:text-3xl text-2xl text-center text-teal-500 dark:text-teal-300 font-extrabold uppercase'>Bài viết nổi bật</h2>
              <div className="flex flex-wrap lg:gap-4 gap-7 justify-center">
                {
                  posts.map((post) => (
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to={'/posts'} className='text-lg text-teal-500 hover:underline text-center'>
                Xem tất cả
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
