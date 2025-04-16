"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface diasComplejo {
	edificio: string;
	lunes: boolean[];
	martes: boolean[];
	miercoles: boolean[];
	jueves: boolean[];
	viernes: boolean[];
	sabado: boolean[];
	domingo: boolean[];
}
const Aulas: React.FC  = () => {
	const [data, setData] = useState<Record<string, string>[]>([]);
	const [disponibilidad, setDisponibilidad] = useState<diasComplejo[]>([
		{
			edificio: 'BIOLOGIA',
			lunes: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			martes: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			miercoles: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			jueves: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			viernes: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			sabado: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
			domingo: [false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false, false, false, false, false, false, false, false, false],
		},
	]);


	
	function parseTimeStringToDate(timeString: string): number {
		const [hours, minutes, seconds] = timeString.split(":").map(Number);
		const date = new Date();
		date.setHours(hours, minutes, seconds, 0);
		return hours;
	  }
	
/* 	  function getTimeDifference(start: string, end: string): string {
		const startDate = parseTimeStringToDate(start);
		const endDate = parseTimeStringToDate(end);
	  
		let diffMs = endDate.getTime() - startDate.getTime();
	  
		// Si el tiempo de fin es menor al de inicio, se asume que es al día siguiente
		if (diffMs < 0) {
		  diffMs += 24 * 60 * 60 * 1000;
		}
	  
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
	  
		return `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
	  } */

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const diaReserva = 8;
		const horaInicioReserva = 9;
		const horaFinReserva = 10;
        const aula = 11;
		const complejo = 12;
		const capacidad = 13;
		const file = event.target.files?.[0];
		if (!file) {
		  return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
		  const data = new Uint8Array(e.target?.result as ArrayBuffer);

		  const workbook = XLSX.read(data, { type: "array" });
		  const sheetName = workbook.SheetNames[0];
		  const worksheet = workbook.Sheets[sheetName];
		  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
		  
		  
		  setData(jsonData as Record<string, string>[]);
	      
		   
		   
		   jsonData.forEach((row: any) => {
			//el primiero es el encabezado

			if(row[horaInicioReserva] != undefined && row[horaFinReserva]!= undefined && row[horaFinReserva].includes(":") ){
	          if(row[aula]=='1' && row[diaReserva] == 'Lunes' && row[complejo] == 'BIOLOGIA'){
				//const horas = getTimeDifference(row[horaInicioReserva], row[horaFinReserva]);
				let horaI = parseTimeStringToDate(row[horaInicioReserva]);
				const horaF = parseTimeStringToDate(row[horaFinReserva]);
				while(horaI<=horaF){
					disponibilidad[0].lunes[horaI] = true;
					horaI++;
				}
				setDisponibilidad(disponibilidad);
			    console.log(row[diaReserva], parseTimeStringToDate(row[horaInicioReserva]), parseTimeStringToDate(row[horaFinReserva]), row[aula], row[capacidad]);
			  
			}
			  
			
			}
            
		  }); 
		  console.log("lunes", disponibilidad[0].lunes);
		  
		};

		reader.readAsArrayBuffer(file);
	  };
	return (
		<div>
			 <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
			 {data.length > 0 && (
        <table className="mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              {Object.keys(data).map((key) => (
                <th key={key} className="border px-2 py-1">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="border px-2 py-1">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
 		</div>
	);
};

export default Aulas;
