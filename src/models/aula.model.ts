import * as XLSX from "xlsx";
import { HorasCheckbox } from "../App";

async function obtenerArchivo(ruta:string) {
  const response = await fetch(ruta);
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "application/vnd.ms-excel" });
  return blob;
}
export interface aulaSeparadaPorDia {
    diaDeLaSemana: string;
    aula: string;
    edificio: string;
    periodo: string;
    capacidad: number;
    diaReservaArray:PeriodoReserva[];

}
export interface reserva {
  departamento: string;
  anio: string;
  perReserva: string;
  comision: string;
  materiaNumero: number;
  materia: string;
  diaReserva: string;
  horaInicioReserva: string;
  horaFinReserva: string;
  aula: string;
  edificio: string;
  capacidad: number;
}

export interface AulaReserva {
  edificio: string;
  capacidad: number;
  diaReserva: string;
  materia: string;
  periodo: string;
  comision: string;
  aula: string;
  lunes: boolean[];
  martes: boolean[];
  miercoles: boolean[];
  jueves: boolean[];
  viernes: boolean[];
  sabado: boolean[];
  domingo: boolean[];
}

/* function parseTimeStringToDate(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return hours;
  } */

export const extraerXls = async (ruta:string): Promise<unknown[][] | undefined> => {
    
  const file = await obtenerArchivo(ruta);

  if (!file) return;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        resolve(jsonData as unknown[][]);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
};


export const unirExcels = async ()=> {
   
    let contenedor:unknown[][] = [];
        
    const archivos = [
        "./asignacion_aulas_Anual-2025 (1).xls",
        "./asignacion_aulas_PrimerCuatrimestre-2025 (1).xls",
        "./asignacion_aulas_Semanal-2025 (3).xls",
        "./asignacionaulas2025.xls",
       ];
        for (const archivo of archivos) {
            const file = await obtenerArchivo(archivo);
            if (!file) return;
            const nuevoExcel = await extraerXls(archivo);
            if(!nuevoExcel) return;
            contenedor = [...contenedor, ...nuevoExcel];
        }
    return new Promise<unknown[][]>( (resolve, reject) => {
        
            resolve(contenedor);
    });    
};

export interface PeriodoReserva{
  periodo: string;
  reservado: boolean;

}
export const pasarAReservasArray = async () => {
  const reservas: reserva[] = [];
  const departamento = 0;
  const anio = 1;
  const perReserva = 2;
  const comision = 3;
  const materiaNumero = 4;
  const materia = 5;
  const diaReserva = 8;
  const horaInicioReserva = 9;
  const horaFinReserva = 10;
  const aula = 11;
  const complejo = 12;
  const capacidad = 13;

  const jsonData = await unirExcels();
  console.log("tipo de json", typeof jsonData);
  if (jsonData === undefined || jsonData === null) {
    console.error("No data found");
    return;
  }
  jsonData.forEach((row: any) => {
    //el primiero es el encabezado

    if (
      row[horaInicioReserva] != undefined &&
      row[horaFinReserva] != undefined &&
      row[horaFinReserva].includes(":") &&
      row[complejo] !== "s/d" 
    ) {
      const rowData: reserva = {
        departamento: row[departamento],
        anio: row[anio],
        perReserva: row[perReserva],
        comision: row[comision],
        materiaNumero: parseInt(row[materiaNumero]),
        materia: row[materia],
        diaReserva: row[diaReserva],
        horaInicioReserva: row[horaInicioReserva],
        horaFinReserva: row[horaFinReserva],
        aula: row[aula],
        edificio: row[complejo],
        capacidad: parseInt(row[capacidad]),
      };
      //console.log("rowData", rowData);
      reservas.push(rowData);
      //setReservas((prevReservas) => [...prevReservas, rowData]);

      /*             if(row[aula]=='1' && row[diaReserva] == 'Lunes' && row[complejo] == 'BIOLOGIA'){
                //const horas = getTimeDifference(row[horaInicioReserva], row[horaFinReserva]);
                const horaI = parseTimeStringToDate(row[horaInicioReserva]);
                const horaF = parseTimeStringToDate(row[horaFinReserva]);
                console.log("horaI", horaI, "horaF", horaF);
                
               while(horaI<=horaF){
                    disponibilidad[0].lunes[horaI] = true;
                    horaI++;
                } 
               // setDisponibilidad(disponibilidad);
                //console.log(row[diaReserva], parseTimeStringToDate(row[horaInicioReserva]), parseTimeStringToDate(row[horaFinReserva]), row[aula], row[capacidad]);
              
            } */
    }
  });
  return reservas;
};

export const pasarAAulaReservaArrayPorDia = async () => {
    const aulasReservas: aulaSeparadaPorDia[] = [];

    const reservas = await pasarAReservasArray();
    if (reservas === undefined) {
      console.error("No data found");
      return;
    }

    reservas.forEach((reserva: reserva) => {
      const aulasReserva = aulasReservas.find(
        (aulaReserva) =>
          aulaReserva.aula === reserva.aula &&
          aulaReserva.edificio === reserva.edificio &&
          aulaReserva.diaDeLaSemana === reserva.diaReserva 
      );

      
      
      if (!aulasReserva) {
       
        const { edificio, aula, capacidad,diaReserva, perReserva } = reserva;

        const diaReservaArray = new Array(24).fill({periodo:perReserva,resercado:false});

  
        aulasReservas.push({
          edificio,
          capacidad,
          diaDeLaSemana: diaReserva,
          periodo:perReserva,
          aula,
          diaReservaArray
 
        });
      } else {
       
        const { diaReserva, horaInicioReserva, horaFinReserva } = reserva;
        aulasReserva.diaDeLaSemana = diaReserva;
        aulasReserva.aula = reserva.aula;
        aulasReserva.edificio = reserva.edificio;
        aulasReserva.capacidad = reserva.capacidad;
        aulasReserva.periodo = reserva.perReserva;
        switch (diaReserva) {
          case "Lunes":

            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Martes":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Miercoles":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Jueves":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Viernes":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Sabado":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          case "Domingo":
            for (
              let i = parseInt(horaInicioReserva);
              i < parseInt(horaFinReserva);
              i++
            ) {
                aulasReserva.diaReservaArray[i] = {periodo:aulasReserva.periodo,reservado:true};
            }
            break;
          default:
            break;
        }
      }
    });
    return aulasReservas;
  };
  


export const pasarAAulaReservaArray = async () => {
  const aulasReservas: AulaReserva[] = [];
  const reservas = await pasarAReservasArray();
  if (reservas === undefined) {
    console.error("No data found");
    return;
  }
  reservas.forEach((reserva: reserva) => {
    const aulaReserva = aulasReservas.find(
      (aulaReserva) =>
        aulaReserva.aula === reserva.aula &&
        aulaReserva.edificio === reserva.edificio
    );
    if (!aulaReserva) {
      const { edificio, aula, capacidad, comision, diaReserva,materia,perReserva } = reserva;
      const lunes = new Array(24).fill(false);
      const martes = new Array(24).fill(false);
      const miercoles = new Array(24).fill(false);
      const jueves = new Array(24).fill(false);
      const viernes = new Array(24).fill(false);
      const sabado = new Array(24).fill(false);
      const domingo = new Array(24).fill(false);

      aulasReservas.push({
        edificio,
        capacidad,
        comision,
        diaReserva,
        materia,
        periodo:perReserva,
        aula,
        lunes,
        martes,
        miercoles,
        jueves,
        viernes,
        sabado,
        domingo,
      });
    } else {
      const { diaReserva, horaInicioReserva, horaFinReserva } = reserva;
      switch (diaReserva) {
        case "Lunes":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.lunes[i] = true;
          }
          break;
        case "Martes":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.martes[i] = true;
          }
          break;
        case "Miercoles":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.miercoles[i] = true;
          }
          break;
        case "Jueves":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.jueves[i] = true;
          }
          break;
        case "Viernes":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.viernes[i] = true;
          }
          break;
        case "Sabado":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.sabado[i] = true;
          }
          break;
        case "Domingo":
          for (
            let i = parseInt(horaInicioReserva);
            i < parseInt(horaFinReserva);
            i++
          ) {
            aulaReserva.domingo[i] = true;
          }
          break;
        default:
          break;
      }
    }
  });
  return aulasReservas;
};

//filtros
export const filtrarPorEdificio = (
  edificio: string,
  arreglo: aulaSeparadaPorDia[]
) => {
  const reservasFiltradas = arreglo.filter(
    (reserva) => reserva.edificio === edificio
  );
  return reservasFiltradas;
};
export const filtrarPorAula = (aula: string, arreglo: aulaSeparadaPorDia[]) => {
  const reservasFiltradas = arreglo.filter((reserva) => reserva.aula == aula);
  return reservasFiltradas;
};

export const filtroPorDia = (dia: string, arreglo: AulaReserva[]) => {
  const reservasFiltradas = arreglo.filter((reserva) => {
    switch (dia) {
      case "Lunes":
        return reserva.lunes;
      case "Martes":
        return reserva.martes;
      case "Miercoles":
        return reserva.miercoles;
      case "Jueves":
        return reserva.jueves;
      case "Viernes":
        return reserva.viernes;
      case "Sabado":
        return reserva.sabado;
      case "Domingo":
        return reserva.domingo;
      default:
        return false;
    }
  });
  return reservasFiltradas;
};




export const filtrarPorHora = (hora: number, arreglo: aulaSeparadaPorDia[]) => {
  const reservasFiltradas = arreglo.filter((reserva) => {
    return (
      !reserva.diaReservaArray[hora].reservado
    );
  });
  return reservasFiltradas;
};

export const filtrarPorHoraCheckbox = (hora:HorasCheckbox, arreglo: aulaSeparadaPorDia[]) => {
  let reservasFiltradas:aulaSeparadaPorDia[] = arreglo;
  if(hora.hora8){
     reservasFiltradas = filtrarPorHora(8,reservasFiltradas);
  }
  if(hora.hora9){
     reservasFiltradas = filtrarPorHora(9,reservasFiltradas);
  }
  if(hora.hora10){
     reservasFiltradas = filtrarPorHora(10,reservasFiltradas);
  }
  if(hora.hora11){
     reservasFiltradas = filtrarPorHora(11,reservasFiltradas);
  }
  if(hora.hora12){
     reservasFiltradas = filtrarPorHora(12,reservasFiltradas);
  }
  if(hora.hora13){
     reservasFiltradas = filtrarPorHora(13,reservasFiltradas);
  }
  if(hora.hora14){
     reservasFiltradas = filtrarPorHora(14,reservasFiltradas);
  }
  if(hora.hora15){
     reservasFiltradas = filtrarPorHora(15,reservasFiltradas);
  }
  if(hora.hora16){
     reservasFiltradas = filtrarPorHora(16,reservasFiltradas);
  }
  if(hora.hora17){
     reservasFiltradas = filtrarPorHora(17,reservasFiltradas);
  }
  if(hora.hora18){
     reservasFiltradas = filtrarPorHora(18,reservasFiltradas);
  }
  if(hora.hora19){
     reservasFiltradas = filtrarPorHora(19,reservasFiltradas);
  }
  if(hora.hora20){
     reservasFiltradas = filtrarPorHora(20,reservasFiltradas);
  }
  if(hora.hora21){
     reservasFiltradas = filtrarPorHora(21,reservasFiltradas);
  }
  if(hora.hora22){
     reservasFiltradas = filtrarPorHora(22,reservasFiltradas);
  }

  return reservasFiltradas
}

export const filtroPorHoraYDia = (
  hora: number,
  dia: string,
  arreglo: AulaReserva[]
) => {
  const reservasFiltradas = arreglo.filter((reserva) => {
    switch (dia) {
      case "Lunes":
        return !reserva.lunes[hora];
      case "Martes":
        return !reserva.martes[hora];
      case "Miercoles":
        return !reserva.miercoles[hora];
      case "Jueves":
        return !reserva.jueves[hora];
      case "Viernes":
        return !reserva.viernes[hora];
      case "Sabado":
        return !reserva.sabado[hora];
      case "Domingo":
        return !reserva.domingo[hora];
      default:
        return false;
    }
  });
  return reservasFiltradas;
};
export const filtrarPorPeriodo = (
    periodo: string,
    arreglo: aulaSeparadaPorDia[]
    ) => {
    const reservasFiltradas = arreglo.filter(
        (reserva) => reserva.periodo === periodo
    );
    return reservasFiltradas;
    }
