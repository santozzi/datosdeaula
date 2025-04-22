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
} from "./models/aula.model.ts";

function App() {
  const [aulas, setAulas] = useState<AulaReserva[]>([]);

  useEffect(() => {
    pasarAAulaReservaArray()
      .then((aula: any) => {
        console.log("reservas", aula);
        const reservasFiltradas = filtrarPorEdificio("BIOLOGIA", aula);
        console.log("reservasFiltradas", reservasFiltradas);
        const reservasFiltradasPorAula = filtrarPorAula("1", reservasFiltradas);
        console.log("reservasFiltradasPorAula", reservasFiltradasPorAula);

        const reservasFiltradasPorDia = filtroPorDia(
          "Lunes",
          reservasFiltradasPorAula
        );
        console.log("reservasFiltradasPorDia", reservasFiltradasPorDia);
        setAulas(filtrarPorHora(14,filtrarPorHora(13,filtrarPorHora(12,aula))));
      })
      .catch((error) => {
        console.error("Error al pasar a reservas array:", error);
      });
  }, []);

  return (
    <>
      {/*      <RangosHeader />
     <Rangos /> */}
      {aulas.map((aula: AulaReserva, index) => {
        return (
          <div key={index} className="container">
            <div className="reserva">
              {aula.lunes.map((reserva: boolean, index) => {
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
            </div>
          </div>
        );
      })}
    </>
  );
}

export default App;
