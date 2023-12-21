"use client"
import React from 'react';
import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser} from 'reactfire';
import { useActivityContext, useUserContext } from '@/app/layout';
import {useFirestore, useFirestoreCollectionData} from "reactfire";
import {collection, addDoc, setDoc, doc, getDoc, getDocs, where, deleteDoc, getDocFromServer, updateDoc, increment} from "firebase/firestore";

const ActivityBox = (params) =>{
    const {actividad, eventoId, startDeletion} = params;
    const router = useRouter();
    const {activity, setActivity} = useActivityContext();

    const redirigirEditar = (text) =>{
      setActivity(actividad)
        router.push('/main/view/evento/'+eventoId+"/actividad/"+text);
    }

    return(
        <div className='flex flex-col w-full justify-center align-middle items-center p-2 gap-5'>
                <div className='flex flex-row w-full justify-center align-middle items-center'>
                  <div className='flex w-full h-6 text-base text-black truncate'>
                    # {actividad.posicion} {actividad.descripcion}
                  </div>
                  {
                  actividad.posicion === 0 ? <></>
                  :
                  <div className='flex w-1/5 text-xs justify-end text-black underline hover:text-gray-600 cursor-pointer' onClick={() => startDeletion(actividad)}>
                    Eliminar
                  </div>
                  }
                  <div className='flex w-1/5 text-xs justify-end text-black underline hover:text-gray-600 cursor-pointer' onClick={() => redirigirEditar(actividad.id)}>
                    Editar
                  </div>
                </div>
                <div className='w-full px-7 py-5 justify-left align-start items-start text-left text-black bg-[#FFE1A0]'>
                  Código: {actividad.codigo}
                </div>
                
        </div>
    )
}

export default ActivityBox;