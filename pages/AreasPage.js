const { expect } = require('@playwright/test');

/** Formulario "Actualizar datos del proyecto" (Áreas). Al guardar se crea la lista de precios inicial. */
class AreasPage {
  constructor(page) {
    this.page = page;
    this.precioM2 = page.locator('input[name="precioListaMetroCuadrado"]');
    this.pisos = page.locator('input[name="pisos"]');
    this.comboTipologias = page.getByRole('combobox').nth(1);
    this.unidadesPorPiso = page.locator('input[name="unidadesPorPiso"]');
    this.botonGuardar = page.getByRole('button', { name: 'Guardar' });
    this.mensajeExito = page.getByText('Areas del proyecto creadas');
  }

  async completarAreas(datos) {
    await this.precioM2.fill(datos.precioM2);
    await this.pisos.fill(datos.pisos);
    await this.comboTipologias.click();
    await this.page.getByRole('option', { name: datos.tipologia }).click();
    await this.unidadesPorPiso.fill(datos.unidadesPorPiso);
  }

  async guardar() {
    await this.botonGuardar.click();
  }
}

module.exports = { AreasPage };