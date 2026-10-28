from pathlib import Path
import pymupdf as fitz
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
files=sorted((root/'public/pdf').glob('*.pdf'))
assert len(files)==21, len(files)
thumbs=[]
for file in files:
    pdf=fitz.open(file)
    assert len(pdf)==1, file.name
    page=pdf[0]
    assert abs(page.rect.width-595.2756)<.1 and abs(page.rect.height-841.8898)<.1
    expected=file.stem.replace('-',' ').upper()
    spans=[s for b in page.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans']]
    top=sorted([s for s in spans if s['origin'][1]<page.rect.height/2],key=lambda s:s['origin'][1])
    bottom=sorted([s for s in spans if s['origin'][1]>page.rect.height/2],key=lambda s:s['origin'][1])
    assert ' '.join(s['text'] for s in top)==expected, (file.name,top)
    assert ' '.join(s['text'] for s in bottom)==expected, (file.name,bottom)
    assert [s['text'] for s in top]==expected.split(), (file.name,'Una parola per riga richiesta')
    assert [s['text'] for s in bottom]==expected.split(), (file.name,'Una parola per riga richiesta')
    for s in spans:
        assert 'Helvetica-Bold' in s['font'], (file.name,s['font'])
        assert s['size']>=65, (file.name,s['size'])
    ink=page.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
    ink_image=Image.frombytes('RGB',[ink.width,ink.height],ink.samples).convert('L')
    mask=ink_image.point(lambda v: 255 if v<100 else 0)
    for half_y in [0,ink.height//2]:
        region=mask.crop((0,half_y,ink.width,half_y+ink.height//2))
        box=region.getbbox()
        assert box and box[0]>=25 and box[2]<=ink.width-25 and box[1]>=20 and box[3]<=ink.height//2-20, (file.name,box)
    pix=page.get_pixmap(matrix=fitz.Matrix(.42,.42),alpha=False)
    image=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
    tile=Image.new('RGB',(280,395),'#e7ebf0')
    tile.paste(image,((280-image.width)//2,10))
    ImageDraw.Draw(tile).text((12,375),expected,fill='#182e43')
    thumbs.append(tile)
contact=Image.new('RGB',(280*5,395*((len(files)+4)//5)),'white')
for index,tile in enumerate(thumbs): contact.paste(tile,((index%5)*280,(index//5)*395))
(root/'test-results').mkdir(exist_ok=True)
contact.save(root/'test-results/pdf-contact-sheet.png')
print('PASS: 21 PDF A4, due copie, una parola per riga, Helvetica Bold largo, margini verificati.')
