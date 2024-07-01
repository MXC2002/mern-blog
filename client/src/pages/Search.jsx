import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/Post/PostCard'

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || '';
    if (searchTermFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`)
      const data = await res.json()
      if (!res.ok) {
        setLoading(false);
        return;
      }
      setPosts(data.posts);
      setLoading(false);
      if (data.posts.length < 9) {
        setShowMore(false);
      }
    }
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      })
    }

    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({
        ...sidebarData,
        sort: order,
      })
    }

    if (e.target.id === 'category') {
      const category = e.target.value || '';
      setSidebarData({
        ...sidebarData,
        category: category,
      })
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`api/post/getposts?${searchQuery}`);
    const data = await res.json();
    if (res.ok) {
      setPosts([...posts, ...data.posts])
      if (data.posts.length < 9) {
        setShowMore(false);
      }
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-5 border-b md:border-r md:min-h-screen border-gray-500">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>Tìm kiếm :</label>
            <TextInput placeholder='Tìm kiếm bài viết...' id='searchTerm' type='text' value={sidebarData.searchTerm} onChange={handleChange}/>
          </div>
          <div className="flex items-center gap-3">
            <label className='font-semibold' htmlFor="sort">Sắp Xếp :</label>
            <Select id='sort' onChange={handleChange} value={sidebarData.sort}>
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </Select>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:items-start">
            <label className='font-semibold' htmlFor="category">Danh mục :</label>
            <Select id='category' onChange={handleChange} value={sidebarData.category}>
              <option value="uncategorized">--Chọn danh mục--</option>
              <option value="Front-End">Front-End</option>
              <option value="Back-End">Back-End</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="HTML/CSS/Javascript">HTML/CSS/Javascript</option>
              <option value="ReactJS">ReactJS</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Lọc Nội Dung Tìm Kiếm
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='capitalize text-3xl text-blue-600 dark:text-blue-300 font-semibold border-b border-gray-500 p-3 pl-5 mt-5'>Kết quả tìm kiếm bài viết</h1>
        <div className='flex flex-wrap lg:gap-4 gap-7 justify-center my-5 px-4'>

          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500 capitalize mx-auto'>Không tìm thấy kết quả nào cả.</p>
          )}

          {
            loading && (
              <div className='mx-auto flex justify-center items-center min-h-96'>
                Đang tải...
              </div>
            )
          }
          {
            !loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)
          }
          {
            showMore && !loading && 
            <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>
              Xem thêm
            </button>
          }

        </div>
      </div>
    </div>
  )
}
