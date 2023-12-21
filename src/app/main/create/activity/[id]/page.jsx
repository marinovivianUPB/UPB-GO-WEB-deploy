"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useForm } from "react-hook-form";
import { useUserContext } from '@/app/layout';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDoc, updateDoc, increment} from "firebase/firestore";
import ShortUniqueId from 'short-unique-id';
import Imagenes from '@/utils/Imagenes';
import { compararNombre } from '@/utils/SortOperations';
import Modelos from '@/utils/Modelos';
const CreateActivityPage = ({params}) => {
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();
    const [evento, setEvento] = useState();
    const [imagenes, setImagenes] = useState(Imagenes.sort(compararNombre));
    const [modelos, setModelos] = useState(Modelos.sort(compararNombre));
    const {user, setUser} = useUserContext();
    const uid = new ShortUniqueId({length: process.env.UID_LENGTH})

  const { register, watch, formState: { errors }, handleSubmit} = useForm({defaultValues: {admin: false}});

  const postData = async (actividad) =>{
    const actividadRef = doc(firestore, "eventos/"+params.id+"/actividades", evento.id+"actividad"+uid.rnd())
    const actividadDoc = await setDoc(actividadRef, actividad);
    const eventoRef = doc(firestore, "eventos", params.id);
    const eventoDoc = await updateDoc(eventoRef, {
      cantidad_actividades: increment(1)
    });
    
    router.push('/main/view/evento/'+params.id);
}
const onSubmit = (data) =>{
    const actividad ={
        descripcion: data.entrada,
        pista: data.pista,
        codigo: data.codigo,
        posicion: evento.cantidadActividades,
        nombre_carta: data.nombreCarta,
        nombre_modelo: data.nombreModelo,
        acierto: data.acierto,
        fallo: data.fallo,
        eventoId: evento.id
    }
    postData(actividad);
}

  const back = () =>{
    router.push('/main/view/evento/'+params.id);
  }

  const loadEvento = async () =>{
    const eventoRef = doc(firestore, "eventos", params.id);
    const eventoDoc = await getDoc(eventoRef);
    const eventoData = eventoDoc.data();
    const newEvent = {
      id: eventoDoc.id,
      nombre: eventoData.nombre,
      fecha: eventoData.fecha,
      userId: eventoData.user_id,
      codigo: eventoData.codigo,
      cantidadActividades: eventoData.cantidad_actividades
    }
    setEvento(newEvent);
  }

  useEffect(() => {
    if(!auth.currentUser){
        router.push('/main/login');
    }else{
        loadEvento();
    }
  }, [])

  return (
    <div className='flex w-full min-h-screen bg-[#112A7C] justify-center align-middle items-center'>
      <form className='flex flex-col bg-[#E7DDCB] border-2 border-black py-6 px-6 gap-10 justify-center align-middle items-center w-5/12' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex text-black text-2xl font-normal text-start w-full'>Nueva Actividad</div>
        <div className='flex flex-col border-2 border-black p-5 gap-5 w-full bg-[#FBF1DF]'>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Entrada:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Ingrese una pregunta o actividad"
                            {...register('entrada', {
                                required: true
                            })}
                        />
                        {errors.entrada?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Pista:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Donde encontrarán la actividad los participantes"
                            {...register('pista', {
                                required: true
                            })}
                        />
                        {errors.pista?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Codigo:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Respuesta para pasar la actividad"
                            {...register('codigo', {
                                required: true
                            })}
                        />
                        {errors.codigo?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Carta:</label>
                        <select
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Nombre de Carta"
                            {...register('nombreCarta', {
                                required: true
                            })}
                        >
                            {imagenes.map((imagen, index) =>
                                <option value={imagen.archivo} key={index}>{imagen.nombre}</option>)}
                        </select>
                        {errors.nombreCarta?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Modelo:</label>
                        <select
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Nombre del Modelo"
                            {...register('nombreModelo', {
                                required: true
                            })}
                        >
                            {modelos.map((modelo, index) =>
                                <option value={modelo.archivo} key={index} className=" py-2">{modelo.nombre}</option>)}
                        </select>

                        {errors.nombreModelo?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Mensaje de acierto:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Felicidades"
                            {...register('acierto', {
                                required: true
                            })}
                        />
                        {errors.acierto?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Mensaje de fallo:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Vuelve a intentarlo"
                            {...register('fallo', {
                                required: true
                            })}
                        />
                        {errors.fallo?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
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

export default CreateActivityPage;