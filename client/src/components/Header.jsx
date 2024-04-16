import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice'
import { logoutSuccess } from '../redux/user/userSlice';

export default function Header() {

    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { theme } = useSelector(state => state.theme)

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
    }

    return (
        <Navbar className="border-b-2">
            <Link to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white ml-2">
                <span className="px-2 pt-1.5 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
                Blog
            </Link>
            <form>
                <TextInput
                    type="text"
                    placeholder="Tìm kiếm..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-2 md:order-2 mr-2">
                <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}

                </Button>
                {currentUser ? (
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
                        <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </Dropdown>
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
            <Navbar.Collapse>
                {/* phần cũ: */}
                {/* <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link> */}

                {/* phần sửa mới: */}
                <Navbar.Link as={Link} to='/' active={path === '/'} className="text-base">
                    Trang Chủ
                </Navbar.Link>
                <Navbar.Link as={Link} to='/about' active={path === '/about'} className="text-base">
                    Giới Thiệu
                </Navbar.Link>
                <Navbar.Link as={Link} to='/projects' active={path === '/projects'} className="text-base">
                    Bài Viết
                </Navbar.Link>

            </Navbar.Collapse>
        </Navbar>
    )
}
