"use client";
import React from 'react';
import './css/styles.css';


const Rangos: React.FC  = () => {
	const [range, setRange] = React.useState<boolean[]>([ true,true, true,true, false, false, false, true, true, false, false, false, false, false, false]);
	return (
		<div className="rango-container">
 			{
				range.map((value, index) => (
					
					<div key={index}>
						{
						  (value)
						  ?	<div className="rango"></div>
						  : <div className="rango ocupado"></div>
						}
						
						
					</div>
				))
 			}
			 		</div>
	);
};

export default Rangos;
