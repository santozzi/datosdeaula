"use client";
import React from 'react';
import './css/styles.css';


const RangosHeader: React.FC  = () => {
	const [range, setRange] = React.useState<boolean[]>([ false, false, false,false, false, false, false, false, false, false, false, false, false, false, false]);
	return (
		<div className="rango-container-header">
 			{
				range.map((value, index) => (
					
					<div key={index} className='rango-header'>
						{(index + 8 <=9) ? `0${index + 8}` : `${index+ 8}`}
						
						  	
						
						
						
						
					</div>
				))
 			}
			 		</div>
	);
};

export default RangosHeader;
