const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProjectPage } = require('../pages/ProjectPage');
const { MenuPage } = require('../pages/MenuPage');
const { AreasPage } = require('../pages/AreasPage');
const { testData } = require('../utils/testData');

// Los tests corren en orden: el 2 usa el proyecto que creó el 1
test.describe.configure({ mode: 'serial' });

test.describe('Lista de precios de unidades', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.ir();
    await login.login(process.env.LEBANE_USER, process.env.LEBANE_PASSWORD);
  });

  test('1. Crear proyecto nuevo con los datos obligatorios', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await test.step('Abrir formulario de nuevo proyecto', async () => {
      await projectPage.abrirFormularioNuevoProyecto();
    });

    await test.step('Completar datos del proyecto', async () => {
      await projectPage.completarFormularioProyecto(testData.proyecto);
    });

    await test.step('Registrar el proyecto', async () => {
      await projectPage.registrar();
    });

    await test.step('Verificar que el proyecto se creó', async () => {
      await expect(page.getByText(testData.proyecto.nombre).first()).toBeVisible();
    });
  });

  test('2. Completar Áreas: se crea la lista de precios inicial', async ({ page }) => {
    const menu = new MenuPage(page);
    const areas = new AreasPage(page);

    await test.step('Buscar el proyecto creado en el test 1', async () => {
      await menu.abrirProyecto(testData.proyecto.nombre);
    });

    await test.step('Ir a Clientes → Unidades', async () => {
      await menu.irAUnidades();
    });

    await test.step('Completar datos de Áreas', async () => {
      await areas.completarAreas(testData.areas);
    });

    await test.step('Guardar y verificar', async () => {
      await areas.guardar();
      await expect(areas.mensajeExito).toBeVisible();
    });
  });

});