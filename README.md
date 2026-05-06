# PDF PROFORM - App instalable en iPhone

Esta carpeta ya esta preparada como una PWA: una app web instalable desde Safari en iOS. No requiere Xcode, Mac, cuenta de Apple Developer ni publicacion en App Store.

## Archivos incluidos

- `index.html`: la app completa.
- `manifest.json`: nombre, iconos y configuracion de instalacion.
- `sw.js`: cache offline para la app y sus librerias.
- `icons/`: iconos para iPhone, iPad y navegadores.

## Opcion recomendada: publicar gratis en GitHub Pages

1. Entra a [GitHub](https://github.com) e inicia sesion.
2. Crea un repositorio nuevo llamado `pdfproform`.
3. Sube todos los archivos de esta carpeta:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons/`
4. Ve a `Settings` -> `Pages`.
5. En `Branch`, elige `main` y carpeta `/ (root)`.
6. Guarda y espera aproximadamente un minuto.
7. GitHub mostrara una URL parecida a:

```text
https://TU-USUARIO.github.io/pdfproform/
```

## Instalar en iPhone

1. Abre la URL en Safari desde el iPhone.
2. Toca el boton de compartir.
3. Elige `Agregar a pantalla de inicio`.
4. Confirma con `Agregar`.

La app quedara instalada con icono propio, abrira en pantalla completa y podra funcionar offline despues de abrirla una primera vez con internet.

## Actualizar la app

Cuando cambies archivos, subelos de nuevo al hosting. El service worker actualiza el cache automaticamente la proxima vez que la app se abra con internet.

## Nota sobre App Store

Para generar un `.ipa` instalable fuera de Safari o publicar en App Store se necesita un proyecto iOS firmado con Xcode y una cuenta Apple Developer. Con esta carpeta, la forma directa y gratuita es instalarla como PWA.
