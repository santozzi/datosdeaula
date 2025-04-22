

import { useEffect, useState } from 'react';
import './App.css'

/* import { Rangos } from './components/Rangos'
import RangosHeader from './components/RangosHeader/RangosHeader' */
import {filtrarPorAula, filtrarPorEdificio, pasarAAulaReservaArray, AulaReserva, filtroPorDia} from './models/aula.model.ts'


function App() {
  const [aulas,setAulas] = useState<AulaReserva[]>([]);

  useEffect(() => {

  pasarAAulaReservaArray().then((aula:any) => {
    console.log("reservas", aula);
     const reservasFiltradas = filtrarPorEdificio("BIOLOGIA", aula);
    console.log("reservasFiltradas", reservasFiltradas);
    const reservasFiltradasPorAula = filtrarPorAula("1", reservasFiltradas);
    console.log("reservasFiltradasPorAula", reservasFiltradasPorAula);
     
    const reservasFiltradasPorDia = filtroPorDia("Lunes", reservasFiltradasPorAula);
    console.log("reservasFiltradasPorDia", reservasFiltradasPorDia);
    setAulas(reservasFiltradasPorDia);
  }
  ).catch((error) => {
    console.error("Error al pasar a reservas array:", error);
  });
  }, []);

  return (
    <>
{/*      <RangosHeader />
     <Rangos /> */}
       {
        aulas.map((aula:AulaReserva,index)=>{
          return (
            <div key={index}>
              <h1>{aula.aula}</h1>
              <h2>{aula.edificio}</h2>
              <div  className='reserva'>
              {aula.lunes.map((reserva:boolean, index) => {
                return (
                  <div key={index}>
                    <h3>{(index>7 && index < 23) && index}</h3>
                    
                    {(index>7 && index < 23) && (reserva ? <div className="cuadro rojo"></div> : <div className='cuadro verde'></div>)}
                 
                  </div>
                )
              }
              )}
              </div>
 
            </div>
          )
        })
       }
    </>
  )
}

export default App
