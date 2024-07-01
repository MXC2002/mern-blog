/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
    return (
        <div className='group relative w-full border border-teal-300 hover:border-4 h-[355px] overflow-hidden rounded-2xl sm:w-[355px] transition-all shadow-lg shadow-teal-300 dark:shadow-teal-600'>
            <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt="post" className='h-[250px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
            </Link>
            <div className='flex flex-col gap-2 p-3 text-center'>
                <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
                {post.category !== 'uncategorized' &&
                    (
                        <span className='italic text-sm'>{post.category}</span>
                    )
                }
                <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>
                    Đọc bài
                </Link>
            </div>
        </div>
    )
}
