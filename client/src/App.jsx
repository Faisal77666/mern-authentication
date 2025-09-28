import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import Logout from "./pages/Logout"

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
  

function App() {

  return (
    <>
      <div>
        <ToastContainer/>
      <Routes>
       <Route path="/" element={<Home/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/email-verify" element={<EmailVerify/>} ></Route>
        <Route path="/reset-password" element={<ResetPassword/>} ></Route>
        <Route path="/logout" element={<Logout/>} ></Route>

      </Routes>
      </div>
    </>
  )
}

export default App
