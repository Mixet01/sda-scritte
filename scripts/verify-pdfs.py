from pathlib import Path
import pymupdf as fitz
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
files=sorted((root/'public/pdf').glob('*.pdf'))
assert len(files)==18, len(files)
thumbs=[]
for file in files:
    pdf=fitz.open(file)
    assert len(pdf)==1, file.name
    page=pdf[0]
    assert abs(page.rect.width-595.2756)<.1 and abs(page.rect.height-841.8898)<.1
    expected=file.stem.replace('-',' ').upper()
    spans=[s for b in page.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans']]
    top=[s for s in spans if s['bbox'][1]<page.rect.height/2]
    bottom=[s for s in spans if s['bbox'][1]>page.rect.height/2]
    assert ' '.join(s['text'] for s in top)==expected, (file.name,top)
    assert ' '.join(s['text'] for s in bottom)==expected, (file.name,bottom)
    for s in spans:
        assert 'Bold' in s['font'], (file.name,s['font'])
        x0,y0,x1,y1=s['bbox']
        assert x0>=25 and y0>=20 and x1<=page.rect.width-25 and y1<=page.rect.height-20, (file.name,s['bbox'])
        assert s['size']>=45, (file.name,s['size'])
    pix=page.get_pixmap(matrix=fitz.Matrix(.42,.42),alpha=False)
    image=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
    tile=Image.new('RGB',(280,395),'#e7ebf0')
    tile.paste(image,((280-image.width)//2,10))
    ImageDraw.Draw(tile).text((12,375),expected,fill='#182e43')
    thumbs.append(tile)
contact=Image.new('RGB',(280*6,395*3),'white')
for index,tile in enumerate(thumbs): contact.paste(tile,((index%6)*280,(index//6)*395))
(root/'test-results').mkdir(exist_ok=True)
contact.save(root/'test-results/pdf-contact-sheet.png')
print('PASS: 18 PDF, A4, una pagina, testo esatto due volte, tutto grassetto, nessuna scritta tagliata.')
