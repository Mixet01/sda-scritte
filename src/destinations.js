const entries=[
 ['COSENZA','Calabria'],['CATANZARO','Calabria'],['REGGIO CALABRIA','Calabria'],
 ['HB2 FLY','FLY'],['HB2 COY','COY'],['HP3 FLY','FLY'],['HP3 COY','COY'],
 ['HM4 FLY','FLY'],['HM4 COY','COY'],['HQ2 FLY','FLY'],['HQ2 COY','COY'],
 ['HR2 FLY','FLY'],['HR2 COY','COY'],['PRODOTTO LENTO','Altre'],
 ['HB AMAZON REVERSE','Reverse'],['HB REVERSE YHOOX','Reverse'],['HP REV','Reverse'],['UCA SALERNO','Altre'],
 ['MY DA POTENZA','Altre'],['HM EURODIS','Altre'],['HP3 TO EURODIS','Altre']
];
export const destinations=entries.map(([label,hub],index)=>{const id=label.toLowerCase().replace(/\s+/g,'-');return{id,label,hub,pdf_path:`/pdf/${id}.pdf`,sort_order:index};});
