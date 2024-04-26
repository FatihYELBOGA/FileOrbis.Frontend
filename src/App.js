import './App.css';
import Login from './Login/login.js'
import IndividualFiles from './IndividualFiles/individualFiles.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';

function App() {

  const [userInfo, setUserInfo] = useState(null);

  if(userInfo == null){
    return(
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login setUserInfo={setUserInfo} />} />
          </Routes>
        </BrowserRouter>
      </div>
  )}
  else{
    return(
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path='/file/my-workspace' element={<IndividualFiles/>} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
