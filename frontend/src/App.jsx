import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SelectionPage from './components/SelectionPage';
import Login from './components/Login';
import SignupInternship from './components/SignupInternship';
import SignupProvider from './components/SignupProvider';
import ProviderDashboard from './components/ProviderDashboard';
import SeekerDashboard from './components/SeekerDashboard';
import AdminDashboard from './components/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/internship" element={<SignupInternship />} />
        <Route path="/signup/provider" element={<SignupProvider />} />
        <Route path="/provider-dashboard" element={<PrivateRoute role="PROVIDER"><ProviderDashboard /></PrivateRoute>} />
        <Route path="/seeker-dashboard" element={<PrivateRoute role="INTERN"><SeekerDashboard /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App;
