const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: 'ejemplo@compañia.com' });
    this.password = page.getByRole('textbox', { name: 'Contraseña *' });
    this.botonIngresar = page.getByRole('button', { name: 'Ingresar' });
  }

  async ir() {
    await this.page.goto('/sign-in');
  }

  async login(usuario, clave) {
    await this.email.fill(usuario);
    await this.password.fill(clave);
    await this.botonIngresar.click();
    // Si el login fue exitoso, el botón "Ingresar" desaparece
    await expect(this.botonIngresar).toBeHidden({ timeout: 30000 });
  }
}

module.exports = { LoginPage };