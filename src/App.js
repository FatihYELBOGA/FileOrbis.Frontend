import './App.css';
import Login from './Login/login.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
