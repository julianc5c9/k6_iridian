import {browser} from 'k6/browser';
import { sleep } from 'k6';
import { configurarEscenario } from './usuarios.js';
// import { interactuarCampo, clickBoton } from './funciones'; importar funciones individuales 
import * as funciones from './funciones.js'; // importar todas las funciones 

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

//Llamamos las funciones para el POM
export default async function () {
    console.log('Iniciando la prueba end to end con POM');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html'); 

    await funciones.interactuarCampo(navegador, "//input[@id='nombre']", 'Julian', 'Nombre');
    sleep(0.4);

    await funciones.interactuarCampo(navegador, "//input[@id='apellidos']", 'Garcia', 'Apellido');
    sleep(0.4);

    await funciones.interactuarCampo(navegador, "//input[@id='tel']", 3162356114, 'Telefono');
    sleep(0.4);

    await funciones.interactuarCampo(navegador, "//input[@id='email']", 'julian@iridian.co', 'Email');
    sleep(0.4);

    await funciones.interactuarCampo(navegador, "//input[@id='direccion']", 'Carrera 4 # 8-83', 'Direccion');
    sleep(0.4);

    await funciones.clickBoton(navegador, "//button[@type='submit']", 'Enviar')
    sleep(0.4);

    await funciones.finalNavegador(navegador, 3000); 
}

