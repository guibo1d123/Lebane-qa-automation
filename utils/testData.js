// Número único por corrida, para que el nombre del proyecto no se repita
const uid = Date.now().toString().slice(-6);

const testData = {
  // Datos para crear el proyecto (caso 1)
  proyecto: {
    nombre: `Grecia_qa_test_${uid}`,
    moneda: 'ARS',
    pais: 'Argentina',
    provincia: 'Capital Federal',
    ciudad: 'Villa Devoto',
    direccion: 'San Nicolás',
    numero: '4760',
    fechaFin: '12/12/2027',
    rubro: 'Arquitectura',
    condicion: 'Disponible al vencimiento',
    razonSocial: 'razon social',
  },

  // Datos para completar Áreas: crea la lista de precios inicial (caso 2)
  areas: {
    precioM2: '45',
    pisos: '1',
    tipologia: 'Cinco ambientes',
    unidadesPorPiso: '2',
  },

  // Template Excel para cargar unidades (caso 3)
  template: {
    archivo: 'fixtures/template_unidades.xlsx',
    unidades: ['T-101', 'T-102', 'T-103'],   // las que están cargadas en el Excel
  },
};

module.exports = { testData };