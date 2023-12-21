"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useForm } from "react-hook-form";
import { useUserContext } from '@/app/layout';
import { customStyles } from '@/utils/CustomStyles';
import Modal from 'react-modal';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDoc, getDocs} from "firebase/firestore";
const CreateActivityPage = ({params}) => {
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();
    const [evento, setEvento] = useState();
    const [equipos, setEquipos] = useState([]);
    const {user, setUser} = useUserContext();

  const { register, watch, formState: { errors }, handleSubmit} = useForm({defaultValues: {admin: false}});

  const [isOpen, setIsOpen] = useState(false);
  const showModal = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen)
        const closeModal = () => {
          setIsOpen(false);
        }
        setTimeout(closeModal, 500);
  }

  const postData = async (equipo) =>{
    const equipoCollection = collection(firestore, "eventos/"+params.id+"/equipos")
    const equipoDoc = await addDoc(equipoCollection, equipo);
    
    router.push('/main/view/evento/'+params.id);
}
const onSubmit = (data, event) =>{
    const equipo ={
        nombre: data.nombre.toLowerCase(),
        secuencia: data.secuencia,
        asignado: Boolean(false),
        evento_id: evento.id
    }
    const equals = equipos.filter(equipoList => equipoList.nombre === equipo.nombre).length;
    if(equals > 0){
      showModal(event);
    } else{
      postData(equipo);
    }
}

  const back = () =>{
    router.push('/main/view/evento/'+params.id);
  }

  const loadEquipos = async (eventoId) =>{
    const equiposCollection = collection(firestore, "eventos/"+eventoId+"/equipos");
    const docsEquipos = await getDocs(equiposCollection);
    if(docsEquipos.docs.length >0){
      const aux = docsEquipos.docs.map(doc => {
        const data = doc.data();
        const newEquipo = {
          id: doc.id,
          nombre: data.nombre
        }
        return newEquipo;
      });
      setEquipos(aux);
    }
    
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
    loadEquipos(newEvent.id)
  }

  useEffect(() => {
    //TODO: add context to save user there
    if(!auth.currentUser){
        router.push('/main/login');
    }else{
        loadEvento();
    }
  }, [])

  return (
    <div className='flex w-full min-h-screen bg-[#112A7C] justify-center align-middle items-center'>
      <form className='flex flex-col bg-[#E7DDCB] border-2 border-black py-6 px-6 gap-10 justify-center align-middle items-center w-5/12' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex text-black text-2xl font-normal text-start w-full'>Nuevo Equipo</div>
        <div className='flex flex-col border-2 border-black p-5 gap-5 w-full bg-[#FBF1DF]'>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Nombre:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="Ingrese el nombre del equipo"
                            {...register('nombre', {
                                required: true
                            })}
                        />
                        {errors.entrada?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                    </div>
                    <div className='flex flex-col'>
                        <label className=" text-xl text-black mb-5 font-medium">Secuencia:</label>
                        <input
                            type="text"
                            className=" w-full text-base p-4 text-black bg-[#D2C3A7] placeholder:text-stone-600"
                            placeholder="El orden en el que completarán las actividades"
                            {...register('secuencia', {
                                required: true
                            })}
                        />
                        {errors.pista?.type === 'required' && <h1 className=" text-base text-red-700">*Debe llenar este campo</h1>}
                        <div className=" text-black text-xs font-medium text-center mt-4">*No incluya la actividad 0</div>
                    </div>
        </div>
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <div className=' flex text-xl font-medium w-1/3 h-9 bg-[#D0C6B4] px-5 py-6 text-stone-600 justify-center items-center align-middle cursor-pointer' onClick={() => back()}>Atrás</div>
          <button className=' flex text-xl font-medium w-1/3 h-9 bg-[#807665] px-5 py-6 text-white justify-center items-center align-middle' type='submit'>Guardar</button>
        </div>
      </form>
      <Modal isOpen={isOpen} style={customStyles}>
        <div className="texto-normal font-normal flex w-full h-full justify-center items-center">Ya existe un equipo con ese nombre</div>
      </Modal>
    </div>
  )
}

export default CreateActivityPage;