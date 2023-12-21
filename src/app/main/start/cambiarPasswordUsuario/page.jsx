"use client"
import React from 'react';
import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { useAuth, useUser} from 'reactfire';
import { useForm } from "react-hook-form";
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc} from "firebase/firestore";
import { useUserContext } from '@/app/layout';
const UsuariosPage = () => {
    const auth = useAuth();
    const router = useRouter();
    const {user, setUser} = useUserContext();
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');

  useEffect(() => {
    //TODO: add context to save user there
    if(!auth.currentUser){
        router.push('/main/login');
    }
  }, [])

  const { register, watch, formState: { errors }, handleSubmit} = useForm({defaultValues: {admin: false}});

  const changePassword = async (user) =>{
    const responseNewPass = await sendPasswordResetEmail(auth, user.email);
    router.push('/main/start');
}
const onSubmit = (data) =>{
    const newUser ={
        email:(data.email ? data.email : user.email)
    }
    changePassword(newUser);
}

const back = () =>{
  router.push('/main/start');
}

  return (
    <div className='flex w-full h-screen bg-[#112A7C] justify-center align-middle items-center'>
      <form className='flex flex-col bg-[#E7DDCB] border-2 border-black py-6 px-6 gap-10 justify-center align-middle items-center w-5/12' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex text-black text-2xl font-normal text-start w-full'>Cambiar contraseña</div>
        <div className='flex flex-col border-2 border-black p-5 gap-5 w-full bg-[#FBF1DF]'>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Email</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="ejemplo123@upb.com"
                            {...register('email', {
                                required: false
                            })}
                        />
                    </div>
                    <div className='flex flex-col h-1/3'>
            <div className=" text-black text-xs font-medium text-center">{"Después de hacer click en ‘Confirmar’, upb-go enviará un email a la cuenta especificada. Si no la especifica, se enviará un email a la cuenta con la que hizo login."}</div>
          </div>
        </div>
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <div className=' flex text-xl font-medium w-1/3 h-9 bg-[#D0C6B4] px-5 py-6 text-stone-600 justify-center items-center align-middle cursor-pointer' onClick={() => back()}>Atrás</div>
          <button className=' flex text-xl font-medium w-1/3 h-9 bg-[#807665] px-5 py-6 text-white justify-center items-center align-middle' type='submit'>Confirmar</button>
        </div>
      </form>
    </div>
  )
}

export default UsuariosPage;