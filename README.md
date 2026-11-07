# Gestor del Hogar — app instalable

Esta carpeta es la **pantalla** de la app. Los datos siguen en la planilla de Google y el **motor** es Apps Script.
En este repositorio no hay datos, solo la pantalla. Sin una sesión válida, el motor no responde nada.

Hacé los pasos en este orden. Los pasos 1 a 3 conviene hacerlos desde la PC.

---

## Paso 1 — GitHub: crear la cuenta y publicar la app

1. Entrá a **github.com** y creá una cuenta con tu Gmail personal. El nombre de usuario que elijas va a formar parte de la dirección. Por ejemplo, con `andresguzman` la app queda en `https://andresguzman.github.io/hogar/`.
2. Arriba a la derecha tocá **+ > New repository**:
   - Repository name: `hogar`
   - **Public**. GitHub Pages es gratis solo para repositorios públicos, y acá no hay datos.
   - Tocá **Create repository**.
3. En el repositorio nuevo, tocá **uploading an existing file** (o **Add file > Upload files**) y arrastrá **todo el contenido** de esta carpeta: `index.html`, `config.js`, `manifest.webmanifest`, `sw.js`, `README.md` y la carpeta `icons`. Tocá **Commit changes**.
4. Andá a **Settings > Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main**, carpeta **/ (root)**, y tocá **Save**.
   - En 1 o 2 minutos aparece arriba: *"Your site is live at https://USUARIO.github.io/hogar/"*. Anotá esa dirección.

## Paso 2 — Google Cloud: crear el "ID de cliente" (para el botón "Iniciar sesión con Google")

1. Entrá a **console.cloud.google.com** con tu Gmail personal. Si te lo pide, aceptá los términos.
2. Arriba, en el selector de proyectos, tocá **Proyecto nuevo**, ponele de nombre `Gestor Hogar` y tocá **Crear**. Asegurate de que quede seleccionado.
3. Menú (☰) > **APIs y servicios > Pantalla de consentimiento de OAuth**. En algunas cuentas figura como **Google Auth Platform**. Tocá **Comenzar**:
   - Nombre de la app: `Gestor del Hogar`. Correo de asistencia: tu Gmail.
   - Público: **Externo**.
   - Información de contacto: tu Gmail. Aceptá y tocá **Crear**.
4. En **Público** (Audience) tocá **Publicar app** y confirmá. La app solo usa el nombre y el mail, así que Google no pide verificación.
   *(Otra opción: dejarla "En prueba" y agregar en "Usuarios de prueba" los Gmail de la familia.)*
5. En **Clientes** tocá **+ Crear cliente**:
   - Tipo de aplicación: **Aplicación web**
   - Nombre: `App hogar`
   - **Orígenes autorizados de JavaScript**: tocá **Agregar URI** y escribí `https://USUARIO.github.io`.
     ⚠️ Sin `/hogar` y sin barra al final.
   - "URI de redireccionamiento autorizados": dejalo vacío.
   - Tocá **Crear** y **copiá el ID de cliente** (termina en `.apps.googleusercontent.com`).

## Paso 3 — Apps Script: actualizar el motor

1. Abrí la planilla, andá a **Extensiones > Apps Script** y reemplazá todo el contenido de **Código.gs** por el archivo nuevo.
2. En las primeras líneas, pegá el ID de cliente:
   ```js
   const GOOGLE_CLIENT_ID = 'xxxxxxxx.apps.googleusercontent.com';
   ```
   Guardá con **Ctrl + S**. El archivo `Index` ya no se usa: lo podés borrar o dejar.
3. Elegí la función **configurar** y tocá **Ejecutar**. Si pide permisos nuevos, aceptalos.
4. Andá a **Implementar > Administrar implementaciones**, tocá el **lápiz** y cambiá:
   - **Ejecutar como: Yo** (tu mail)
   - **Quién tiene acceso: Cualquier persona**. Tiene que ser esta opción, no "Cualquier persona con una cuenta de Google".
   - Versión: **Nueva versión** y tocá **Implementar**.
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

## Paso 4 — Conectar la pantalla con el motor

1. En GitHub, abrí el archivo **config.js** y tocá el **lápiz** (Edit).
2. Completá los dos valores:
   ```js
   API_URL: 'https://script.google.com/macros/s/XXXXXXXX/exec',
   GOOGLE_CLIENT_ID: 'xxxxxxxx.apps.googleusercontent.com'
   ```
3. Tocá **Commit changes**. En uno o dos minutos queda publicado.

## Paso 5 — Instalar en los celulares (Android)

1. En Chrome, abrí `https://USUARIO.github.io/hogar/`.
2. Tocá **Iniciar sesión con Google** y elegí tu cuenta.
3. Chrome muestra **"Instalar app"**. Si no aparece, usá el menú **⋮ > Instalar app** o el botón de **Menú** dentro de la app.
4. Queda el ícono del Hogar junto a tus otras apps.

**Para Any:** tiene que estar dada de alta en **Menú > Usuarios** con su Gmail. Le pasás la dirección de la app y repite el paso 5.
Ya no hace falta compartirle la planilla. Si se la habías compartido, podés dejar de compartirla desde Drive.

---

## Cómo actualizar en el futuro

- **Cambios en la pantalla:** en GitHub, **Add file > Upload files**, subís el archivo nuevo (reemplaza al anterior) y hacés Commit. Los celulares lo toman solos. A veces hay que cerrar la app y abrirla dos veces.
- **Cambios en el motor (Código.gs):** lo pegás en Apps Script y hacés **Administrar implementaciones > lápiz > Nueva versión**. La dirección `/exec` no cambia.

## Seguridad

- Solo entran los mails que están activos en **Usuarios**. Si desactivás a alguien, pierde el acceso en el momento.
- La sesión en cada celular dura 90 días (se cambia con `DIAS_SESION` en Código.gs).
- Si se pierde un celular, en Apps Script ejecutá la función **cerrarTodasLasSesiones**. Todos tienen que volver a ingresar.
- La planilla queda solo en tu Drive, y los mails de aviso salen desde tu Gmail.

## Si algo falla

| Mensaje | Qué revisar |
|---|---|
| Error 400 **origin_mismatch** al iniciar sesión | En el paso 2.5, el origen tiene que ser exactamente `https://USUARIO.github.io` |
| "El motor no respondió bien" | En el paso 3.4, el acceso tiene que ser **Cualquier persona**, y la URL de `config.js` tiene que terminar en `/exec` |
| "La credencial es de otra aplicación" | El ID de cliente tiene que ser el mismo en `Código.gs` y en `config.js` |
| "Falta pegar el GOOGLE_CLIENT_ID" | Pegalo en Código.gs, guardá y hacé **Nueva versión** |
| "La cuenta … no tiene acceso" | Dar de alta ese mail en **Menú > Usuarios** |
