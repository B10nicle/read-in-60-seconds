'use strict';
const KEY='read60.board.v2';
const $=s=>document.querySelector(s);
let books=catalog.map(b=>({...b})), activeCategory='all';
const valid=b=>b&&typeof b.id==='string'&&typeof b.title==='string'&&typeof b.author==='string'&&typeof b.read==='boolean';
try{
 const raw=localStorage.getItem(KEY);
 if(raw){const saved=JSON.parse(raw);if(!Array.isArray(saved)||!saved.every(valid))throw Error();books=saved.map(b=>({...b,category:categories.some(c=>c[0]===b.category)?b.category:'other'}));}
 else{
  const old=JSON.parse(localStorage.getItem('code60.board.v1')||'[]');
  if(Array.isArray(old))for(const b of old.filter(valid)){const found=books.find(n=>n.title.toLowerCase()===b.title.toLowerCase());if(found)found.read=b.read;else books.push({...b,category:'other'});}
 }
}catch{$('#storage-note').textContent='Не удалось прочитать сохранение. Показан стартовый список.';}
function save(){try{localStorage.setItem(KEY,JSON.stringify(books));}catch{$('#storage-note').textContent='Сохранение недоступно. Изменения останутся только до закрытия страницы.';}}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function cover(book,index,photo=false){
 const button=el('button','cover'+(book.read?' read':''));button.type='button';button.style.setProperty('--tilt',`${[-2,1,0,-1,2][index%5]}deg`);button.style.setProperty('--color',['#173747','#6b392b','#b29258','#243941','#272e25'][index%5]);button.setAttribute('aria-label',`${book.read?'Вернуть в планы':'Отметить прочитанной'}: ${book.title}`);button.setAttribute('aria-pressed',String(book.read));button.title=`${book.title} — ${book.author}`;
 const fallback=el('span','fallback');fallback.append(el('small','', 'READ IN 60'),el('strong','',book.title),el('span','',book.author));button.append(fallback);
 if(book.isbn&&!photo){const img=el('img');img.src=`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-M.jpg?default=false`;img.alt='';img.loading='lazy';img.onerror=()=>img.remove();button.append(img);}
 button.append(el('span','cross'));button.onclick=()=>{const inPreview=button.closest('#preview-board')!==null;book.read=!book.read;save();render();const area=inPreview?$('#preview-board'):$('#full-board');const replacement=Array.from(area.querySelectorAll('button')).find(b=>b.dataset.id===book.id);(replacement||$('#filter')).focus({preventScroll:true});};button.dataset.id=book.id;return button;
}
// Four cover corners in the 1536 × 1024 photographic board.
// Polygon clipping keeps pointer targets inside each book, including its perspective.
const previewBooks=[
 ['9780134494166',[[613,178],[719,173],[719,316],[613,320]]],
 ['9780321125217',[[740,169],[844,164],[844,312],[740,316]]],
 ['9780201633610',[[611,335],[719,330],[719,478],[611,482]]],
 ['9781491950357',[[738,329],[846,325],[846,476],[738,480]]],
 ['9780134685991',[[879,161],[984,157],[984,307],[879,312]]],
 ['9780321349606',[[1009,153],[1116,147],[1116,303],[1009,308]]],
 ['9781617293566',[[882,325],[985,320],[985,472],[882,475]]],
 ['9781492056119',[[1011,320],[1121,315],[1121,471],[1011,474]]],
 ['9781449373320',[[1159,145],[1271,139],[1271,297],[1159,302]]],
 ['9781491929124',[[1304,136],[1421,130],[1421,291],[1304,297]]],
 ['9781985086593',[[1159,315],[1275,310],[1275,467],[1159,470]]],
 ['9780133594140',[[1308,311],[1425,305],[1425,465],[1308,469]]],
 ['9781492040347',[[595,532],[693,529],[693,665],[595,665]]],
 ['9783950307825',[[714,530],[820,528],[820,666],[714,668]]],
 ['9781491936160',[[595,679],[697,676],[697,801],[595,798]]],
 ['9781491983874',[[713,681],[820,679],[820,811],[713,806]]],
 ['9780131177055',[[864,528],[977,525],[977,672],[864,670]]],
 ['9780135957059',[[1002,526],[1118,524],[1118,673],[1002,673]]],
 ['9780321601919',[[863,680],[968,678],[968,816],[863,811]]],
 ['9781491935675',[[1007,682],[1118,681],[1118,824],[1007,820]]],
 ['9780134757599',[[1157,525],[1276,524],[1276,675],[1157,675]]],
 ['9780132350884',[[1310,524],[1432,522],[1432,677],[1310,677]]],
 ['9781942788003',[[1158,686],[1270,686],[1270,828],[1158,825]]],
 ['9781942788812',[[1313,689],[1434,690],[1434,838],[1313,832]]]
];
const iconPaths={architecture:'M12 2 22 7v10l-10 5L2 17V7Zm0 10L2 7m10 5L22 7M12 12v10',java:'M4 10h13v5a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6Zm13 1h2a3 3 0 0 1 0 6h-3M8 2c-3 3 3 3 0 6m5-7c-3 3 3 3 0 6M2 22h20',data:'M3 6c0-5 18-5 18 0s-18 5-18 0Zm0 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0',systems:'m9 3 1-2h4l1 2 3 2 3 1 1 4-2 2v3l1 3-3 3-3-1h-3l-3 1-3-3 1-3v-3l-2-2 1-4 3-1Zm7 9a4 4 0 1 0-8 0 4 4 0 0 0 8 0',devops:'M12 6v5m0 2-7 5m7-5 7 5M5 4l5 1m4 0 5-1M12 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm18 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',testing:'M8 2h8M10 2v7L3 21q-1 2 2 2h14q3 0 2-2L14 9V2M7 16h10m-6 3h1',people:'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-4 9h8l2 9H6ZM3 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm18 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4 13H2l-1 7h3m16-7h2l1 7h-3',other:'M2 2h8v8H2Zm12 0h8v8h-8ZM2 14h8v8H2Zm12 0h8v8h-8Z'};
function categoryIcon(id){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',iconPaths[id]);svg.append(path);return svg;}
function render(){
 const done=books.filter(b=>b.read).length;$('#total').textContent=books.length;$('#done').textContent=done;$('#left').textContent=books.length-done;$('#percent').textContent=`${books.length?Math.round(done/books.length*100):0}%`;
 $('#preview-board').replaceChildren();
 for(const [id,corners]of previewBooks){const b=books.find(b=>b.id===id);if(!b)continue;const x=Math.min(...corners.map(p=>p[0])),y=Math.min(...corners.map(p=>p[1]));const w=Math.max(...corners.map(p=>p[0]))-x,h=Math.max(...corners.map(p=>p[1]))-y;const button=cover(b,0,true);button.classList.add('photo-book');button.querySelectorAll('img,.fallback').forEach(n=>n.remove());button.style.left=`${(x-570)/880*100}%`;button.style.top=`${(y-100)/750*100}%`;button.style.width=`${w/880*100}%`;button.style.height=`${h/750*100}%`;button.style.clipPath=`polygon(${corners.map(([cx,cy])=>`${(cx-x)/w*100}% ${(cy-y)/h*100}%`).join(',')})`;$('#preview-board').append(button);}
 $('#categories').replaceChildren();
 for(const [id,name,,icon]of categories){const button=el('button','category'+(activeCategory===id?' active':''));button.setAttribute('aria-pressed',String(activeCategory===id));const text=el('span','',name);text.append(el('small','',`${books.filter(b=>b.category===id).length} книг`));button.append(categoryIcon(id),text);button.onclick=()=>{activeCategory=activeCategory===id?'all':id;render();$('#list').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};$('#categories').append(button);}
 const query=$('#search').value.trim().toLowerCase();const status=$('#filter').value;
 const visible=books.filter(b=>(activeCategory==='all'||b.category===activeCategory)&&(status==='all'||b.read===(status==='read'))&&`${b.title} ${b.author}`.toLowerCase().includes(query));
 $('#summary').textContent=`${visible.length} книг на доске`;$('#full-board').replaceChildren();$('#empty').hidden=visible.length>0;$('#full-board').hidden=visible.length===0;
 for(const [id,name,english]of categories){const selected=visible.filter(b=>b.category===id);if(!selected.length)continue;const section=el('section','full-group');section.append(el('h3','',`${english} / ${name}`));const grid=el('div','book-grid');selected.forEach((b,i)=>{const card=el('div','book-card');card.append(cover(b,i),el('p','book-label',b.title),el('p','book-author',b.author));if(!b.isbn){const remove=el('button','delete','Удалить');remove.onclick=()=>{if(confirm(`Удалить «${b.title}»?`)){books=books.filter(n=>n.id!==b.id);save();render();}};card.append(remove);}grid.append(card);});section.append(grid);$('#full-board').append(section);}
}
$('#search').addEventListener('input',render);$('#filter').addEventListener('change',render);$('#clear-category').onclick=()=>{activeCategory='all';render();};
for(const [id,name]of categories){const option=el('option','',name);option.value=id;$('#add-category').append(option);}
$('#open-add').onclick=()=>$('#add-dialog').showModal();$('#close-add').onclick=()=>$('#add-dialog').close();
$('#add-form').onsubmit=event=>{event.preventDefault();const form=event.currentTarget;const title=form.elements.title.value.trim(),author=form.elements.author.value.trim();if(!title||!author)return;books.push({id:crypto.randomUUID(),title,author,category:form.elements.category.value,read:false});save();form.reset();$('#add-dialog').close();activeCategory='all';$('#search').value='';$('#filter').value='all';render();$('#list').scrollIntoView();};
render();
