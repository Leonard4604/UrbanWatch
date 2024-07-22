import './App.css'
import LandingPage from './pages/LandingPage'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useContext } from 'react';
import injectContext, { Context } from './store/appContext';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Profile from './pages/Profile';

function App() {
  const { store } = useContext(Context);

  return (
    <Router>
      <Routes>
        <Route path="/" element={store.token ? <Dashboard /> : <SignIn />} />
        <Route path="/signin" element={store.token ? <Dashboard /> : <SignIn />} />
        <Route path="/signup" element={store.token ? <Dashboard /> : <SignUp />} />
        {!store.token ?
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </>
          :
          <>
            <Route path="/signin" element={<Dashboard />} />
            <Route path="/signup" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/profile" element={<Profile />} />
          </>
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default injectContext(App)
