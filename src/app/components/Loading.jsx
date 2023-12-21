"use client"
import React from 'react';
import Image from 'next/image';

const Loading = () => {
    return (
        <div className='flex flex-col border-black py-6 px-6 gap-10'>
            <Image src="/pikachu.gif" alt="/pokeball.png" width={225} height={72}/>
            <div  className='flex text-xl font-bold w-full text-white justify-center items-center align-middle'>Cargando...</div>
        </div>
    );
}

export default Loading;