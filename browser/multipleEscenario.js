import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

import { configurarEscenario } from './usuarios.js';  // Importamos la configuración del escenario

// Definimos las opciones para el escenario
export const options = {
  scenarios: Object.assign(
      configurarEscenario('escenario1', 3, 3, '20s'),
      configurarEscenario('escenario2', 5, 5, '30s'),
      configurarEscenario('escenario3', 7, 7, '40s')
  ),
  thresholds: {
      checks: ['rate==1.0'],  // Nos aseguramos de que todas las verificaciones pasen
  },
};

export default async function () {
    console.log(('Iniciando prueba end to end'));

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    try {
        // Interactuamos con el campo nombre
        const nombreSelector = "//input[@id='nombre']";
        await navegador.waitForSelector( nombreSelector, {timeout:3000, visible:true});
        const nombreTexto = 'Julian';
        await navegador.type(nombreSelector, nombreTexto);
        sleep(0.4);
    } catch (error) {
        console.error('Hubo un error al interactuar con el campo: Nombre', error);
    }

    // Interactuamos con el campo apellido
    const apellidoSelector = "//input[@id='apellidos']"; 
    await navegador.waitForSelector(apellidoSelector, { timeout:3000, visible: true});
    const apellidoTexto = 'Garcia';
    await navegador.type(apellidoSelector, apellidoTexto);
    sleep(0.4);

    // Interactuamos con el campo telefono
    const telefonoSelector = "//input[@id='tel']";
    await navegador.waitForSelector(telefonoSelector, { timeout:3000, visible: true});
    const telefonoNumero = 3162356114;
    await navegador.type(telefonoSelector, telefonoNumero);

    try {
        // Interactuamos con el campo email
        const emailSelector = "//input[@id='email']";
        await navegador.waitForSelector(emailSelector, { timeout: 3000, visible: true});
        const emailTexto = 'julian@iridian.co';
        await navegador.type(emailSelector, emailTexto);
        sleep(0.4);
    } catch (error) {
        console.error('Hubo un error al interactuar con el campo: Email', error);
    }

    const direccionSelector = "//input[@id='direccion']";
    await navegador.waitForSelector( direccionSelector, { timeout: 3000, visible: true});
    const direccionTexto = 'Calle 100';
    await navegador.type(direccionSelector, direccionTexto);
    sleep(0.4);

    await navegador.waitForTimeout(3000);
    await navegador.close();
} 