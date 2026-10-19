# Portal Rick & Morty

## Ejecutar en Windows, Linux o macOS
1. Instalar Node.js 22 o superior (incluye npm).
2. Abrir una terminal en esta carpeta.
3. Ejecutar `npm install` (requiere Internet).
4. Ejecutar `npm start`.
5. Validar sintaxis con `npm run check`.

La ventana carga src/index.html con loadFile; no se necesita servidor local, Live Server ni localhost. npm start es el modo de ejecución entregado; no se incluye instalador ni node_modules. Si npm encuentra que la versión fijada de Electron no existe en tu registro, consultá la versión estable oficial antes de cambiarla.

## Estructura y seguridad
main.js: ciclo de vida y ventana. src/index.html: controles y resultados. src/css/styles.css: diseño adaptable. src/js/app.js: fetch, búsqueda, filtros, paginación y errores. assets: iconos originales PNG e ICO.
Node está deshabilitado en el renderer, contextIsolation y sandbox están activos. Se bloquean navegación, ventanas nuevas y permisos. La CSP limita scripts a archivos locales y red a la API. Se usa textContent para datos externos. No hace falta preload porque no se usan funciones privilegiadas desde la interfaz.

## API y datos
https://rickandmortyapi.com/api/character — Documentación: https://rickandmortyapi.com/documentation. Campos: image, name, status, species, gender, origin.name. Búsqueda por nombre y filtros status/gender en el servidor. Paginación de la API. No requiere clave. Implementación nueva: no se recibió el código original de clase, por lo que no se puede certificar su integración ni conservar exactamente su navegación.

## Pruebas manuales
- Abrir con npm start; comprobar ventana, título e icono.
- Buscar Rick y revisar las tarjetas.
- Aplicar cada filtro por separado y ambos combinados; presionar Buscar.
- Avanzar y retroceder páginas; comprobar bloqueo de extremos.
- Buscar un texto inexistente; comprobar mensaje sin resultados.
- Desconectar Internet, pulsar Buscar y revisar error; reconectar y reintentar.
- Limpiar y reducir el tamaño de la ventana.

## Repositorio
Crear un repositorio para esta carpeta. Desde aquí: git init, git add ., git commit -m "Aplicación Electron". Agregar el remoto real y publicar con git push. No subir node_modules. Pegar la URL real en ../datos_entrega.json y regenerar el PDF.
