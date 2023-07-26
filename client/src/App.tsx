import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/user/Home';
import SignInAndSignUp from './pages/user/SignInAndSignUp';
import { useSelector } from 'react-redux';

function App() {

  const tokenRedux = useSelector((store:{user:{token:boolean}})=>store.user.token)
  const token = localStorage.getItem("token")
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={token ?? tokenRedux ? <Home/> : <SignInAndSignUp/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
