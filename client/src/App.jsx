import { Routes, Route} from 'react-router-dom';
import './index.css'
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Navbar from './components/Navbar';

const App = () => {
  return(
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/createProject" element={<CreateProject/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App;
