import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiArrowRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { logoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux'

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
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
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Người dùng"} labelColor='dark' as='div'>
              Hồ sơ
            </Sidebar.Item>
          </Link>
          <Sidebar.Item onClick={handleLogout} icon={HiArrowRight} className='cursor-pointer'>
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
