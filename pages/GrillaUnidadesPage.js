const { expect } = require('@playwright/test');

/** Grilla de unidades (pestaña Unidades): modificar y eliminar unidades. */
class GrillaUnidadesPage {
  constructor(page) {
    this.page = page;
    this.tabUnidades = page.getByRole('tab', { name: 'Unidades' });
    this.botonTemplates = page.getByRole('button', { name: 'Templates' });
    this.botonEntrarEdicion = page.getByRole('button', { name: 'Entrar en modo edición' });
    this.botonSalirEdicion = page.getByRole('button', { name: 'Salir de modo edición' });
    this.opcionesTooltip = page.getByRole('tooltip').getByText(/^Piso/);

    // Mensaje cuando la tabla queda vacía (la lista ya no existe)
    this.mensajeSinRegistros = page.getByText('No hay registros para mostrar');
  }

  // ---------- Filas ----------

  /** Fila cuya celda de unidad es EXACTAMENTE ese nombre (ej: "101", no "T-101") */
  fila(nombreUnidad) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: nombreUnidad, exact: true }),
    });
  }

  /** Celda "Piso" de una unidad */
  celdaPiso(nombreUnidad) {
    return this.fila(nombreUnidad).getByRole('cell', { name: /^Piso/ });
  }

  /** Recarga la página y vuelve a la pestaña Unidades (para ver los datos guardados) */
  async recargar() {
    await this.page.reload();
    await this.tabUnidades.click();
    await expect(this.botonTemplates).toBeVisible();
  }

  // ---------- Modificar ----------

  /** Activa el modo edición de la tabla si no está activo */
  async asegurarModoEdicion() {
    if (await this.botonEntrarEdicion.isVisible().catch(() => false)) {
      await this.botonEntrarEdicion.click();
    }
    await expect(this.botonSalirEdicion).toBeVisible();
  }

  /** Cambia el piso de una unidad por otro distinto al actual. Devuelve el piso nuevo. */
  async cambiarPiso(nombreUnidad) {
    await this.asegurarModoEdicion();

    const celda = this.celdaPiso(nombreUnidad);
    const pisoActual = (await celda.innerText()).trim();

    await celda.click();
    await expect(this.opcionesTooltip.first()).toBeVisible();

    // Elegimos el primer piso que NO sea el actual
    const opciones = (await this.opcionesTooltip.allInnerTexts()).map((t) => t.trim());
    const pisoNuevo = opciones.find((p) => p !== pisoActual);
    expect(pisoNuevo, 'No hay otro piso disponible para elegir').toBeTruthy();

    await this.page.getByRole('tooltip').getByText(pisoNuevo, { exact: true }).click();
    return pisoNuevo;
  }

  // ---------- Eliminar ----------

  /** Elimina una unidad con el tacho rojo de su fila */
  async eliminarUnidad(nombreUnidad) {
    const fila = this.fila(nombreUnidad);
    await expect(fila).toBeVisible();
    await fila.getByRole('button', { name: 'Eliminar' }).click();

    // Si aparece una ventana de confirmación, la aceptamos
    const confirmar = this.page.getByRole('dialog')
      .getByRole('button', { name: /Eliminar|Confirmar|Aceptar|S[ií]/i });
    if (await confirmar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmar.click();
    }
  }
}

module.exports = { GrillaUnidadesPage };