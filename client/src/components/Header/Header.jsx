
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/theme/themeSlice'
import { logoutSuccess } from '../../redux/user/userSlice';
import { useEffect, useState } from "react";
import ListFavoritePost from "../Post/ListFavoritePost";
import AuthModal from '../Auth/AuthModal';

export default function Header() {


    const path = useLocation().pathname;
    const location = useLocation();
    const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { theme } = useSelector(state => state.theme)
    const [searchTerm, setsearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setsearchTerm(searchTermFromUrl);
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
                navigate('/');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
        document.activeElement.blur();
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <Navbar className="border-b-2 relative">
            <Link to="/"
                className="self-center whitespace-nowrap text-sm md:text-xl font-semibold dark:text-white ml-2">
                <span className="px-2 pt-1.5 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
                Blog
            </Link>
            <div className="flex gap-3">
                <form onSubmit={handleSubmit} className={`transition-all duration-300 delay-100 ease-in-out lg:opacity-100 ${isSearchVisible ? 'opacity-100 w-40 md:w-auto' : 'opacity-0'} lg:-mr-20`}>
                    <TextInput
                        type="text"
                        placeholder="Tìm kiếm..."
                        rightIcon={AiOutlineSearch}
                        className={`hidden lg:inline ${isSearchVisible ? 'block' : 'hidden'}`}
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                    />
                </form>
                <div className='lg:hidden md:block hidden mr-1' onClick={() => setIsSearchVisible(!isSearchVisible)}>
                    {isSearchVisible ?
                        <Button className='w-12 h-10' color='gray' pill>
                            <AiOutlineClose className="self-center" />
                        </Button>
                        :
                        <Button className='w-12 h-10 ml-5 -mr-20' color='gray' pill>
                            <AiOutlineSearch className="self-center" />
                        </Button>

                    }
                </div>
            </div>
            <div className={`flex gap-2 md:order-2 md:flex ${isSearchVisible ? 'hidden' : 'block'}`}>
                <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <>
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user"
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }>
                            <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Quản lý tài khoản</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setIsOpen(true)}>Danh sách bài viết yêu thích</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown>

                    </>
                ) : (
                    <Button gradientDuoTone="purpleToBlue" outline onClick={() => setShowAuthModal(true)}>
                        Đăng nhập
                    </Button>
                )
                }
                <Navbar.Toggle />
            </div>

            {
                showAuthModal && (
                    <>
                        <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
                    </>
                )
            }

            {
                isOpen && (
                    <div className="absolute right-0 top-16 mr-0.5 border min-w-80 min-h-[500px] z-10 bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,22,40)] flex flex-col" >
                        <div className="flex self-end p-2">
                            <Button onClick={handleClose} color='gray' pill className="w-10 h-10">
                                <AiOutlineClose className="text-xl self-center" />
                            </Button>
                        </div>
                        <div className="p-3">
                            <ListFavoritePost />
                        </div>
                    </div>
                )
            }
            <Navbar.Collapse className={`lg:block md:${isSearchVisible ? 'hidden' : 'block'}`}>
                <div className="md:hidden block border-b border-gray-200 dark:border-gray-700 pb-3 pt-2 mx-4">
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            type="text"
                            placeholder="Tìm kiếm..."
                            rightIcon={AiOutlineSearch}
                            value={searchTerm}
                            onChange={(e) => setsearchTerm(e.target.value)}
                        />
                    </form>
                </div>
                <Navbar.Link as='div' className="flex items-center justify-between md:hidden">
                    <span className="text-base dark:text-gray-400">Chế độ Sáng/Tối</span>
                    <Button className="w-12 h-10" color="gray" pill onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaSun className="self-center" /> : <FaMoon className="self-center" />}
                    </Button>
                </Navbar.Link>
                <Navbar.Link as={Link} to='/' className={`text-base ${path === '/' && 'text-teal-400 dark:text-slate-100'}`}>
                    Trang Chủ
                </Navbar.Link>
                <Navbar.Link as={Link} to='/about' className={`text-base ${path === '/about' && 'text-teal-400 dark:text-slate-100'}`}>
                    Giới Thiệu
                </Navbar.Link>
                <Navbar.Link as={Link} to='/posts' className={`text-base ${path === '/posts' && 'text-teal-400 dark:text-slate-100'}`}>
                    Bài Viết
                </Navbar.Link>

            </Navbar.Collapse>

        </Navbar>
    )
}
