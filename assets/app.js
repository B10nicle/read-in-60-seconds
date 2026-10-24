'use strict';
const KEY = 'code60.board.v1';
const seed = [
  ['The Pragmatic Programmer', 'David Thomas, Andrew Hunt'],
  ['Clean Code', 'Robert C. Martin'],
  ['Designing Data-Intensive Applications', 'Martin Kleppmann'],
  ['Refactoring', 'Martin Fowler'],
  ['Working Effectively with Legacy Code', 'Michael Feathers'],
  ['The Mythical Man-Month', 'Frederick P. Brooks Jr.'],
].map(([title, author], i) => ({id: `seed-${i}`, title, author, read: false}));
const list = document.querySelector('#books');
const search = document.querySelector('#search');
const filter = document.querySelector('#filter');
const note = document.querySelector('#storage-note');
let books = seed;
try {
  const raw = localStorage.getItem(KEY);
  if (raw !== null) {
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || !saved.every(b => b && typeof b.id === 'string' && typeof b.title === 'string' && typeof b.author === 'string' && typeof b.read === 'boolean') || new Set(saved.map(b => b.id)).size !== saved.length) throw new Error('Invalid board');
    books = saved;
  }
} catch {
  note.textContent = 'Не удалось загрузить сохранённую доску. Показан стартовый список.';
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(books)); }
  catch { note.textContent = 'Браузер не разрешает сохранение. Изменения доступны только до закрытия страницы.'; }
}
function render() {
  list.replaceChildren();
  const query = search.value.toLocaleLowerCase().trim();
  const visible = books.filter(b => `${b.title} ${b.author}`.toLocaleLowerCase().includes(query) && (filter.value === 'all' || b.read === (filter.value === 'read')));
  for (const book of visible) {
    const row = document.createElement('li');
    row.className = `book${book.read ? ' read' : ''}`;
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.textContent = book.read ? '✓' : '';
    toggle.setAttribute('aria-label', `Прочитано: ${book.title}`);
    toggle.setAttribute('aria-pressed', String(book.read));
    toggle.onclick = () => {
      book.read = !book.read; save(); render();
      const index = books.filter(b => `${b.title} ${b.author}`.toLocaleLowerCase().includes(query) && (filter.value === 'all' || b.read === (filter.value === 'read'))).findIndex(b => b.id === book.id);
      if (index >= 0) list.children[index].querySelector('button').focus(); else filter.focus();
    };
    const copy = document.createElement('div'); copy.className = 'book-copy';
    const title = document.createElement('span'); title.className = 'book-title'; title.textContent = book.title;
    const author = document.createElement('span'); author.className = 'author'; author.textContent = book.author;
    copy.append(title, author);
    const remove = document.createElement('button'); remove.className = 'remove'; remove.textContent = '×'; remove.setAttribute('aria-label', `Удалить: ${book.title}`);
    remove.onclick = () => { if (confirm(`Удалить «${book.title}» с доски?`)) { books = books.filter(b => b.id !== book.id); save(); render(); search.focus(); } };
    row.append(toggle, copy, remove); list.append(row);
  }
  const read = books.filter(b => b.read).length;
  document.querySelector('#counter').textContent = `${read} / ${books.length} прочитано`;
  const progress = document.querySelector('#progress'); progress.max = books.length || 1; progress.value = read;
  document.querySelector('#empty').hidden = visible.length > 0;
}
search.addEventListener('input', render); filter.addEventListener('change', render);
document.querySelector('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.elements.title.value.trim(); const author = form.elements.author.value.trim();
  if (!title || !author) { (!title ? form.elements.title : form.elements.author).focus(); return; }
  books.push({id: crypto.randomUUID(), title, author, read: false});
  save(); form.reset(); search.value = ''; filter.value = 'all'; render(); form.elements.title.focus();
});
render();
