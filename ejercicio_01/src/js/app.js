// Los datos externos se insertan como texto, nunca como HTML.
const $ = id => document.getElementById(id);
let page = 1, totalPages = 1, controller;
const translations = {
 status: { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' },
 species: {
  Human: 'Humano', Alien: 'Extraterrestre', Humanoid: 'Humanoide',
  Poopybutthole: 'Poopybutthole', 'Mythological Creature': 'Criatura mitológica',
  Animal: 'Animal', Robot: 'Robot', Cronenberg: 'Cronenberg',
  Disease: 'Enfermedad', unknown: 'Desconocida'
 },
 gender: { Female: 'Femenino', Male: 'Masculino', Genderless: 'Sin género', unknown: 'Desconocido' }
};
function translate(value, category) {
 return translations[category]?.[value] || value || 'No disponible';
}
const origins = {
 unknown: 'Desconocido', 'Post-Apocalyptic Earth': 'Tierra posapocalíptica',
 'Citadel of Ricks': 'Ciudadela de los Ricks', 'Bird World': 'Mundo de los pájaros',
 'Anatomy Park': 'Parque Anatómico', 'Interdimensional Cable': 'Cable interdimensional',
 'Immortality Field Resort': 'Complejo del campo de inmortalidad',
 'Signus 5 Expanse': 'Extensión de Signus 5', 'Nuptia 4': 'Nuptia 4',
 "Worldender's lair": 'Guarida del Destructor de Mundos',
 'Alien Spa': 'Spa extraterrestre', 'Earth (Replacement Dimension)': 'Tierra (dimensión de reemplazo)',
 'Abadango': 'Abadango', 'Testicle Monster Dimension': 'Dimensión de los monstruos testículo',
 'The Menagerie': 'La colección de criaturas', 'Galactic Federation Prison': 'Prisión de la Federación Galáctica',
 'Gromflom Prime': 'Gromflom Prime', 'Unity’s Planet': 'Planeta de Unity',
 "Unity's Planet": 'Planeta de Unity', 'Mr. Goldenfold\'s dream': 'Sueño del Sr. Goldenfold',
 'Purge Planet': 'Planeta de la Purga', 'Venzenulon 7': 'Venzenulon 7',
 'Bepis 9': 'Bepis 9', 'Resort Planet': 'Planeta vacacional',
 'Fantasy World': 'Mundo de fantasía', 'Dwarf Terrace-9': 'Terraza Enana-9',
 'Giant\'s Town': 'Pueblo de los gigantes', 'Pluto': 'Plutón',
 'Zeep Xanflorp\'s Miniverse': 'Miniverso de Zeep Xanflorp',
 'Kyle\'s Teenyverse': 'Microverso de Kyle', 'Larva Alien\'s Planet': 'Planeta de las larvas extraterrestres',
 'Rick\'s Battery Microverse': 'Microverso de la batería de Rick',
 'The Ocean': 'El océano', 'Snake Planet': 'Planeta de las serpientes',
 'Space': 'Espacio', 'Heist-Con': 'Convención de atracos',
 'Mount Space Everest': 'Monte Everest espacial', 'Midland Quasar': 'Cuásar de Midland',
 'Glorzo Asteroid': 'Asteroide de Glorzo', 'Alien Acid Plant': 'Planta de ácido extraterrestre',
 'Merged Universe': 'Universo fusionado', 'Near-Duplicate Reality': 'Realidad casi idéntica'
};
function translateOrigin(value) {
 if (!value) return 'No disponible';
 if (origins[value]) return origins[value];
 // Conserva los nombres propios y los identificadores de cada dimensión.
 return value.replace(/^Earth(?=\s|$)/, 'Tierra')
  .replace(/Replacement Dimension/g, 'dimensión de reemplazo')
  .replace(/Unknown dimension/gi, 'dimensión desconocida')
  .replace(/Fascist Dimension/g, 'dimensión fascista')
  .replace(/Fascist Shrimp Dimension/g, 'dimensión de camarones fascistas')
  .replace(/Fascist Teddy Bear Dimension/g, 'dimensión de osos de peluche fascistas')
  .replace(/Wasp Dimension/g, 'dimensión de avispas')
  .replace(/Phone Dimension/g, 'dimensión de teléfonos')
  .replace(/Pizza Dimension/g, 'dimensión de pizzas')
  .replace(/Chair Dimension/g, 'dimensión de sillas');
}
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
 $('status').textContent='Cargando personajes…'; $('grid').replaceChildren();
 $('prev').disabled=true; $('next').disabled=true;
 try {
 let response;
 // Reintenta una vez si la conexión o el servidor fallan temporalmente.
 for (let attempt = 0; attempt < 2; attempt++) {
  try {
   response = await fetch(buildURL(), {signal: active.signal});
   if (response.status >= 500 && attempt === 0) continue;
   break;
  } catch (error) {
   if (active.signal.aborted || attempt === 1) throw error;
   $('status').textContent = 'Reintentando la conexión con el servidor…';
  }
 }
 if(active!==controller) return;
 if(response.status===404) { totalPages=1; page=1; $('status').textContent='No se encontraron resultados. Cambia la búsqueda o los filtros.'; navigation(); return; }
 if(!response.ok) {
  const error = new Error('Respuesta del servidor');
  error.httpStatus = response.status;
  throw error;
 }
 let data;
 try { data = await response.json(); }
 catch { throw new Error('INVALID_DATA'); }
 if (!data?.info || !Array.isArray(data.results)) throw new Error('INVALID_DATA');
 if(active!==controller) return;
 render(data); navigation();
 } catch(error) {
 if(active!==controller) return;
 console.error('Error al cargar los personajes:', error);
 $('status').textContent = error.name === 'AbortError'
  ? 'La consulta tardó demasiado. Revisa tu conexión a internet y presiona Buscar para intentarlo de nuevo.'
  : error.httpStatus === 429
   ? 'El servidor recibió demasiadas consultas. Espera un momento y presiona Buscar.'
   : error.httpStatus
    ? `El servidor de personajes respondió con un error (${error.httpStatus}). Presiona Buscar para reintentar.`
    : error.message === 'INVALID_DATA'
     ? 'El servidor devolvió datos que no se pueden leer. Presiona Buscar para reintentar.'
     : error instanceof TypeError
      ? 'No se pudo conectar con el servidor de personajes después de dos intentos. Revisa tu conexión a internet y presiona Buscar.'
      : 'Ocurrió un error al mostrar los personajes. Consulta el detalle en la consola de la aplicación.';
 $('page').textContent='Consulta pendiente';
 } finally { clearTimeout(timeout); }
}
function buildURL() {
 const url = new URL('https://rickandmortyapi.com/api/character');
 for(const [key,value] of Object.entries({page, name:$('query').value.trim(),status:$('statusFilter').value,gender:$('gender').value})) if(value) url.searchParams.set(key,value);
 return url;
}
function render(data) {
 totalPages = Math.max(1,data.info.pages);
 data.results.forEach(c => card(c.name,c.image,[['Estado',translate(c.status,'status')],['Especie',translate(c.species,'species')],['Género',translate(c.gender,'gender')],['Origen',translateOrigin(c.origin?.name)]]));
 $('status').textContent = `${data.info.count} personajes encontrados · ${data.results.length} en esta página`;
}
load();
