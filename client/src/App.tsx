import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import SignInAndSignUp from './pages/user/SignInAndSignUp';
import { useSelector } from 'react-redux';

function App() {
  const reduxToken = useSelector((store:{user:{token:string}})=>store.user.token)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={reduxToken ? <Home/> : <SignInAndSignUp/>}></Route>
      </Routes>

      <Routes>
        <Route path='/:user' element={<Profile/>}></Route>
      </Routes>

      <Routes>
        <Route path='/:user/edit' element={<EditProfile/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
