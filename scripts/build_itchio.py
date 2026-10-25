from pathlib import Path
import zipfile, hashlib, re, json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'Chess - Website'/'(public)'
OUT=ROOT/'output'/'itchio'
OUT.mkdir(parents=True,exist_ok=True)
files=sorted(p for p in SOURCE.rglob('*') if p.is_file() and not any(x.startswith('.') for x in p.relative_to(SOURCE).parts))
names={p.relative_to(SOURCE).as_posix() for p in files}
assert 'index.html' in names
errors=[]
for p in files:
    if p.suffix in {'.html','.css'}:
        text=p.read_text(encoding='utf-8')
        refs=re.findall(r'''(?:src|href)=["']([^"']+)["']|url\(["']?([^\)"']+)''',text)
        for pair in refs:
            ref=next(x for x in pair if x)
            if re.match(r'^(https?:|data:|#)',ref): continue
            from urllib.parse import unquote
            target=(p.parent/unquote(ref.split('?')[0])).resolve()
            if not target.is_file() or target.relative_to(SOURCE.resolve()).as_posix() not in names: errors.append(ref)
assert not errors, errors
assert len(files)<=1000
assert max(p.stat().st_size for p in files)<=200*1024**2
assert sum(p.stat().st_size for p in files)<=500*1024**2
archive=OUT/'chess-paradox-html5.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files: z.write(p,p.relative_to(SOURCE).as_posix())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert 'index.html' in z.namelist()
    assert all(len(n)<=240 for n in z.namelist())
manifest={'archive':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(files),'compressed_bytes':archive.stat().st_size,'uncompressed_bytes':sum(p.stat().st_size for p in files),'entry_point':'index.html','external_dependencies':['Firebase JavaScript SDK (gstatic.com)','Firebase Authentication, Realtime Database and Storage for chess-x'],'local_asset_references':'passed; exact case verified'}
(OUT/'build-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps(manifest,indent=2))
