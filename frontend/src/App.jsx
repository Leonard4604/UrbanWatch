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
import injectContext, { Context } from './hooks/appContext';
import NotFound from './pages/NotFound';

function App() {
  const { store } = useContext(Context);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={store.token ? <LandingPage /> : <SignIn />} />
        <Route path="/signup" element={store.token ? <LandingPage /> : <SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default injectContext(App)
