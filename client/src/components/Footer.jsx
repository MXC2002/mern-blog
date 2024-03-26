import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs"

export default function FooterComp() {
    return (
        <Footer container className="border border-t-8 border-teal-300">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex sm:gap-4 md:grid-cols-1">
                    <div className="flex sm:items-center">
                        <Link to="/"
                            className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                            <span className="px-2 pt-1.5 pb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">IT Sharing</span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3">
                        <div>
                            <Footer.Title title="Về chúng tôi" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/about" target="_blank">IT Sharing Blog
                                </Footer.Link>
                                <Footer.Link href="mailto:contact@itsharingblog.com" target="_blank">Liên hệ để hợp tác hoặc góp ý</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div className="grid justify-center">
                            <Footer.Title title="Theo dõi" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Github
                                </Footer.Link>
                                <Footer.Link href="#">
                                    Discord</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Quy định Pháp lý" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Chính sách Bảo mật
                                </Footer.Link>
                                <Footer.Link href="#">Điều Khoản &amp; Điều Kiện</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                    </div>

                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="IT Sharing Blog" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsDribbble} />
                    </div>
                </div>

            </div>
        </Footer>
    )
}
