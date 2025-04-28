import { useEffect, useState } from "react";
import "./App.css";

/* import { Rangos } from './components/Rangos'
import RangosHeader from './components/RangosHeader/RangosHeader' */
import {
  filtrarPorAula,
  filtrarPorEdificio,
  pasarAAulaReservaArray,
  AulaReserva,
  filtroPorDia,
  filtrarPorHora,
  filtroPorHoraYDia,
  pasarAAulaReservaArrayPorDia,
  aulaSeparadaPorDia,
  filtrarPorPeriodo,
} from "./models/aula.model.ts";

function App() {
  const [aulas, setAulas] = useState<AulaReserva[]>([]);
  const [periodo, setPeriodo] = useState<string>("Primer Cuatrimestre");
  const[aulaReserva, setAulaReserva] = useState<aulaSeparadaPorDia[]>([]);
  const [diaDelaSemana, setDiaDelaSemana] = useState<string>("Viernes");
  

  useEffect(() => {
    pasarAAulaReservaArrayPorDia()
      .then((aula: any) => {
        //console.log("reservas", aula);
      const reservasFiltradas = filtrarPorEdificio("BIOLOGIA", aula);
       // console.log("reservasFiltradas", reservasFiltradas);
          /* 
        const reservasFiltradasPorAula = filtrarPorAula("1", reservasFiltradas);
        console.log("reservasFiltradasPorAula", reservasFiltradasPorAula);

        const reservasFiltradasPorDia = filtroPorDia(
          "Lunes",
          reservasFiltradasPorAula
        );
        console.log("reservasFiltradasPorDia", reservasFiltradasPorDia);
        setAulas(filtrarPorHora(14,filtrarPorHora(13,filtrarPorHora(12,aula)))); */
        setAulaReserva(filtrarPorPeriodo("Primer Cuatrimestre",reservasFiltradas));
       //setAulaReserva(filtrarPorAula("11", reservasFiltradas));
      })
      
      .catch((error) => {
        console.error("Error al pasar a reservas array:", error);
      });
  }, []);

  return (
    <div className="container-principal">
      {/*      <RangosHeader />
     <Rangos /> */}
     <div className="checkboxs">
      <input type="checkbox" name="8" id="8" />
      <input type="checkbox" name="9" id="9" />
      <input type="checkbox" name="10" id="10" />
      <input type="checkbox" name="11" id="11" />
      <input type="checkbox" name="12" id="12" />
      <input type="checkbox" name="13" id="13" />
      <input type="checkbox" name="14" id="14" />
      <input type="checkbox" name="15" id="15" />
      <input type="checkbox" name="16" id="16" />
      <input type="checkbox" name="17" id="17" />
      <input type="checkbox" name="18" id="18" />
      <input type="checkbox" name="19" id="19" />
      <input type="checkbox" name="20" id="20" />
      <input type="checkbox" name="21" id="21" />
      <input type="checkbox" name="22" id="22" />
      </div>
      {aulaReserva.map((aula: aulaSeparadaPorDia, index) => {
        return (
          
          <div key={index} className="container">
            
            {
            aula.diaDeLaSemana==diaDelaSemana &&
            <div className="reserva">
              {aula.diaReservaArray.map((reserva: boolean, index) => {
                
                return (
                  <div key={index}>
                    
                    {index > 7 &&
                      index < 23 &&
                      (reserva ? (
                        <div className="cuadro rojo">{index}</div>
                      ) : (
                        <div className="cuadro verde">{index}</div>
                      ))}
                  </div>
                );
              })}
              <h6>{aula.aula}</h6>
              <h6>{aula.edificio}</h6>
              <h6>{aula.diaDeLaSemana}</h6>
              <h6>{aula.periodo}</h6>
         
            </div>
            }
       
          </div>
        );
      })}
    </div>
  );
}

export default App;
