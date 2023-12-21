"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import {reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendPasswordResetEmail} from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useUserContext } from '../../../layout';
const CambiarPasswordPage = () => {
    const auth = useAuth();
    const router = useRouter();
    const {user, setUser} = useUserContext();
  useEffect(() => {
    if(!user){
        router.push('/main/login');
    }
  }, [])

  const changePassword = async() =>{
    const responseNewPass = await sendPasswordResetEmail(auth, user.email);
    setUser(null);
    router.push('/main/login');
  }
  
  const onSubmit = () =>{
    changePassword();
  }

  const back = () =>{
    router.push('/main/start');
  }

  return (
    <div className='flex w-full h-screen bg-[#112A7C] justify-center align-middle items-center'>
      <div className='flex flex-col bg-[#E7DDCB] border-2 border-black p-6 gap-10 w-5/12'>
        <div className='flex w-full text-2xl text-start text-black'>Cambiar contraseña</div>
        <div className='flex flex-col gap-10 border-2 border-black bg-[#FBF1DF] p-5 w-full' >
          <div className='flex flex-col h-1/3'>
            <div className=" text-xl text-black font-medium text-center">Después de hacer click en ‘Confirmar’, upb-go enviará un email a la cuenta con la que hizo login. Siga las instrucciones de este email para cambiar su contraseña.</div>
          </div>
        </div>
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <button className=' flex text-xl font-medium w-1/3 h-9 bg-[#D0C6B4] px-5 py-6 text-stone-600 justify-center items-center align-middle' onClick={() => back()}>Atrás</button>
          <button className=' flex text-xl font-medium w-1/3 h-9 bg-[#807665] px-5 py-6 text-white justify-center items-center align-middle' onClick={()=> onSubmit()}>Confirmar</button>
        </div>
        
      </div>
    </div>
  )
}

export default CambiarPasswordPage;