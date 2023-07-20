import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/user/Home';
import SignIn from './pages/user/SignIn';
import SignUp from './pages/user/SignUp';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
      <Routes>
        <Route path='/signin' element={<SignIn/>}></Route>
      </Routes>
      <Routes>
        <Route path='/signup' element={<SignUp/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
