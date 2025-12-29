import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SelectionPage from './components/SelectionPage';
import Login from './components/Login';
import SignupInternship from './components/SignupInternship';
import SignupProvider from './components/SignupProvider';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/internship" element={<SignupInternship />} />
        <Route path="/signup/provider" element={<SignupProvider />} />
      </Routes>
    </Router>
  )
}

export default App;
