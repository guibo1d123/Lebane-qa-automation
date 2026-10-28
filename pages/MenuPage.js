const { expect } = require('@playwright/test');

/** Navegación general: buscador (Ctrl K) y menú lateral. */
class MenuPage {
  constructor(page) {
    this.page = page;

    // Buscador
    this.botonBuscar = page.getByRole('button', { name: 'Buscar Ctrl K' });
    this.inputBuscar = page.getByRole('textbox', { name: 'Ir a...' });

    // Menú lateral
    this.botonExpandirMenu = page.locator('[data-cy="expandMenu"]');
    // El ícono "<<" (doubleArrowLeft) aparece cuando el menú está abierto
    this.iconoMenuAbierto = this.botonExpandirMenu.locator('use[*|href*="doubleArrowLeft"]');
    this.menuClientes = page.getByRole('button', { name: 'Clientes' });
    this.menuUnidades = page.getByRole('button', { name: 'Unidades', exact: true });
  }

  /** Busca un proyecto por nombre con el buscador y lo abre. */
  async abrirProyecto(nombreProyecto) {
    const resultado = this.page.getByRole('menuitem', { name: nombreProyecto }).first();

    await this.botonBuscar.click();

    // Escribimos letra por letra (como un usuario) para que el buscador reaccione
    await this.inputBuscar.pressSequentially(nombreProyecto, { delay: 50 });

    // Por si igual no busca: borramos la última letra y la volvemos a escribir
    if (!(await resultado.isVisible({ timeout: 3000 }).catch(() => false))) {
      await this.inputBuscar.press('Backspace');
      await this.inputBuscar.pressSequentially(nombreProyecto.slice(-1));
    }

    await expect(resultado).toBeVisible();
    await resultado.click();

    // Esperamos a que el proyecto termine de abrir (la URL pasa a /proyecto/...)
    await this.page.waitForURL(/\/proyecto\//, { timeout: 30000 });
  }

  /** Expande el menú lateral solo si está cerrado */
  async expandirMenu() {
    await expect(this.botonExpandirMenu).toBeVisible();
    if ((await this.iconoMenuAbierto.count()) === 0) {
      await this.botonExpandirMenu.click();
    }
    await expect(this.iconoMenuAbierto).toHaveCount(1); // confirmamos que quedó abierto
  }

  /** Menú lateral: Clientes → Unidades */
  async irAUnidades() {
    await this.expandirMenu();

    // "Clientes" se habilita cuando el proyecto ya está abierto
    await expect(this.menuClientes).toBeEnabled({ timeout: 30000 });
    await this.menuClientes.click();

    await expect(this.menuUnidades).toBeVisible();
    await this.menuUnidades.click();
  }
}

module.exports = { MenuPage };