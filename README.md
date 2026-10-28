AUTOMATIZACION DE LA LSITA DE PRECIOS DE LEBANE

Tecnologias usadas: Playwrigth + JavaScripts(Node.js)

---

## 1. Como se realiza la instalacion
Clonar el repositorio y, dentro de la carpeta del proyecto, ejecutar:

```
npm install
npx playwright install chromium

Crear en la raíz un archivo `.env`  con las credenciales (Son las credenciales que me agregaron en el emial ):

```
BASE_URL=https://tst.lebane.app
LEBANE_USER=usuario@mail.com
LEBANE_PASSWORD=contraseña
```

## 2. Cómo correr los tests:

Hay diferentes comandos en mi dia a dia trato de correrlo desde la terminal por ahi en la creacion de un primer caso la visualizacion es importante pero ya una vez que el caso este creado correr esos casos una vez por semana para ver que no esten fallando, otras cosas tambien para que no se rompan los casos es que cada vez que se sube algo al ambiente tener estas pruebas para que se ejecuten en proyectos anteriores se manejaba de esa manera asi les servia a los devs-front para ver si el codigo que subian en el ambiente podria romper algo. (sumado a pruebas de integracion que son las que priorizaba para las automatizaciones)

| Comando | Qué hace |
|---|---|
| `npx playwright test` Corre todos los tests (sin ver el navegador) 
| `npx playwright test --headed`  Corre todos los tests viendo el navegador 

## 3. Estructura del proyecto

```
QA_Automation_Lebane/
├── fixtures/
│   └── template_unidades.xlsx       Excel con las unidades a importar
├── pages/                           Page Objects: CÓMO se usa cada pantalla
│   ├── LoginPage.js                 Pantalla de login, que reutilizo en cada prueba 
│   ├── ProjectPage.js               Formulario -Agregar proyecto
│   ├── MenuPage.js                  Buscador del proeycto y menú lateral
│   ├── AreasPage.js                 Formulario de Áreas (crear la lista inicial)
│   ├── ImportarTemplatePage.js      Carga del template Excel
│   └── GrillaUnidadesPage.js        Tabla de unidades: modificar y eliminar
├── tests/                           QUÉ se prueba
│   ├── 01-crear-proyecto.spec.js    Casos 1 y 2
│   └── 02-importar-template.spec.js Casos 3 al 7
├── utils/
│   └── testData.js                  CON QUe? datos se prueba
├── playwright.config.js             Configuración general
├── .env.example                     Modelo de credenciales
└── package.json                     Dependencias y scripts
```

### Que hace cada parte dentro de la estructura

utils/testData.js-los datos de prueba

Aca estan todos los datos que uso para llenar los formularios
Al nombre del proyecto le agrego un numero unico en cada corrida (`Grecia_qa_test_482913`), asi no se choca con proyectos de corridas anteriores, ya que el ambiente es compartido.

pages/los Page Objects

`tests/` — los casos de prueba
Todos los tests siguen la misma idea: **preparar → hacer la accion → verificar**. Los dividi en pasos con `test.step` para que en el reporte se vea clarito en que paso falla.
---


## 5. Decisiones relevantes

-Playwright con JavaScript
Elegi Playwright porque espera solo a que los elementos esten listos, sube archivos sin tener que abrir la ventana de Windows y ya trae reporte HTML, screenshots, video y trace sin instalar nada mas. Use JavaScript porque es mas simple de leer en mi caso.

-Page Object Model
Separe el **como** (pages), el **que** (tests) y el **con que** (testData). Si cambia un boton, lo arreglo en un solo archivo y los tests quedan igual.

### Codegen para arrancar, no como resultado final
Me gusta agregar como es mi dia a dia automatizando y una de estas es como inice el proceso,rabe cada flujo con `codegen` para ver los selectores reales y despues los limpie: saque clicks repetidos, valores escritos a mano y selectores por posicion.

### Selectores estables
Los fue anotando, cada cosa que me traia probelma, que tambien puede ser por mismo los selectores que toma el mismo codegen y es necesarios buscar el reemplado desde la busque del elemento desde el front, elegi en este orden:

1. Atributos de testing que tiene la app (`data-cy="expandMenu"`, `data-cy="new-renderer-field-nombreProyecto"`)
2. Rol y nombre del elemento (`getByRole('button', { name: 'Agregar proyecto' })`)
3. El atributo `name` del campo (`input[name="pisos"]`)

Trate de NO usar selectores por posicion (`nth(1)`) ni clases CSS generadas (`.muiltr-g2gjqi`), porque se rompen con cualquier cambio visual. Por ejemplo, el `nth(1)` que grabo codegen para abrir el menu terminaba abriendo el buscador.

### Login en cada test (`beforeEach`)
Primero quise guardar la sesion una sola vez con `storageState`, pero Lebane no levanta la sesion desde ese archivo y te manda de nuevo a `/sign-in`. Por eso cada test hace login en el `beforeEach`.

### Tests en orden , UNO RELACION AL OTRO 
Los casos siguen el recorrido real de una lista: crear → cargar → modificar → eliminar. Por eso los archivos estan numerados (`01`, `02`), corren con un solo worker y el archivo `02` usa `mode: 'serial'`. La contra es que si falla uno, los que siguen no se ejecutan.

### Problemas que tuve y como los resolvi

1. Desplegables del formulario (moneda, pais...)**
- A veces con un click no se abria la lista, y otras veces el valor que elegia se borraba porque la app seguia cargando datos. O sea, era un test flaky.
- Su solucion : arme un solo metodo, `escribirYElegir`, que escribe el texto letra por letra para que filtre, elige la opcion con el **texto exacto** y **verifica** que el campo quedo con ese valor. Todo eso esta adentro de `expect().toPass()`, que reintenta hasta que queda bien. No use esperas fijas (`waitForTimeout`).

2. Razon social
- El boton "Registrar" no se habilitaba nunca. Mirando el page snapshot del error vi que el selector agarraba la primera opcion, "Crear nueva razon social...", y eso abria campos obligatorios extra.
- Su solucion: elijo la primera razon social que  y verifico el valor exacto. 

3. Fecha de finalizacion
-  Hacer click en un dia del calendario fallaba seguido.
- Su solucion :escribo la fecha directo en el campo y la verifico con `toHaveValue`.


4. Carga del Excel
- la ventana de Windows para elegir el archivo no se puede manejar desde el navegador, y la ruta cambia segun la compu.
- Su solucion: con `setInputFiles` le paso el archivo directo al campo, y con `path.join(__dirname, ...)` armo la ruta desde donde esta el codigo, asi anda en cualquier maquina. Ademas el template original venia vacio (solo con encabezados), asi que arme uno con 3 unidades validas.

5. Eliminar unidades
- si buscaba la fila que "contiene 101", tambien me traia "T-101".
- Su solucion: busco la fila donde la celda es **exactamente** el nombre de la unidad. Si aparece un cartel de confirmacion, lo acepto.

6. Validar que la lista se elimino 
-  contar las listas del desplegable me daba un numero que no era real: aunque estuviera vacio, igual contaba un texto del menu.
- Su solcuion : recargo la pagina (para confirmar que se guardo en el servidor) y valido el mensaje **"No hay registros para mostrar"**, que es lo que ve el usuario.

--------------------------------------------------------------------

### Datos unicos y credenciales
Cada corrida usa un nombre de proyecto con un numero unico, y las credenciales estan en el `.env`, no en el codigo.

### Evidencia cuando algo falla
Solo guardo screenshot, video y trace cuando un test falla. Cada accion tiene un limite de 15 segundos (`actionTimeout`), asi si un elemento no aparece falla rapido y con un mensaje claro.

---

## 7. Alcance y limitaciones

- **Caso 3:** valido que la carga del template termina bien. Me falto verificar que se crea una lista nueva con exactamente las unidades del Excel; eso queda como proximo paso.
- **Caso 4:** valido la edicion de una unidad desde la grilla cambiando el **piso**. Editar el **precio** funciona igual (modo edicion → celda → valor nuevo).
- Los tests dependen unos de otros y crean datos en un ambiente compartido.

Los casos que me hubiera gustado agregar y las mejoras que propongo estan en **`CASOS_ADICIONALES.md`**.