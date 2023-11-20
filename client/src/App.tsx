import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import SignInAndSignUp from './pages/user/SignInAndSignUp';
import { useSelector } from 'react-redux';
import AdminHome from './pages/admin/AdminHome';
import AdminSignInPage from './pages/admin/AdminSignInPage';
import VideoCall from './components/user/home/chat/VideoCall';
import ErrorPage from './pages/user/ErrorPage';


function App() {
  const reduxToken = useSelector((store:{user:{token:string}})=>store.user.token)
  const reduxAdminToken = useSelector((store:{admin:{adminToken:string}})=>store.admin.adminToken)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={reduxToken ? <Home/> : <SignInAndSignUp/>}></Route>
        <Route path='/:user' element={<Profile/>}></Route>
        <Route path='/pulz/admin' element={reduxAdminToken ? <AdminHome/> : <AdminSignInPage/>}></Route>
        <Route path='/videocall/:id' element={<VideoCall/>}></Route>
        <Route path='/error/:error/:path' element={<ErrorPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
