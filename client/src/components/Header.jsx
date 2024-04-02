import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Header() {

    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user)

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
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-2 md:order-2 mr-2">
                <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
                    <FaMoon />
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
                        <Dropdown.Item>Đăng xuất</Dropdown.Item>
                    </Dropdown>
                ) : (

                    <Link to="/login">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Login
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
                    Home
                </Navbar.Link>
                <Navbar.Link as={Link} to='/about' active={path === '/about'} className="text-base">
                    About
                </Navbar.Link>
                <Navbar.Link as={Link} to='/projects' active={path === '/projects'} className="text-base">
                    Projects
                </Navbar.Link>

            </Navbar.Collapse>
        </Navbar>
    )
}
