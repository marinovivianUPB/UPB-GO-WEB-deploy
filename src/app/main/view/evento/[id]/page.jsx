"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useUserContext, useEventoContext} from '@/app/layout';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDocs, getDoc, query, where, updateDoc, increment, deleteDoc} from "firebase/firestore";
import ActivityBox from '../../components/activityBox';
import EquipoBox from '../../components/equipoBox';
import FilaProgresoBox from '../../components/filaProgresoBox';
import Loading from '@/app/components/Loading';
import Image from 'next/image';

const ViewEventoPage = ({params}) => {
    const auth = useAuth();
    const router = useRouter();
    const {user, setUser} = useUserContext();
    const firestore = useFirestore();
    const eventosCollection = collection(firestore, "eventos");
    const [actividades, setActividades] = useState(null);
    const [equipos, setEquipos] = useState(null);
    const [evento, setEvento] = useState(null);
    const [changed, setChanged] = useState(true)
    const {eventoEdit, setEventoEdit} = useEventoContext();

    const compararPosicion = (a,b) =>{
        return a.posicion - b.posicion
      }

      const loadEquipos = async (eventoId) =>{
        const equiposCollection = collection(firestore, "eventos/"+eventoId+"/equipos");
        const docsEquipos = await getDocs(equiposCollection);
        if(docsEquipos.docs.length >0){
          const aux = docsEquipos.docs.map(doc => {
            const data = doc.data();
            const newEquipo = {
              id: doc.id,
              secuencia: data.secuencia,
              nombre: data.nombre,
              asignado: data.asignado,
              eventoId: data.evento_id
            }
            return newEquipo;
          });
          setEquipos(aux);
        }
        
      }

      const loadActividades = async (eventoId) =>{
        const actividadesCollection = collection(firestore, "eventos/"+eventoId+"/actividades");
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
            acierto: data.acierto,
            fallo: data.fallo,
            eventoId: data.evento_id
          }
          return newActivity;
        });
        const sortedAux = aux.sort(compararPosicion);
        setActividades(sortedAux);
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
        await loadActividades(newEvent.id);
        await loadEquipos(newEvent.id);
    }

    const deleteActivity = async (id) =>{
      const response = await deleteDoc(doc(firestore, "eventos/"+evento.id+"/actividades", id));
    }

    const changePosiciones = async (posicion) =>{
      actividades.filter(actividad => actividad.posicion > posicion).map(
        async (actividad) =>
        {
          const activityRef = doc(firestore, "eventos/"+evento.id+"/actividades", actividad.id);
          await updateDoc(activityRef, {
            posicion: increment(-1)
          })
        }
      )
    }

    const updateCantidadActividades = async () =>{
      const eventoRef = doc(firestore, "eventos", evento.id);
      const responseEvento = await updateDoc(eventoRef, {
        cantidad_actividades: increment(-1)
      })
    }

    const startDeletion = (activity) =>{
      changePosiciones(activity.posicion);
      deleteActivity(activity.id);
      updateCantidadActividades();
      setChanged(!changed);
    }

    const deleteEquipo = async (equipoId) =>{
      const response = await deleteDoc(doc(firestore, "eventos/"+evento.id+"/equipos", equipoId));
    }

    const startEquipoDeletion = (equipoId) =>{
      if(equipos.length>1){
        deleteEquipo(equipoId);
        setChanged(!changed);
      }
    }

    useEffect(() => {
      if(!user){
          router.push('/main/login');
      }else{
          loadEvento();
      }
    }, [changed])

    const redirigirCrear = (text) =>{
      router.push('/main/create/'+text+'/'+params.id);
    }

    const redirigirEditar = () =>{
      setEventoEdit(evento);
      router.push('/main/view/evento/'+params.id+"/edit");
    }

    const back = () =>{
      router.push('/main/start/eventos');
    }

  return (
    <div className='flex flex-col w-full min-h-screen bg-[#112A7C] justify-center align-middle items-center p-7 gap-10'>
      {(equipos && actividades && evento) ? 
      <>
      <div className='flex flex-col bg-[#E7DDCB] border-2 border-black p-6 gap-5 w-5/12'>
            <div className='flex flex-row w-full gap-1 align-bottom items-start justify-left'>
                <div className='flex text-3xl text-start text-black hover:text-gray-600 hover:underline cursor-pointer' onClick={() => redirigirEditar()}>{evento?.nombre}</div>
                <div className='flex text-xs text-start text-black mb-1 hover:text-gray-600 hover:underline cursor-pointer' onClick={() => redirigirEditar()}>({evento?.fecha})</div>
            </div>
            <div className='flex text-xl text-start text-black'>Código: {evento?.codigo}</div>
            <div className='flex text-xl text-start text-black'>Progreso</div>
            <div className='flex flex-col border-black border-2 bg-[#FBF1DF]'>
              {
                equipos.length === 0 ?
                <></> :

                <div className='flex w-full flex-row justify-center align-middle items-center border-2'>
                  <div className='flex flex-row w-full justify-center text-xs font-semibold text-black align-middle items-center py-4'>
                    Actividades\Equipos
                  </div>
                {equipos.map((equipo, index) =>
                <div className='flex w-full justify-center align-middle items-center text-base text-black text-center bg-[#FFCA56] py-4 border-r-2' key={index}>
                    {equipo.nombre.toUpperCase()}
                </div> )}
                </div>
              }
              {
                actividades.length === 0 ?
                <></> :
                actividades.map((actividadLista, index) =>
                
                  <FilaProgresoBox actividad={actividadLista} equipos={equipos} eventoId={evento.id} key={index}/>
                  
                )
              }
              </div>
            <div className='flex text-xl text-start text-black'>Actividades</div>
            <div className='flex flex-col w-full gap-5 justify-center align-middle items-center border-black border-2 p-4 bg-[#FBF1DF]'>
              {actividades.length === 0 ?
              <></>
              :
            
              actividades.map((actividadLista, index) => 
                <ActivityBox key={index} actividad={actividadLista} eventoId={params.id} startDeletion={startDeletion}/>
              )
              }
              <button className=' flex text-xl font-base w-1/3 bg-[#807665] px-5 py-4 text-white justify-center items-center align-middle' onClick={() => redirigirCrear("activity")}>Añadir</button>
            </div>
            
            <div className='flex text-xl text-start text-black'>Equipos</div>
            <div className='flex flex-col w-full gap-5 justify-center align-middle items-center border-black border-2 p-4 bg-[#FBF1DF]'>
              {
                equipos.length===0 ?
                <></>
                :
                equipos.map((equipo, index) => 
                  <EquipoBox key={index} equipo={equipo} eventoId={params.id} startEquipoDeletion={startEquipoDeletion} />
                )
              }
              <button className=' flex text-xl font-base w-1/3 bg-[#807665] px-5 py-4 text-white justify-center items-center align-middle' onClick={() => redirigirCrear("equipo")}>Añadir</button>
            </div>
            <div className='flex text-xl text-start text-black'>Descargar Imágenes</div>
            <div className='flex flex-col w-full gap-5 justify-center align-middle items-center border-black border-2 p-4 bg-[#FBF1DF]'>
            <div className=" text-black text-base font-medium text-center">{"https://drive.google.com/drive/folders/1R24QQcpt5-50euW1-z9QZxHbo4mjcx1k?usp=drive_link"}</div>
            </div>
      
        <div className='flex w-full justify-center items-center align-middle flex-row gap-2'>
          <button className=' flex text-xl font-medium w-4/5 h-9 bg-[#D0C6B4] px-5 py-7 text-stone-600 justify-center items-center align-middle' onClick={()=> back()}>Atrás</button>
        </div>
      </div>
      <div className='flex w-full h-1/8 justify-center align-middle items-center opacity-50'>
      <Image src="/blacklogofinal.png" width={75} height={72}/>
            </div>
      </>
      :
      <Loading/>
    }
    </div>
  )
}

export default ViewEventoPage;