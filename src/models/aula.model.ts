import * as XLSX from 'xlsx';

async function obtenerArchivo(){
   const response = await fetch('/asignacionaulas2025.xls');
   const arrayBuffer = await response.arrayBuffer();
   const blob = new Blob([arrayBuffer], { type: 'application/vnd.ms-excel' });
   return blob
}


export interface reserva {
	departamento:string;
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


    export const extraerXls = async (): Promise<any[][] | undefined> => {
        const file = await obtenerArchivo();
      
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
              resolve(jsonData as any[][]);
            } catch (error) {
              reject(error);
            }
          };
      
          reader.onerror = (error) => reject(error);
      
          reader.readAsArrayBuffer(file);
        });
      };
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
        
        
        const jsonData = await extraerXls(); 
        console.log("tipo de json", typeof jsonData);
        if (jsonData === undefined ) {
          console.error("No data found");
          return;
        }
        jsonData.forEach((row: any) => {
            //el primiero es el encabezado

            if(row[horaInicioReserva] != undefined && row[horaFinReserva]!= undefined && row[horaFinReserva].includes(":") ){
                
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
        }
       export const pasarAAulaReservaArray = async () => {
        const aulasReservas: AulaReserva[] = [];
        const reservas = await pasarAReservasArray();
        if (reservas === undefined) {
          console.error("No data found");
          return;
        }
        reservas.forEach((reserva:reserva) => {
        
            const aulaReserva = aulasReservas.find(
                (aulaReserva) => aulaReserva.aula === reserva.aula && aulaReserva.edificio === reserva.edificio);
            if (!aulaReserva) {
                const { edificio, aula } = reserva;
                const lunes = new Array(24).fill(false);
                const martes = new Array(24).fill(false);
                const miercoles = new Array(24).fill(false);
                const jueves = new Array(24).fill(false);
                const viernes = new Array(24).fill(false);
                const sabado = new Array(24).fill(false);
                const domingo = new Array(24).fill(false);
                
                aulasReservas.push({
                    edificio,
                    aula,
                    lunes,
                    martes,
                    miercoles,
                    jueves,
                    viernes,
                    sabado,
                    domingo,
                });
            }else{
                const { diaReserva, horaInicioReserva, horaFinReserva } = reserva;
                switch (diaReserva) {
                    case 'Lunes':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.lunes[i] = true;
                        }
                        break;
                    case 'Martes':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.martes[i] = true;
                        }
                        break;
                    case 'Miercoles':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.miercoles[i] = true;
                        }
                        break;
                    case 'Jueves':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.jueves[i] = true;
                        }
                        break;
                    case 'Viernes':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.viernes[i] = true;
                        }
                        break;
                    case 'Sabado':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.sabado[i] = true;
                        }
                        break;
                    case 'Domingo':
                        for (let i = parseInt(horaInicioReserva); i < parseInt(horaFinReserva); i++) {
                            aulaReserva.domingo[i] = true;
                        }
                        break;
                    default:
                        break;

            }
        }
        });
    return aulasReservas;
    
    }



      //filtros
      export const filtrarPorEdificio = (edificio:string, arreglo:AulaReserva[])=>{
        
        const reservasFiltradas = arreglo.filter((reserva) => reserva.edificio === edificio);
        return reservasFiltradas; 
      }
      export const filtrarPorAula = (aula:string, arreglo:AulaReserva[])=>{
        const reservasFiltradas = arreglo.filter((reserva) => reserva.aula == aula);
        return reservasFiltradas; 
      }

      export const filtroPorDia = (dia:string, arreglo:AulaReserva[])=>{
        const reservasFiltradas = arreglo.filter((reserva) =>{
            switch (dia) {
                case 'Lunes':
                    return reserva.lunes;
                case 'Martes':
                    return reserva.martes;
                case 'Miercoles':
                    return reserva.miercoles;
                case 'Jueves':
                    return reserva.jueves;
                case 'Viernes':
                    return reserva.viernes;
                case 'Sabado':
                    return reserva.sabado;
                case 'Domingo':
                    return reserva.domingo;
                default:
                    return false;
            }
        });
        return reservasFiltradas; 
      }
      export const filtrarPorHora = (hora:number, arreglo:AulaReserva[])=>{
        const reservasFiltradas = arreglo.filter((reserva) =>{
            return !reserva.lunes[hora] || !reserva.martes[hora] || !reserva.miercoles[hora] || !reserva.jueves[hora] || !reserva.viernes[hora] || !reserva.sabado[hora] || !reserva.domingo[hora];
        });
        return reservasFiltradas; 
      }