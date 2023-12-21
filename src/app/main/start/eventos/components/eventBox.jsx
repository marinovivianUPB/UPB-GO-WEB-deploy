"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useUserContext } from '../../../../layout';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDoc, getDocs, where, deleteDoc, getDocFromServer, updateDoc, increment} from "firebase/firestore";
import ShortUniqueId from 'short-unique-id';
const EventBox = (evento) => {
  const auth = useAuth();
  const router = useRouter();
  const {user, setUser} = useUserContext();
  const firestore = useFirestore();
  const eventosCollection = collection(firestore, "eventos");
  const actividadesCollection = collection(firestore, "eventos/"+evento.evento.id+"/actividades");
  const equiposCollection = collection(firestore, "eventos/"+evento.evento.id+"/equipos");
  const [actividades, setActividades] = useState([]);
  const uid = new ShortUniqueId({length: process.env.UID_LENGTH})
  const [changed, setChanged] = useState(false);

  const compararPosicion = (a,b) =>{
    return a.posicion - b.posicion
  }

  const postData = async() =>{
    const userRef = doc(firestore, "users", user?.uid)
    const updateResponse = await updateDoc(userRef, {
      eventos: increment(1)
    })
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data()
    const idEventoCopia=user?.uid+"Evento"+userData.eventos;
    const responseSet = await setDoc(doc(firestore, "eventos",idEventoCopia),{
      fecha: evento.evento.fecha,
      nombre: (evento.evento.nombre+" copia"),
      user_id: user?.uid,
      codigo: uid.rnd()
    });
    actividades.map(
      async (actividad) =>
      {
        const response = await setDoc(doc(firestore, "eventos/"+idEventoCopia+"/actividades", user?.uid+"actividad"+actividad.posicion),{
          codigo: actividad.codigo,
          descripcion: actividad.descripcion,
          pista: actividad.pista,
          posicion: actividad.posicion,
          nombre_carta: actividad.nombreCarta || null,
          nombre_modelo: actividad.nombreModelo || null,
          evento_id: idEventoCopia
        });
      }
    )

    const docsEquipos = await getDocs(equiposCollection);
    const aux = docsEquipos.docs.map(async doc => {
      const data = doc.data();
      const newEquipo = {
        asignado: false,
        evento_id: data.evento_id,
        nombre: data.nombre,
        secuencia: data.secuencia
      }
      const response = await addDoc(collection(firestore, "eventos/"+idEventoCopia+"/equipos"), newEquipo)
    });
    evento.setChanged(!evento.changed);
  }

  const copiarEvento = ()=>{
    postData();
  }

  const deleteActividades = async() =>{
    actividades.map(
      async (actividad) =>
      {
        const response = await deleteDoc(doc(firestore, "eventos/"+evento.evento.id+"/actividades", actividad.id));
      }
    )
  }

  const deleteEvento = async () =>{
    const response = await deleteDoc(doc(firestore, "eventos", evento.evento.id));
    setChanged(!changed);
    evento.setChanged(!evento.changed);
  }

  const startDeletion = () =>{
    deleteActividades();
    deleteEvento();
  }

  const loadActividades = async () =>{
    const docsActividades = await getDocs(actividadesCollection);
    const aux = docsActividades.docs.map(doc => {
      const data = doc.data();
      const newActivity = {
        id: doc.id,
        codigo: data.codigo,
        descripcion: data.descripcion,
        pista: data.pista,
        posicion: data.posicion,
        nombreCarta: data.nombre_carta,
        nombreModelo: data.nombre_modelo,
        eventoId: data.evento_id
      }
      return newActivity;
    });
    const sortedAux = aux.sort(compararPosicion);
    setActividades(sortedAux);
  }

  const redirigir = (texto) =>{
    if(user!=null){
        router.push('/main/view/evento/'+texto);
    } else{
        router.push('/main/login');
    }
}

useEffect(() => {
  //TODO: add context to save user there
  if(!auth.currentUser){
      router.push('/main/login');
  }else{
      loadActividades();
  }
}, [changed])

  return (
    <>
      <div className='flex flex-col border-2 border-black bg-[#FBF1DF] w-full' key={evento.index}>
      <div className='flex flex-col bg-[#FBF1DF] p-5 gap-5 w-full'>
        <div className='flex flex-row'>
            <div className='flex flex-row w-4/5 gap-1 align-bottom items-end'>
                <div className='flex text-xl text-start text-black truncate'>{evento.evento.nombre}</div>
                <div className='flex text-xs text-start text-black mb-1 w-2/5'>({evento.evento.fecha})</div>
            </div>
            <div className='flex flex-row w-2/5 gap-2 items-end justify-end'>
                <div className='flex text-base text-center text-black underline hover:text-gray-600 cursor-pointer' onClick={() => copiarEvento()}>Copiar</div>
                <div className='flex text-base text-center text-black underline hover:text-gray-600 cursor-pointer' onClick={() => redirigir(evento.evento.id)}>Ver</div>
            </div>
        </div>
        
        <div className='flex flex-col w-full gap-5'>
          {actividades.length === 0 ?
            <></>
            :
            
            actividades.map((actividadLista, index) => 
            <div className='flex w-full h-6 text-black truncate font-light' key={index}>
              # {actividadLista.posicion} {actividadLista.descripcion}
            </div>)
            
            }
        </div>
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <button className=' flex text-base font-normal bg-[#CB2F2F] py-4 px-6 text-white justify-center items-center align-middle' onClick={() => startDeletion()}>Eliminar</button>
        </div>
      </div>
      </div>
    </>
  )
}

export default EventBox;