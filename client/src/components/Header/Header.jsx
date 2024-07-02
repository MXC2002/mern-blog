
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/theme/themeSlice'
import { logoutSuccess } from '../../redux/user/userSlice';
import { useEffect, useState } from "react";
import ListFavoritePost from "../Post/ListFavoritePost";

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

    return (
        <Navbar className="border-b-2 relative">
            <Link to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white ml-2">
                <span className="px-2 pt-1.5 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
                Blog
            </Link>
            <div className="flex gap-3">
                <form onSubmit={handleSubmit} className={`transition-all duration-300 delay-100 ease-in-out lg:opacity-100 ${isSearchVisible ? 'opacity-100 w-40 md:w-auto' : 'opacity-0'}`}>
                    <TextInput
                        type="text"
                        placeholder="Tìm kiếm..."
                        rightIcon={AiOutlineSearch}
                        className={`hidden lg:inline ${isSearchVisible ? 'block' : 'hidden'}`}
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                    />
                </form>
                <Button className='w-12 h-10 lg:hidden mr-1' color='gray' pill onClick={() => setIsSearchVisible(!isSearchVisible)}>
                    {isSearchVisible ?
                        <AiOutlineClose className="self-center" />
                        :
                        <AiOutlineSearch className="self-center"/>}
                </Button>
            </div>
            <div className={`flex gap-2 md:order-2 mr-2 md:flex ${isSearchVisible ? 'hidden' : 'block'}`}>
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
                                <Dropdown.Item>Hồ sơ</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setIsOpen(true)}>Danh sách bài viết yêu thích</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown>

                    </>
                ) : (

                    <Link to="/login">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Đăng nhập
                        </Button>
                    </Link>
                )
                }
                <Navbar.Toggle />
            </div>
            {
                isOpen && (
                    <div className="absolute right-0 top-16 border min-w-80 min-h-[500px] z-10 bg-white flex flex-col" >
                        <div className="flex self-end border p-2 mx-2 mt-2 rounded-xl">
                            <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
                                <AiOutlineClose className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-3">
                            <ListFavoritePost />
                        </div>
                    </div>
                )
            }
            <Navbar.Collapse className={`lg:block md:${isSearchVisible ? 'hidden' : 'block'}`}>
                <Navbar.Link as='div' className="flex items-center justify-between md:hidden">
                    <span className="text-base dark:text-gray-400">Chế độ Sáng/Tối</span>
                    <Button className="w-12 h-10" color="gray" pill onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaSun /> : <FaMoon />}
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
