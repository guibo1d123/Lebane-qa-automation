const { expect } = require('@playwright/test');

class ProjectPage {
  constructor(page) {
    this.page = page;

    // --- Abrir el formulario ---
    this.botonAgregarProyecto = page.getByRole('button', { name: 'Agregar proyecto' });

    // --- Campos del formulario (obligatorios) ---
    this.nombre = page.locator('[data-cy="new-renderer-field-nombreProyecto"]');

    // Desplegables "Seleccionar", en el orden en que aparecen
    const combos = page.getByRole('combobox', { name: 'Seleccionar' });
    this.moneda = combos.nth(0);
    this.pais = combos.nth(1);
    this.provincia = combos.nth(2);       // en pantalla se llama "Estado"
    this.ciudad = combos.nth(3);
    this.tipoConstruccion = combos.nth(4);
    this.modalidadAjuste = combos.nth(5);

    this.direccion = page.getByRole('textbox', { name: 'Dirección' });
    this.numero = page.locator('input[name="numeroPuerta"]');
    this.fechaFin = page.getByRole('textbox', { name: 'DD/MM/YYYY' }).nth(1); // la 1ra es Fecha de Inicio
    this.razonSocial = page.getByRole('combobox', { name: 'Escribí para buscar o crear' });
    this.botonRegistrar = page.getByRole('button', { name: 'Registrar' });
  }

  async abrirFormularioNuevoProyecto() {
    // En el inicio está la tarjeta "Proyectos Desarrollo" con el botón "Agregar proyecto"
    await expect(this.botonAgregarProyecto).toBeVisible();
    await this.botonAgregarProyecto.click();
    await expect(this.nombre).toBeVisible();
  }

  async completarFormularioProyecto(datos) {
    await this.nombre.fill(datos.nombre);
    await expect(this.nombre).toHaveValue(datos.nombre);

    await this.escribirYElegir(this.moneda, datos.moneda);
    await this.escribirYElegir(this.pais, datos.pais);
    await this.escribirYElegir(this.provincia, datos.provincia);   // se habilita después de elegir país
    await this.escribirYElegir(this.ciudad, datos.ciudad);         // se habilita después de elegir provincia

    await this.direccion.fill(datos.direccion);
    await expect(this.direccion).toHaveValue(datos.direccion);

    await this.numero.fill(datos.numero);
    await expect(this.numero).toHaveValue(datos.numero);

    await this.escribirFecha(datos.fechaFin);

    await this.escribirYElegir(this.tipoConstruccion, datos.rubro);
    await this.escribirYElegir(this.modalidadAjuste, datos.condicion);
    await this.elegirRazonSocialExistente();
  }

  async registrar() {
    await expect(this.botonRegistrar).toBeEnabled(); // se habilita cuando todo está completo
    await this.botonRegistrar.click();
  }

  /** Elige la primera razón social que ya existe (no la opción "Crear nueva razón social...") */
  async elegirRazonSocialExistente() {
    const existentes = this.page.getByRole('option').filter({ hasNotText: 'Crear nueva' });

    await expect(async () => {
      await this.razonSocial.click();
      await expect(existentes.first()).toBeVisible({ timeout: 3000 });
      const nombreElegido = (await existentes.first().innerText()).trim();
      await existentes.first().click();
      await expect(this.razonSocial).toHaveValue(nombreElegido, { timeout: 3000 });
    }).toPass({ timeout: 30000 });
  }

  /** Escribe la fecha (solo números, el campo pone las barras solo) */
  async escribirFecha(fecha) {
    await this.fechaFin.click();
    await this.fechaFin.pressSequentially(fecha.replace(/\//g, ''), { delay: 50 });
    await expect(this.fechaFin).toHaveValue(fecha);
  }

  // Helper: abre el desplegable, escribe para filtrar y elige la opción con el texto EXACTO.
  // Si la app todavía está cargando y se pierde lo escrito, lo reintenta.
  async escribirYElegir(combo, opcion) {
    const resultado = this.page.getByRole('option', { name: opcion, exact: true });

    await expect(async () => {
      await combo.click();
      await combo.clear();
      await combo.pressSequentially(opcion, { delay: 30 });
      await expect(resultado).toBeVisible({ timeout: 3000 });
      await resultado.click();
      // Confirmamos que el campo quedó EXACTAMENTE con el valor elegido
      await expect(combo).toHaveValue(opcion, { timeout: 3000 });
    }).toPass({ timeout: 30000 });
  }
}

module.exports = { ProjectPage };