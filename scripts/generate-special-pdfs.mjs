import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const black=rgb(0,0,0);
const banks=JSON.parse(await readFile(new URL('../data/foglio-banche.json',import.meta.url),'utf8'));
const pdf=await PDFDocument.create();
pdf.setTitle('Foglio banche');pdf.setAuthor('SDA Scritte');
const regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
const widths=[145,105,155,71,71];
const xs=[24];for(const w of widths)xs.push(xs.at(-1)+w);
const wrap=(value,font,size,maxWidth)=>{
 const words=value.split(' '),lines=[];let line='';
 for(const word of words){const next=line?`${line} ${word}`:word;if(line&&font.widthOfTextAtSize(next,size)>maxWidth){lines.push(line);line=word;}else line=next;}
 if(line)lines.push(line);return lines;
};
for(const [index,rows] of banks.entries()){
 const page=pdf.addPage([595.2756,841.8898]);
 page.drawText('DATA', {x:24,y:807,size:12,font:bold,color:black});
 page.drawLine({start:{x:65,y:804},end:{x:235,y:804},thickness:.6,color:black});
 const top=780,header=26,rowHeight=24,bottom=top-header-rows.length*rowHeight;
 page.drawRectangle({x:24,y:top-header,width:547,height:header,color:rgb(.94,.94,.94)});
 const headers=['ISTITUTO',"LOCALITA'",'INDIRIZZO','BOLGETTA','ASSEGNI'];
 headers.forEach((value,c)=>page.drawText(value,{x:xs[c]+(widths[c]-bold.widthOfTextAtSize(value,10))/2,y:top-17,size:10,font:bold,color:black}));
 rows.forEach((row,r)=>row.forEach((value,c)=>{
  const lines=wrap(value,regular,9,widths[c]-10);
  if(lines.length>2)throw new Error(`Cella troppo lunga: ${value}`);
  lines.forEach((line,l)=>page.drawText(line,{x:xs[c]+5,y:top-header-r*rowHeight-rowHeight/2+(lines.length-1)*5.2-3.2-l*10.4,size:9,font:regular,color:black}));
 }));
 for(const x of xs)page.drawLine({start:{x,y:bottom},end:{x,y:top},thickness:.5,color:black});
 for(const y of [top,...Array.from({length:rows.length+1},(_,r)=>top-header-r*rowHeight)])page.drawLine({start:{x:24,y},end:{x:571,y},thickness:.5,color:black});
 page.drawText(`FOGLIO ${index+1} / 4`,{x:24,y:28,size:8,font:regular,color:rgb(.4,.4,.4)});
}
await writeFile(new URL('../public/pdf/foglio-banche.pdf',import.meta.url),await pdf.save());

const poste=await PDFDocument.create();poste.setTitle('Poste prodotto lento');poste.setAuthor('SDA Scritte');
const normal=await poste.embedFont(StandardFonts.Helvetica),heavy=await poste.embedFont(StandardFonts.HelveticaBold),serif=await poste.embedFont(StandardFonts.TimesRomanBold);
const page=poste.addPage([595.2756,841.8898]);
const x=25,w=545,h=368;
for(const y of [438,36]){
 const line=(x1,y1,x2,y2,thickness=1)=>page.drawLine({start:{x:x1,y:y1},end:{x:x2,y:y2},thickness,color:black});
 const text=(value,tx,ty,size,font=normal)=>page.drawText(value,{x:tx,y:ty,size,font,color:black});
 page.drawRectangle({x,y,width:w,height:h,borderColor:black,borderWidth:1.2});
 text('Posteitaliane',x+7,y+h-24,23,heavy);
 text('Modulo: KANBAN AVVIAMENTO PACCHI',x+7,y+h-44,12,serif);
 const headerY=y+h-53,fromY=y+205,middleY=y+110;
 line(x,headerY,x+w,headerY);line(x,fromY,x+w,fromY);line(x,middleY,x+w,middleY);
 const arrow=(baseY,boxHeight,label)=>{
  const ax=x+3,aw=104,notch=21;
  const points=[[ax,baseY],[ax+aw-notch,baseY],[ax+aw,baseY+boxHeight/2],[ax+aw-notch,baseY+boxHeight],[ax,baseY+boxHeight],[ax+notch,baseY+boxHeight/2],[ax,baseY]];
  points.slice(1).forEach((point,i)=>line(...points[i],...point,.8));
  text(label,ax+34,baseY+boxHeight/2-11,30,heavy);
 };
 line(x+112,fromY,x+112,headerY);arrow(fromY+3,headerY-fromY-6,'DA');
 text('CD POSTE',x+206,fromY+39,39);
 line(x+290,middleY,x+290,fromY);
 text('LENTO',x+28,fromY-35,29,heavy);
 text('da trabalzare',x+28,fromY-71,27,heavy);
 text('DATA:',x+350,fromY-37,29,heavy);
 line(x+112,y,x+112,middleY);arrow(y+3,middleY-y-6,'A');
 text('HUB SDA ........',x+162,y+39,34);
}
await writeFile(new URL('../public/pdf/poste-prodotto-lento.pdf',import.meta.url),await poste.save());
