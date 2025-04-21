

import './App.css'

/* import { Rangos } from './components/Rangos'
import RangosHeader from './components/RangosHeader/RangosHeader' */
import {filtrarPorAula, filtrarPorEdificio, pasarAAulaReservaArray, AulaReserva, filtroPorDia} from './models/aula.model.ts'


function App() {
  pasarAAulaReservaArray().then((aula:any) => {
    console.log("reservas", aula);
     const reservasFiltradas = filtrarPorEdificio("BIOLOGIA", aula);
    console.log("reservasFiltradas", reservasFiltradas);
    const reservasFiltradasPorAula = filtrarPorAula("1", reservasFiltradas);
    console.log("reservasFiltradasPorAula", reservasFiltradasPorAula);
     
    const reservasFiltradasPorDia = filtroPorDia("Lunes", reservasFiltradasPorAula);
    console.log("reservasFiltradasPorDia", reservasFiltradasPorDia);
  }
  ).catch((error) => {
    console.error("Error al pasar a reservas array:", error);
  });


  return (
    <>
{/*      <RangosHeader />
     <Rangos /> */}

    </>
  )
}

export default App
