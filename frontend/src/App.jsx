import Nav from './components/Nav';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard';
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
