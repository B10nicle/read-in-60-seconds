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
function cover(book,index){
 const button=el('button','cover'+(book.read?' read':''));button.type='button';button.style.setProperty('--tilt',`${[-2,1,0,-1,2][index%5]}deg`);button.style.setProperty('--color',['#173747','#6b392b','#b29258','#243941','#272e25'][index%5]);button.setAttribute('aria-label',`${book.read?'Вернуть в планы':'Отметить прочитанной'}: ${book.title}`);button.setAttribute('aria-pressed',String(book.read));button.title=`${book.title} — ${book.author}`;
 const fallback=el('span','fallback');fallback.append(el('small','', 'READ IN 60'),el('strong','',book.title),el('span','',book.author));button.append(fallback);
 if(book.isbn){const img=el('img');img.src=`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-M.jpg?default=false`;img.alt='';img.loading='lazy';img.onerror=()=>img.remove();button.append(img);}
 button.append(el('span','cross'));button.onclick=()=>{const inPreview=button.closest('#preview-board')!==null;book.read=!book.read;save();render();const area=inPreview?$('#preview-board'):$('#full-board');const replacement=Array.from(area.querySelectorAll('button')).find(b=>b.dataset.id===book.id);(replacement||$('#filter')).focus({preventScroll:true});};button.dataset.id=book.id;return button;
}
const previewGroups=[['ARCHITECTURE','architecture'],['JAVA','java'],['SYSTEMS','systems'],['DATA','data'],['TESTING','testing'],['OTHER','other']];
function render(){
 const done=books.filter(b=>b.read).length;$('#total').textContent=books.length;$('#done').textContent=done;$('#left').textContent=books.length-done;$('#percent').textContent=`${books.length?Math.round(done/books.length*100):0}%`;
 $('#preview-board').replaceChildren();
 for(const [name,key]of previewGroups){const group=el('div','board-group');group.append(el('h3','',name));const grid=el('div','mini-grid');books.filter(b=>b.category===key).slice(0,4).forEach((b,i)=>grid.append(cover(b,i)));group.append(grid);$('#preview-board').append(group);}
 $('#categories').replaceChildren();
 for(const [id,name,,icon]of categories){const button=el('button','category'+(activeCategory===id?' active':''));button.setAttribute('aria-pressed',String(activeCategory===id));const text=el('span','',name);text.append(el('small','',`${books.filter(b=>b.category===id).length} книг`));button.append(el('i','',icon),text);button.onclick=()=>{activeCategory=activeCategory===id?'all':id;render();$('#list').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};$('#categories').append(button);}
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
