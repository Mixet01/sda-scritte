from pathlib import Path
import json
import re
import pymupdf

root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'data/foglio-banche.json').read_text(encoding='utf-8'))
assert [len(sheet) for sheet in rows]==[24,24,23,29]
pdf=pymupdf.open(root/'public/pdf/foglio-banche.pdf')
assert len(pdf)==4
xs=[24,169,274,429,500,571]
normalize=lambda text: re.sub(r'\s+',' ',text).strip()
for page_index,(page,sheet) in enumerate(zip(pdf,rows)):
    assert abs(page.rect.width-595.2756)<.01 and abs(page.rect.height-841.8898)<.01
    for r,row in enumerate(sheet):
        y0=page.rect.height-(780-26-r*24)
        for c,expected in enumerate(row+['','']):
            found=page.get_textbox(pymupdf.Rect(xs[c]+1,y0+1,xs[c+1]-1,y0+23))
            assert normalize(found)==normalize(expected),(page_index+1,r+1,c+1,found,expected)
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            for span in line['spans']:
                x0,y0,x1,y1=span['bbox']
                assert x0>=23 and x1<=572 and y0>=20 and y1<=825,(page_index,span)
poste=pymupdf.open(root/'public/pdf/poste-prodotto-lento.pdf')
assert len(poste)==1
text=poste[0].get_text()
for required in ['Posteitaliane','Modulo: KANBAN AVVIAMENTO PACCHI','CD POSTE','LENTO','da trabalzare','DATA:','HUB SDA ........']:
    assert text.count(required)==2,(required,text.count(required))
print('PASS: 4 pagine banche, 100 righe e 500 celle corrispondenti ai dati; modulo Poste in due copie.')
