import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

const {backendUrl}=useContext(AppContent)

  const navigate=useNavigate()

  const[email,setEmail]=useState('')
  const[newPassword,setNewPassword]=useState('')
  const[isEmailSent,setIsEmailSent]=useState('')
  const[otp,setOtp]=useState(0)
  const[isOtpSubmitted,setIsOtpSumitted]=useState(false)

  const inputRefs=React.useRef([])
  
    const handleInput=(e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1 )
  {
  
    inputRefs.current[index+1].focus();
  }
    }
  
    const handleKeyDown=(e,index)=>{
  
      if(e.key==='Backspace' && e.target.value ==='' && index > 0){
         inputRefs.current[index-1].focus();
      }
    }
  
    const handlePaste=(e)=>{
      const paste=e.clipboardData.getData('text')
      const pasteArray=paste.split('')
      pasteArray.forEach((char,index) => {
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char
        }
        
      });
    }

   const onSubmitEmail = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });

    if (data.success) {
      toast.success(data.message || "OTP sent successfully");
      setIsEmailSent(true);
    } else {
      toast.error(data.message || "Something went wrong");
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Server error");
  }
};
const onSubmitOtp = (e) => {
  e.preventDefault();
  const optArray=inputRefs.current.map(e=>e.value)
  setOtp(optArray.join(''))
  setIsOtpSumitted(true)
  
};
     
    
    const onSubmitNewPassword=async(e)=>{
      e.preventDefault()
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email,otp,newPassword });
        data.success ? toast.success(data.message):
        toast.error(data.message)
        data.success && navigate('/login')
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32'/>
      {/* Enter Email */}
      {!isEmailSent && (<form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
    <h1 className='text-white text-center font-semibold text-2xl mb-4 '>Reset password</h1>
      <p className='text-center text-indigo-300 mb-6 '>Enter your registered email address</p>
      <div className='mb-4 flex items-center w-full gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.mail_icon} />
        <input type="email" placeholder='Email id' className='bg-transparent outline-none text-white'
        value={email}
        onChange={e=> setEmail(e.target.value)} />
      </div>
      <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'>Submit</button>
      </form>)}
    
    
{/* otp input form */}

{!isOtpSubmitted && isEmailSent && (<form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-center font-semibold text-2xl mb-4 '>Reset Password OTP</h1>
      <p className='text-center text-indigo-300 mb-6 '>Enter the 6 digit code sent to your Email id.</p>
      <div className='flex justify-between mb-8' onPaste={handlePaste}>
       {
        Array(6).fill(0).map((_,index)=>(

          <input className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
          ref={e=>inputRefs.current[index]=e}
          onInput={(e)=> handleInput(e,index)}
          onKeyDown={(e)=> handleKeyDown(e,index)}
          type="text" maxLength='1' key={index} required/>
        ))
       }
      </div>
      <button  className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'>Submit</button>
     </form>)}




{/* 
reset password */}
{isOtpSubmitted && isEmailSent &&(
<form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-center font-semibold text-2xl mb-4 '>New password</h1>
      <p className='text-center text-indigo-300 mb-6 '>Enter the new password below</p>
      <div className='mb-4 flex items-center w-full gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.lock_icon} />
        <input type="password" placeholder='Enter password' className='bg-transparent outline-none text-white'
        value={newPassword}
        onChange={e=> setNewPassword(e.target.value)} />
      </div>
      <button  className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'>Submit</button>
     </form>

)}


    </div>
  )
}

export default ResetPassword
