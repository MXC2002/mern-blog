import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiArrowRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { logoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux'

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items >
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
              Hồ sơ
            </Sidebar.Item>
          </Link>
          {
            currentUser.isAdmin && (
              <Link to='/dashboard?tab=posts'>
                <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
                  Bài viết
                </Sidebar.Item>
              </Link>
            )
          }
          {
            currentUser.isAdmin && (
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                  Người dùng
                </Sidebar.Item>
              </Link>
            )
          }
          <Sidebar.Item onClick={handleLogout} icon={HiArrowRight} className='cursor-pointer'>
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
