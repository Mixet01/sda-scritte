const entries=[
 ['COSENZA','Calabria'],['CATANZARO','Calabria'],['REGGIO CALABRIA','Calabria'],
 ['HB2 FLY','HUB'],['HB2 COY','HUB'],['HP3 FLY','HUB'],['HP3 COY','HUB'],
 ['HM4 FLY','HUB'],['HM4 COY','HUB'],['HQ2 FLY','HUB'],['HQ2 COY','HUB'],
 ['HR2 FLY','HUB'],['HR2 COY','HUB'],['PRODOTTO LENTO','Altre'],
 ['HB AMAZON REVERSE','Reverse'],['HB REVERSE YOOX','Reverse'],['HP REV','Reverse'],['UCA SALERNO','Altre'],
 ['MY DA POTENZA','Internazionale'],['HM EURODIS','Internazionale'],['HP3 TO EURODIS','Internazionale'],['HW REVERSE ZALANDO','Reverse']
];
export const destinations=entries.map(([label,hub],index)=>{const id=label.toLowerCase().replace(/\s+/g,'-');return{id,label,hub,pdf_path:id==='hw-reverse-zalando'?'/print-zalando.html':`/pdf/${id}.pdf`,sort_order:index};});
