const { test: setup } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

setup('login en Lebane', async ({ page }) => {
  const usuario = process.env.LEBANE_USER;
  const clave = process.env.LEBANE_PASSWORD;
  if (!usuario || !clave) throw new Error('Faltan LEBANE_USER / LEBANE_PASSWORD en el .env');

  const login = new LoginPage(page);
  await login.ir();
  await login.login(usuario, clave);

  // Guarda la sesión para que los próximos tests arranquen logueados
  await page.context().storageState({ path: '.auth/user.json' });
});