// Los datos externos se insertan como texto, nunca como HTML.
const $ = id => document.getElementById(id);
let page = 1, totalPages = 1, controller;
function field(parent, label, value) {
 const dt = document.createElement('dt'); dt.textContent = label;
 const dd = document.createElement('dd'); dd.textContent = value || 'No disponible';
 parent.append(dt, dd);
}
function card(title, image, fields, cover = false) {
 const article = document.createElement('article');
 if (image) { const img = document.createElement('img'); img.src = image; img.alt = title; img.loading = 'lazy';
 if(cover) img.className = 'cover';
 img.addEventListener('error', () => { img.hidden = true; }); article.append(img); }
 const body = document.createElement('div'); body.className = 'content';
 const h = document.createElement('h2'); h.textContent = title;
 const dl = document.createElement('dl'); fields.forEach(([k,v]) => field(dl,k,v));
 body.append(h,dl); article.append(body); $('grid').append(article);
}
function navigation() { $('prev').disabled = page <= 1; $('next').disabled = page >= totalPages;
 $('page').textContent = `Página ${page} de ${totalPages}`; }
$('search').addEventListener('submit', e => { e.preventDefault(); page=1; load(); });
$('reset').addEventListener('click', () => { $('search').reset(); page=1; load(); });
$('prev').addEventListener('click', () => { if(page>1) { page--; load(); } });
$('next').addEventListener('click', () => { if(page<totalPages) { page++; load(); } });
async function load() {
 controller?.abort(); controller = new AbortController();
 const active = controller;
 const timeout = setTimeout(() => active.abort(), 20000);
 $('status').textContent='Consultando la API…'; $('grid').replaceChildren();
 $('prev').disabled=true; $('next').disabled=true;
 try {
 const response = await fetch(buildURL(), {signal: active.signal});
 if(response.status===404) { totalPages=1; page=1; $('status').textContent='No se encontraron resultados. Cambiá la búsqueda o los filtros.'; navigation(); return; }
 if(!response.ok) throw new Error(`HTTP ${response.status}`);
 const data = await response.json();
 if(active!==controller) return;
 render(data); navigation();
 } catch(error) {
 if(active!==controller) return;
 $('status').textContent = `No se pudo consultar la API (${error.name==='AbortError'?'tiempo de espera agotado':error.message}). Revisá Internet y presioná Buscar para reintentar.`;
 $('page').textContent='Consulta pendiente';
 } finally { clearTimeout(timeout); }
}
function buildURL() {
 const url = new URL('https://openlibrary.org/search.json');
 const params = {q: $('query').value.trim() || 'fiction', page, limit:20, fields:'key,title,author_name,first_publish_year,cover_i,language,edition_count'};
 if($('language').value) params.language=$('language').value;
 if($('year').value) params.first_publish_year=$('year').value;
 Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v)); return url;
}
function render(data) {
 const count = data.numFound ?? data.num_found ?? 0;
 totalPages = Math.max(1,Math.ceil(count/20));
 data.docs.forEach(b => card(b.title,b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : '',[['Autor',(b.author_name||[]).join(', ')],['Primera publicación',String(b.first_publish_year||'No disponible')],['Idiomas de ediciones',(b.language||[]).join(', ')],['Ediciones',String(b.edition_count ?? 0)]],true));
 $('status').textContent = count ? `${count} libros encontrados · ${data.docs.length} en esta página` : 'Sin resultados. Cambiá la búsqueda o los filtros.';
}
load();
