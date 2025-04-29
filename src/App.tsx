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
  PeriodoReserva,
  filtrarPorHoraCheckbox,
} from "./models/aula.model.ts";
export interface HorasCheckbox {
  hora8: boolean;
  hora9: boolean;
  hora10: boolean;
  hora11: boolean;
  hora12: boolean;
  hora13: boolean;
  hora14: boolean;
  hora15: boolean;
  hora16: boolean;
  hora17: boolean;
  hora18: boolean;
  hora19: boolean;
  hora20: boolean;
  hora21: boolean;
  hora22: boolean;
}
function App() {
  const [aulas, setAulas] = useState<AulaReserva[]>([]);
  const [periodo, setPeriodo] = useState<string>("");
  const [aulaReserva, setAulaReserva] = useState<aulaSeparadaPorDia[]>([]);
  const [diaDelaSemana, setDiaDelaSemana] = useState<string>("");
  const [hora, setHora] = useState<HorasCheckbox>({
    hora8: false,
    hora9: false,
    hora10: false,
    hora11: false,
    hora12: false,
    hora13: false,
    hora14: false,
    hora15: false,
    hora16: false,
    hora17: false,
    hora18: false,
    hora19: false,
    hora20: false,
    hora21: false,
    hora22: false,
  });
  const handleHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setHora((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
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
        setAulaReserva(filtrarPorHoraCheckbox(hora, aula));
       
        //setAulaReserva(filtrarPorAula("11", reservasFiltradas));
      })

      .catch((error) => {
        console.error("Error al pasar a reservas array:", error);
      });
  }, [hora]);

  return (
    <div className="container-principal">
      {/*      <RangosHeader />
     <Rangos /> */}
      <div className="checkboxs">
        <input type="checkbox" name="hora8" id="8" onChange={handleHora} />
        <input type="checkbox" name="hora9" id="9" onChange={handleHora} />
        <input type="checkbox" name="hora10" id="10" onChange={handleHora} />
        <input type="checkbox" name="hora11" id="11" onChange={handleHora} />
        <input type="checkbox" name="hora12" id="12" onChange={handleHora} />
        <input type="checkbox" name="hora13" id="13" onChange={handleHora} />
        <input type="checkbox" name="hora14" id="14" onChange={handleHora} />
        <input type="checkbox" name="hora15" id="15" onChange={handleHora} />
        <input type="checkbox" name="hora16" id="16" onChange={handleHora} />
        <input type="checkbox" name="hora17" id="17" onChange={handleHora} />
        <input type="checkbox" name="hora18" id="18" onChange={handleHora} />
        <input type="checkbox" name="hora19" id="19" onChange={handleHora} />
        <input type="checkbox" name="hora20" id="20" onChange={handleHora} />
        <input type="checkbox" name="hora21" id="21" onChange={handleHora} />
        <input type="checkbox" name="hora22" id="22" onChange={handleHora} />
      </div>
      {aulaReserva.map((aula: aulaSeparadaPorDia, index) => {
        return (
          <div key={index} className="container">
            <div className="detalles">
              <div>{aula.aula}</div>
              <div>{aula.edificio}</div>
              <div>{aula.diaDeLaSemana}</div>
            </div>
            {(aula.diaDeLaSemana == diaDelaSemana || diaDelaSemana == "") && (
              <div className="reserva">
                {aula.diaReservaArray.map((reserva: PeriodoReserva, index) => {
                  return (
                    (index > 7 &&
                      index < 23) &&
                    <div key={index}>
                      {
                        (reserva.reservado ? (
                          <div
                            className={`cuadro ${
                              reserva.periodo == "Primer Cuatrimestre"
                                ? "pc-color"
                                : reserva.periodo == "Anual"
                                ? "anual-color"
                                : "semanal-color"
                            }`}
                          >
                            {index}
                          </div>
                        ) : (
                          <div className="cuadro libre-color">{index}</div>
                        ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
