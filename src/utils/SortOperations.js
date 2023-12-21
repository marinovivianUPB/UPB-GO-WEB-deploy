export const compararPosicion = (a,b) =>{
    return a.posicion - b.posicion
}

export const compararNombre = (a,b) =>{
    if (a.nombre < b.nombre){
        return -1;
    }
    if (a.nombre > b.nombre){
        return 1;
    }
    return 0;
}