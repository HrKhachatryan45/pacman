import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useAuthContext} from "./context/useAuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
function App() {
    const {authUser} = useAuthContext()
  return (
    <BrowserRouter>
        <Routes>
            <Route path={'/login'} element={!authUser?<Login/>:<Navigate to={'/'}/>}/>
            <Route path={'/register'} element={!authUser?<Register/>:<Navigate to={'/'}/>}/>
            <Route path={'/'} element={!authUser?<Navigate to={'/login'}/>:<Dashboard/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
