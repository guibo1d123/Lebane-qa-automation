const { expect } = require('@playwright/test');
const path = require('path');

/** Pestaña Unidades → Templates → Cargar Template de Unidades (subir Excel). */
class ImportarTemplatePage {
  constructor(page) {
    this.page = page;
    this.tabUnidades = page.getByRole('tab', { name: 'Unidades' });
    this.botonTemplates = page.getByRole('button', { name: 'Templates' });
    this.opcionCargarTemplate = page.getByRole('button', { name: 'Cargar Template de Unidades', exact: true });
    this.inputArchivo = page.getByLabel('Seleccionar desde mi');
    this.botonCargar = page.getByRole('button', { name: 'Cargar', exact: true });
    this.botonCerrar = page.getByRole('button', { name: 'Cerrar' });

    // Botón de la lista de precios: es el botón que está justo antes de "Templates"
    this.botonListaPrecios = this.botonTemplates.locator('xpath=preceding::button[1]');
    // Cada texto dentro del menú desplegable es una lista de precios
    this.opcionesLista = page.getByRole('menu').getByText(/\S/);
  }

  async abrirTabUnidades() {
    await this.tabUnidades.click();
  }

  /** Sube el Excel con el botón Templates → Cargar Template de Unidades */
  async cargarTemplate(archivo) {
    await this.botonTemplates.click();
    await this.opcionCargarTemplate.click();

    // Ruta completa al archivo, para que funcione en cualquier computadora
    const rutaCompleta = path.join(__dirname, '..', archivo);
    await this.inputArchivo.setInputFiles(rutaCompleta);

    await this.botonCargar.click();
    await this.botonCerrar.click();
  }

  /** Abre el desplegable de listas y elige la última (la que creó el template) */
  async seleccionarListaNueva() {
    await this.botonListaPrecios.click();
    await expect(this.opcionesLista.first()).toBeVisible();
    await this.opcionesLista.last().click();
  }

  /** Devuelve la fila de la tabla que tiene esa unidad */
  fila(nombreUnidad) {
    return this.page.getByRole('row').filter({ hasText: nombreUnidad });
  }
}

module.exports = { ImportarTemplatePage };