Casos que me hubiera gustado agregar

Por tiempo me enfoque en cumplir los 7 casos que pedia el challenge. Igual, mientras lo armaba, fui notando algunas cosas que me hubiera gustado probar. Las dejo anotadas aca.

Aclaro que varias dependen de conocer mejor las reglas de negocio y el detalle del flujo. Estas son las que pude ver por encima.

1. Formulario de crear proyecto

- Campos obligatorios: intentar registrar dejando vacio un campo obligatorio por vez. Lo esperado es que el boton "Registrar" no se habilite y que el campo se marque como obligatorio.
- Logica de las fechas: probando a mano vi que el formulario me deja poner una fecha de finalizacion **anterior** a la fecha de inicio, y no hay ninguna validacion. Esto me parece importante, porque un proyecto no puede terminar antes de empezar.
- Proyecto con el mismo nombre: ver que pasa si creo un proyecto con un nombre que ya existe. ¿Lo deja crear? Avisa? En el ambiente hay muchos proyectos con nombres parecidos y es facil confundirse.

2. Buscador de proyectos

- Ver que pasa si busco un proyecto que no existe, si escribo solo una parte del nombre, o si hay dos proyectos con el mismo nombre. ¿Cual me abre?

3. Unidades

- Logica de las columnas: en la tabla hay varias columnas de medidas (m2 cubiertos, semi cubiertos, descubiertos, totales...) y precio. Supongo que entre ellas hay alguna logica, por ejemplo que el total sea la suma de los otros o que el precio dependa del precio por m2. No lo pude confirmar, pero si existe, habria que probarla.

4. Listas de precios

- Nombre de la lista: no se bien de donde sale el nombre de una lista. A veces aparece con la fecha ("Lista precios 27/10/2026"), pero no se como se llama cuando la crea un template o cuando no le pongo nombre. Habria que confirmar la regla y probarla.

---

Para todos estos casos lo ideal seria primero hablar con el equipo y entender bien como deberia funcionar cada cosa, y despues automatizarlos.