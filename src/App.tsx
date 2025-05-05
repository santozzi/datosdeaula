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
  obtenerEdificios,
} from "./models/aula.model.ts";
import React from "react";
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
  const [edificio, setEdificio] = useState<string>("");
  const [aula, setAula] = useState<string>("");
  const [edificios, setEdificios] = useState<string[]>([]);
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
  const [files, setFiles] = useState<FileList | null>(null);

  const handleEdificio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    

    setEdificio(value);
  }

  const handleDias = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;


    setDiaDelaSemana(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = event.target.files;
    if (files && files.length > 0) {
      setFiles(files);
    }
  };

  const handleHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setHora((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  useEffect(() => {
    if (files == null) return;
    //const filesArray = Array.from(files);
    obtenerEdificios(files).then((edificios) => {
      if(edificios != undefined)
          setEdificios(edificios);
    }
    );
    pasarAAulaReservaArrayPorDia(files)
      .then((aula: any) => {
        //console.log("reservas", aula);

        let reservasFiltradas:aulaSeparadaPorDia[] = aula;
        if (edificio != "") {
          reservasFiltradas = filtrarPorEdificio(edificio, reservasFiltradas);
        } 
        reservasFiltradas = filtrarPorHoraCheckbox(hora, reservasFiltradas);
        
        const aulaencontrada= reservasFiltradas.filter((aula) => {
          return aula.aula == "16" && aula.diaDeLaSemana == "Miércoles" && aula.edificio == "PALIHUE - COMPLEJO NUEVO";
        })
       
        
        if(aulaencontrada != undefined)
          setAulaReserva(reservasFiltradas);
      
  
        //setAulaReserva(filtrarPorAula("11", reservasFiltradas));
      })

      .catch((error) => {
        console.error("Error al pasar a reservas array:", error);
      });
  }, [hora, files,edificio]);

  return (
    <div className="container-principal">
      {/*      <RangosHeader />
     <Rangos /> */}
     
      <div className="herramientas"> 
        <div className="colores">
          <div className="color pc-color">Primer Cuatrimestre</div>
          <div className="color anual-color">Anual</div>
          <div className="color semanal-color">Semanal</div>
          <div className="color libre-color">Libre</div>
        </div>
        <input
          type="file"
          name="file"
          id="file"
          multiple
          accept=".xls"
          onChange={handleFileChange}
        />
        <div className="edificios-dias">
    
        <select name="edificios" id="edificios" onChange={handleEdificio}>
        <option value="">Seleccione un edificio</option>
          {
            edificios.map((edificio, index) => {
              return (
                <option key={"edificio"+index} value={edificio}>
                  {edificio}
                </option>
              );
            })}

         </select>
        <select name="dias" id="dias" onChange={handleDias}>
          <option value="">Seleccione un dia</option>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miércoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sábado">Sábado</option>
        </select>
        </div>
        <div className="checkboxs">
          <div className="input-label">
          <label htmlFor="hora8">8</label>
          <input type="checkbox" name="hora8" id="8" onChange={handleHora} />
          </div>
          <div className="input-label">

          <label htmlFor="hora9">9</label>
          <input type="checkbox" name="hora9" id="9" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora10">10</label>
          <input type="checkbox" name="hora10" id="10" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora11">11</label>
          <input type="checkbox" name="hora11" id="11" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora12">12</label>
          <input type="checkbox" name="hora12" id="12" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora13">13</label>
          <input type="checkbox" name="hora13" id="13" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora14">14</label>
          <input type="checkbox" name="hora14" id="14" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora15">15</label>
          <input type="checkbox" name="hora15" id="15" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora16">16</label>
          <input type="checkbox" name="hora16" id="16" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora17">17</label>
          <input type="checkbox" name="hora17" id="17" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora18">18</label>
          <input type="checkbox" name="hora18" id="18" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora19">19</label>
          <input type="checkbox" name="hora19" id="19" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora20">20</label>
          <input type="checkbox" name="hora20" id="20" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora21">21</label>
          <input type="checkbox" name="hora21" id="21" onChange={handleHora} />
          </div>
          <div className="input-label">
          <label htmlFor="hora22">22</label>
          <input type="checkbox" name="hora22" id="22" onChange={handleHora} />
          </div>
        </div>
      </div>

      {files != null &&
        aulaReserva.map((aula: aulaSeparadaPorDia, index) => {
          return (
            <React.Fragment key={"aulas" + index}>
            {(aula.diaDeLaSemana == diaDelaSemana || diaDelaSemana == "") && (
            <div key={"aula"+index} className="container">
       
              <div className="detalles">
                <div className="lugar">
                  <div style={{fontSize:'15px' }}> Aula: {aula.aula}</div>
                  <div style={{fontSize:'15px' }}>Edificio:{aula.edificio}</div>
                 
                </div>
                <div>
                  <div>{aula.diaDeLaSemana}</div>
                  <div>cap:{aula.capacidad}</div>
                </div>
              </div>
              
                <div className="reserva">
                  {aula.diaReservaArray.map(
                    (reserva: PeriodoReserva, index) => {
                      return (
                        index > 7 &&
                        index < 23 && (
                          <div key={"reserva"+index}>
                            {reserva.reservado ? (
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
                            )}
                          </div>
                        )
                      );
                    }
                  )}
                </div>
             
            </div> 
          )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default App;
