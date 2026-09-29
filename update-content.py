"""Convert the catalog to content.js using Python 3 standard library only."""
import json, re, sys, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'Katalog_Mikro_Berintegritas.xlsx'
ns = {'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(source) as z:
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', ns)]
    book = ET.fromstring(z.read('xl/workbook.xml'))
    sheet = next(s for s in book.find('m:sheets', ns) if s.attrib['name'] == 'Katalog Konten')
    rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    target = next(r.attrib['Target'] for r in rels if r.attrib['Id'] == rid)
    path = target.lstrip('/') if target.startswith('/') else 'xl/' + target
    rows = []
    for row in ET.fromstring(z.read(path)).findall('.//m:sheetData/m:row',ns):
        values = {}
        for c in row.findall('m:c',ns):
            col = re.match('[A-Z]+', c.attrib['r'])[0]
            v = c.find('m:v',ns)
            value = v.text if v is not None else ''
            if c.attrib.get('t') == 's': value = strings[int(value)]
            if c.attrib.get('t') == 'inlineStr': value = ''.join(c.find('m:is',ns).itertext())
            values[col] = value or ''
        rows.append(values)
items = []
for r in rows:
    if not r.get('B','').startswith('MB-') or not r.get('D'): continue
    kind = r.get('C','').strip().lower()
    if kind not in ('gambar','video'):
        print('Jenis media kosong/tidak dikenal; sementara sebagai gambar:',r['B'])
    number = float(r.get('A') or re.search(r'\d+$',r['B'])[0])
    items.append(dict(id=r['B'],order=number,type='video' if kind=='video' else 'image',title=r['D'],caption=r.get('E',''),tags=r.get('F','').split(),orientation=r.get('G',''),source=r.get('H',''),featured=r.get('I','').lower()=='ya'))
ids = [i['id'] for i in items]
if len(ids) != len(set(ids)): raise ValueError('ID Konten duplikat. Perbaiki sebelum melanjutkan.')
(root/'content.js').write_text('window.CAMPAIGN = '+json.dumps({'items':items},ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(f'Selesai: {len(items)} materi ditulis ke content.js')
