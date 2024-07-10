
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer/Footer'
import PrivateRoute from './components/Routes/PrivateRoute'
import OnlyAdminPrivateRoute from './components/Routes/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import Posts from './pages/Posts'
import UpdatePost from './pages/UpdatePost'
import PostDetail from './pages/PostDetail'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Search from './pages/Search'
import Header from './components/Header/Header'
import { Toaster } from 'react-hot-toast'


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/posts' element={<Posts />} />
        <Route path='/post/:postSlug' element={<PostDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
