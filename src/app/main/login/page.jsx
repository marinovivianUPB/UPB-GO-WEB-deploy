"use client"
import React from 'react';
import Image from 'next/image';
import { useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { useAuth} from 'reactfire';
import {signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import { useUserContext } from '../../layout';
import { customStyles } from '@/utils/CustomStyles';
const LoginPage = () =>{

    const {user, setUser} = useUserContext();
    useEffect(() => {
      if(user!=null){
          router.push('/main/start');
      }
    }, [])

    const { register, formState: { errors }, handleSubmit} = useForm();
    const auth = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const showModal = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen)
        const closeModal = () => {
          setIsOpen(false);
        }
        setTimeout(closeModal, 500);
    }
    
    const signIn = async (email, password, event) =>{
        //"esteEselPassword"
        
        try {
            const response = await signInWithEmailAndPassword(auth,email,password);
            const userFirebase = auth.currentUser;
            setUser(userFirebase);
            router.push('/main/start');
        } catch(error){
            showModal(event);
        }
    }
    const onSubmit = (data, event) =>{
        const user ={
            user:data.email,
            password:data.password
        }
        signIn(user.user, user.password, event);
    }
    
    return (
        <div className='flex flex-col w-full h-screen bg-gradient-to-r from-[#112A7C] from-15% via-[#D99A0F] via-60% to-[#112A7C] justify-center align-middle items-center gap-10'>
            <div className='flex flex-col w-1/4 bg-[#E7DDCB] border-2 border-black p-6 justify-center align-middle items-center gap-4'>
                <Image src="/blacklogofinal.png" width={85} height={72}/>
                <form className='flex flex-col gap-10 w-full' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Email</label>
                        <input
                            type="text"
                            className="w-full text-base p-4 text-black bg-[#D2C3A7]"
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
                            className="w-full text-base p-4 text-black bg-[#D2C3A7]"
                            placeholder="*******"
                            {...register('password', {
                                required: true
                            })}
                        />
                        {errors.password?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <button className=' flex text-xl font-medium w-76 h-9 bg-[#807665] px-5 py-6 text-white justify-center items-center align-middle' type="submit">Continuar</button>

                </form>
                <Modal isOpen={isOpen} style={customStyles}>
                    <div className="texto-normal font-medium flex w-full h-full justify-center items-center">Contraseña o email incorrectos</div>
                </Modal>
                
            </div>
            <Image src="/tree.gif" width={180} height={184}/>
        </div>
    );
}

export default LoginPage;