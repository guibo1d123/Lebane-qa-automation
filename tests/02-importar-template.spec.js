const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { MenuPage } = require('../pages/MenuPage');
const { ImportarTemplatePage } = require('../pages/ImportarTemplatePage');
const { GrillaUnidadesPage } = require('../pages/GrillaUnidadesPage');
const { testData } = require('../utils/testData');

/**
 * Casos sobre la grilla de unidades.
 * Usan el proyecto creado en 01-crear-proyecto.spec.js (lista inicial con unidades 101 y 102).
 * Van en orden: cada test parte de lo que dejó el anterior.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Grilla de unidades', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.ir();
    await login.login(process.env.LEBANE_USER, process.env.LEBANE_PASSWORD);

    // Todos los tests de este archivo arrancan en la grilla del proyecto
    const menu = new MenuPage(page);
    const importarTemplate = new ImportarTemplatePage(page);
    await menu.abrirProyecto(testData.proyecto.nombre);
    await menu.irAUnidades();
    await importarTemplate.abrirTabUnidades();
  });

  test('3 y 4. Cargar template y modificar una unidad de la tabla', async ({ page }) => {
    const importarTemplate = new ImportarTemplatePage(page);
    const grilla = new GrillaUnidadesPage(page);
    let pisoNuevo;

    await test.step('Cargar el template Excel', async () => {
      await importarTemplate.cargarTemplate(testData.template.archivo);
      await expect(importarTemplate.botonCargar).toBeHidden(); // se cerró la ventana de carga
    });

    await test.step('Modificar el piso de la unidad 102', async () => {
      pisoNuevo = await grilla.cambiarPiso('102');
    });

    await test.step('Verificar que la tabla muestra el piso nuevo', async () => {
      await expect(grilla.celdaPiso('102')).toHaveText(pisoNuevo);
    });
  });

  test('5. Eliminar una unidad de una lista (la lista sigue existiendo)', async ({ page }) => {
    const grilla = new GrillaUnidadesPage(page);

    await test.step('Eliminar la unidad 101 con el tacho', async () => {
      await grilla.eliminarUnidad('101');
    });

    await test.step('Verificar: la unidad desapareció y la lista sigue', async () => {
      await expect(grilla.fila('101')).toHaveCount(0);  // la 101 ya no está
      await expect(grilla.fila('102')).toBeVisible();   // la 102 sigue → la lista existe
    });
  });

  test('6. Eliminar la última unidad de una lista (la lista se elimina sola)', async ({ page }) => {
    const grilla = new GrillaUnidadesPage(page);

    await test.step('Eliminar la 102, la última unidad de la lista', async () => {
      await grilla.eliminarUnidad('102');
      await expect(grilla.fila('102')).toHaveCount(0);
    });

    await test.step('Verificar: la lista se eliminó (no hay registros para mostrar)', async () => {
      await grilla.recargar();
      await expect(grilla.mensajeSinRegistros).toBeVisible();
    });
  });

  test('7. Una unidad sin lista de precios se elimina', async ({ page }) => {
    const grilla = new GrillaUnidadesPage(page);

    await test.step('Verificar que la 102 no quedó suelta en el proyecto', async () => {
      await expect(grilla.mensajeSinRegistros).toBeVisible();
      await expect(grilla.fila('102')).toHaveCount(0);
    });
  });

});