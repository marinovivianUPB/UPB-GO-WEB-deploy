"use client"
import React from 'react';
import Image from 'next/image';
import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { useAuth, useUser} from 'reactfire';
import { useForm } from "react-hook-form";
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc} from "firebase/firestore";
const UsuariosPage = () => {
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');

  useEffect(() => {
    //TODO: add context to save user there
    if(!auth.currentUser){
        router.push('/main/login');
    }
  }, [])

  const { register, watch, formState: { errors }, handleSubmit} = useForm({defaultValues: {admin: false}});

  const signUp = async (user) =>{
    const response = await createUserWithEmailAndPassword(auth,user.email,user.password);
    const userDoc = await setDoc(doc(firestore, "users", response.user.uid), {
      admin: user.admin,
      eventos: 0,
    });
    router.push('/main/start');
}
const onSubmit = (data) =>{
    const user ={
        email:data.email,
        password:data.password,
        admin: (data.admin=="true" ? true : false)
    }
    signUp(user);
}

const back = () =>{
  router.push('/main/start');
}

  return (
    <div className='flex w-full flex-col h-screen bg-[#112A7C] justify-center align-middle items-center gap-5'>
      <form className='flex flex-col bg-[#E7DDCB] border-2 border-black py-6 px-6 gap-10 justify-center align-middle items-center w-5/12' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex text-black text-2xl font-normal text-start w-full'>Nuevo Usuario</div>
        <div className='flex flex-col border-2 border-black p-5 gap-5 w-full bg-[#FBF1DF]'>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Email</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="ejemplo123@upb.com"
                            {...register('email', {
                                required: true
                            })}
                        />
                        {errors.email?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Password</label>
                        <input
                            type="password"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="*******"
                            {...register('password', {
                                required: true
                            })}
                        />
                        {errors.password?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className = 'flex flex-row w-full items-center justify-center align-middle gap-3'>
                          <input 
                                type='checkbox'
                                value={true}
                                {...register("admin")}/>
                          <label className=" text-left font-medium text-black">Administrador</label>
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