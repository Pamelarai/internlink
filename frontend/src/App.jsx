import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SelectionPage from './components/SelectionPage';
import Login from './components/Login';
import SignupInternship from './components/SignupInternship';
import SignupProvider from './components/SignupProvider';
import ProviderDashboard from './components/ProviderDashboard';
import SeekerDashboard from './components/SeekerDashboard';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/internship" element={<SignupInternship />} />
        <Route path="/signup/provider" element={<SignupProvider />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;
