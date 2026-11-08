"""Generate labelled layout cards only. These are NOT scene illustrations."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, math, random, shutil
root = Path(__file__).resolve().parents[1]
serif = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
bold = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
sans = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
shots = [
 ('Hotel lobby', 'HEEL INSERT / CONFIDENT CLOSE-UP', 'Polished marble, warm brass, quiet arrival.', ['#241e2c','#6c536c','#cbb69f']),
 ('The dressing room', 'MIRROR / THREE-QUARTER PORTRAIT', 'A composed reflection in soft morning light.', ['#262333','#5a526e','#c8bed8']),
 ('A seat at the table', 'MEETING ROOM / MEDIUM PORTRAIT', 'An elegant entrance. A steady gaze.', ['#1f2b2e','#536b6d','#c9bda4']),
 ('The considered detail', 'JEWELRY / HANDS INSERT', 'Pearls, a velvet tray, a deliberate choice.', ['#302229','#86606a','#dbc3b1']),
 ('Prepared for more', 'EXECUTIVE DESK / SLOW PUSH-IN', 'Plans and documents, seen with intention.', ['#282823','#6c6d5d','#d2c5ab']),
 ('A wider horizon', 'PENTHOUSE / SKYLINE REVEAL', 'Dusk beyond the windows. A moment of possibility.', ['#25283c','#6c6684','#c3b5ce']),
 ('Becoming her', 'FINAL PORTRAIT / CONFIDENT SMILE', 'A close-up held with quiet confidence.', ['#2b2135','#715577','#d7bfd5'])]
for i,(title,shot,note,palette) in enumerate(shots,1):
    # Abstract layout guides, visibly marked; no substitute character geometry.
    image = Image.new('RGB',(1080,1920),palette[0]); d=ImageDraw.Draw(image)
    for y in range(1920):
        t = y/1920
        a=tuple(int(palette[0][j:j+2],16) for j in (1,3,5))
        b=tuple(int(palette[1][j:j+2],16) for j in (1,3,5))
        d.line((0,y,1080,y),fill=tuple(round(a[k]*(1-t*.30)+b[k]*t*.30) for k in range(3)))
    d.rectangle((64,200,1016,1135), outline=palette[1], width=2)
    d.line((64,1105,1016,1105),fill=palette[1],width=2)
    d.text((98,245),'P R E T T Y   W I S E   T I P S',font=ImageFont.truetype(sans,23),fill=palette[2])
    d.text((91,350),f'{i:02}',font=ImageFont.truetype(serif,228),fill=palette[1])
    d.text((100,664),'ILLUSTRATION REQUIRED',font=ImageFont.truetype(sans,25),fill='#e6d9ef')
    # wrap shot title manually at words within 870 px
    font=ImageFont.truetype(serif,65); lines=[]; line=''
    for word in title.split():
        trial=(line+' '+word).strip()
        if d.textlength(trial,font=font)>860: lines.append(line);line=word
        else: line=trial
    lines.append(line)
    for j,line in enumerate(lines): d.text((96,730+j*83),line,font=font,fill='#f4ede3')
    d.text((100,958),shot,font=ImageFont.truetype(sans,22),fill=palette[2])
    note_font=ImageFont.truetype(sans,25)
    d.text((100,1025),note,font=note_font,fill=palette[2])
    d.text((98,1650),'DEVELOPMENT STORYBOARD',font=ImageFont.truetype(sans,23),fill=palette[2])
    d.text((98,1693),'Camera and caption timing review only.',font=ImageFont.truetype(sans,23),fill=palette[2])
    image.save(root/f'public/development/scene-{i:02}.png')
# Bundle locally used typefaces for deterministic offline renders.
for src,dest in [(bold,'pretty-serif-bold.ttf'),(serif,'pretty-serif.ttf'),(sans,'pretty-sans.ttf')]:
    shutil.copy2(src,root/'public/fonts'/dest)
