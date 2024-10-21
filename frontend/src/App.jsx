import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
} from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useContext, useEffect } from 'react';
import injectContext, { Context } from './store/appContext';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Profile from './pages/Profile';
import Reports from './pages/Reports';

function App() {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserRole = () => {
    const role = store.role;
    return role ? parseInt(role, 10) : null;
  };

  useEffect(() => {
    const role = getUserRole();
    if (store.token && role !== 1 && (location.pathname === '/' || location.pathname === '/dashboard')) {
      navigate('/reports');
    }
  }, [store.token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={store.token ? (getUserRole() === 1 ? <Dashboard /> : <Reports />) : <SignIn />} />
      <Route path="/signin" element={store.token ? <Dashboard /> : <SignIn />} />
      <Route path="/signup" element={store.token ? <Dashboard /> : <SignUp />} />
      {!store.token ?
        <>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </>
        :
        <>
          <Route path="/map" element={<Map />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          {getUserRole() === 1 && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signin" element={<Dashboard />} />
              <Route path="/signup" element={<Dashboard />} />
            </>
          )}
        </>
      }
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default injectContext(AppWithRouter);