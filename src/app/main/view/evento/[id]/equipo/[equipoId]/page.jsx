"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useForm } from "react-hook-form";
import { useEquipoContext, useUserContext } from '@/app/layout';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import { dateToString, stringDate } from '@/utils/Date';
const EditActivityPage = ({params}) => {
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();
    const [evento, setEvento] = useState();
    const {user, setUser} = useUserContext();
    const {equipo, setEquipo} = useEquipoContext();

  const { register, watch, formState: { errors }, handleSubmit} = useForm({defaultValues: {admin: false}});

  const postData = async (updateEquipo) =>{
    const equipoRef = doc(firestore, "eventos/"+params.id+"/equipos", params.equipoId);
    const equipoDoc = await updateDoc(equipoRef, updateEquipo);
    
    router.push('/main/view/evento/'+params.id);
}
const onSubmit = (data) =>{
    const equipoUpdate ={
        secuencia: data.secuencia,
        nombre: data.nombre
    }
    postData(equipoUpdate);
}

  const back = () =>{
    router.push('/main/view/evento/'+params.id);
  }

  useEffect(() => {
    //TODO: add context to save user there
    if(!auth.currentUser){
        router.push('/main/login');
    }
  }, [])

  return (
    <div className='flex w-full min-h-screen bg-[#112A7C] justify-center align-middle items-center'>
      <form className='flex flex-col bg-[#E7DDCB] border-2 border-black py-6 px-6 gap-10 justify-center align-middle items-center w-5/12' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex text-black text-2xl font-normal text-start w-full'>Editar Evento</div>
        <div className='flex flex-col border-2 border-black p-5 gap-5 w-full bg-[#FBF1DF]'>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Nombre:</label>
                        <input
                          id="nombre"
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            {...register('nombre', {
                              value: equipo.nombre,
                                required: true
                            })}
                        />
                        {errors.nombre?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Secuencia:</label>
                        <input
                          id="secuencia"
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            {...register('secuencia', {
                              value: equipo.secuencia,
                                required: true
                            })}
                        />
                        {errors.secuencia?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                        <div className=" text-black text-xs font-medium text-center mt-4">*No incluya la actividad 0</div>
                    </div>
        </div>
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <div className=' flex text-xl font-medium w-1/3 h-9 bg-[#D0C6B4] px-5 py-6 text-stone-600 justify-center items-center align-middle cursor-pointer' onClick={() => back()}>Atrás</div>
          <button className=' flex text-xl font-medium w-1/3 h-9 bg-[#807665] px-5 py-6 text-white justify-center items-center align-middle' type='submit'>Guardar</button>
        </div>
      </form>
    </div>
  )
}

export default EditActivityPage;