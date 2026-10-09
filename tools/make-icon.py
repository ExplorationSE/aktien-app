# Erzeugt site/icon.svg (Text als Pfade, keine Schriftabhängigkeit)
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import sys
FONT = '/usr/share/fonts/truetype/sand-box/google/Marcellus/Marcellus-Regular.ttf'
f = TTFont(FONT); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
def text_path(txt, size, cx, baseline, track=0):
    s = size / upm; names = [cmap[ord(c)] for c in txt]
    w = sum(gs[n].width for n in names) * s + track * (len(txt) - 1)
    x = cx - w / 2; pen = SVGPathPen(gs)
    for n in names:
        gs[n].draw(TransformPen(pen, (s, 0, 0, -s, x, baseline))); x += gs[n].width * s + track
    return pen.getCommands(), w
TXT, w = text_path('ExSE', 128, 256, 226, track=6)
pts = [(118,366),(134,358),(148,363),(162,346),(176,352),(190,341),(204,348),(218,326),(232,333),(246,320),(258,338),(272,312),(286,318),(300,296),(314,305),(328,290),(342,297),(356,278),(370,284),(384,266),(394,262)]
def smooth(p):
    d = f'M{p[0][0]},{p[0][1]}'
    for i in range(1, len(p)):
        x0,y0 = p[i-1]; x1,y1 = p[i]; mx = (x0+x1)/2
        d += f' C{mx},{y0} {mx},{y1} {x1},{y1}'
    return d
line = 'M' + ' L'.join(f'{x},{y}' for x, y in pts)
area = line + f' L{pts[-1][0]},392 L{pts[0][0]},392 Z'
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <radialGradient id="glow" cx="50%" cy="58%" r="55%"><stop offset="0" stop-color="#001a2c" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="ln" x1="118" y1="0" x2="394" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#003153"/><stop offset=".55" stop-color="#14527c"/><stop offset="1" stop-color="#2a6f9f"/></linearGradient>
  <linearGradient id="ar" x1="0" y1="262" x2="0" y2="392" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1f5f8b" stop-opacity=".38"/><stop offset="1" stop-color="#003153" stop-opacity="0"/></linearGradient>
  <linearGradient id="tx" x1="0" y1="130" x2="0" y2="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d3dc"/></linearGradient>
  <linearGradient id="rule" x1="150" y1="0" x2="362" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1f5f8b" stop-opacity="0"/><stop offset=".5" stop-color="#2a6f9f"/><stop offset="1" stop-color="#1f5f8b" stop-opacity="0"/></linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<rect width="512" height="512" fill="#000"/>
<rect width="512" height="512" fill="url(#glow)"/>
<g stroke="#0a1620" stroke-width="1">{''.join(f'<line x1="118" x2="394" y1="{y}" y2="{y}"/>' for y in (276,316,356))}</g>
<path d="{TXT}" fill="url(#tx)"/>
<rect x="150" y="248" width="212" height="1.6" fill="url(#rule)"/>
<path d="{area}" fill="url(#ar)"/>
<path d="{line}" fill="none" stroke="#1f5f8b" stroke-width="10" stroke-linecap="round" opacity=".35" filter="url(#soft)"/>
<path d="{line}" fill="none" stroke="url(#ln)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="13" fill="#2a6f9f" opacity=".35" filter="url(#soft)"/>
<circle cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="6" fill="#3a82b5"/>
<circle cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="2.4" fill="#e8f1f8"/>
</svg>'''
open(sys.argv[1] if len(sys.argv) > 1 else '../site/icon.svg', 'w').write(svg)
print('text width', round(w))
