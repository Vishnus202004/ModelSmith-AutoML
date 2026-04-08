import Nav from './components/Nav';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import History from './Pages/History';
import Predict from './Pages/Predict';

function App() {
  return (
    <div className='App'>
    <Nav/>
        <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
            <Route path="/automl" element={<Dashboard/>} />
            <Route path="/history" element={<History/>} />
            <Route path="/predict" element={<Predict />} />

      </Routes>
    </div>
  );
}

export default App;