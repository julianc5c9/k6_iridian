import { browser } from 'k6/browser';
import { sleep } from 'k6';
import { configurarEscenario } from './usuarios.js';
import * as funciones from './funciones.js';

export const options = { 
    scenarios: Object.assign(
        configurarEscenario('escenario1', 3, 3, '10s'),
        configurarEscenario('escenario2', 5, 5, '20s'),
        configurarEscenario('escenario3', 7, 7, '30s')
    ),
    thresholds:{
        'http_req_duration{scenarios:escenario1}': ['p(95)<3000'],
        'http_req_duration{scenarios:escenario2}': ['p(95)<3000'],
        'http_req_duration{scenarios:escenario3}': ['p(95)<3000'],

        'iteration_duration{scenarios:escenario1}': ['p(99)<9000'],
        'iteration_duration{scenarios:escenario2}': ['p(99)<9000'],
        'iteration_duration{scenarios:escenario3}': ['p(99)<9000'],

        http_req_failed: ['rate < 0.01'],
    },
}; 

export default async function() {
    console.log('Iniciando prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    await funciones.interactuarCampo(navegador, "//input[@id='nombre']", 'Julian', 'Nombre');
    sleep(0.2);

    await funciones.interactuarCampo(navegador, "//input[@id='apellidos']", 'Garcia', 'Apellido');
    sleep(0.2);

    await funciones.interactuarCampo(navegador, "//input[@id='tel']", 3162356114, 'Telefono');
    sleep(0.2);

    await funciones.interactuarCampo(navegador, "//input[@id='email']", 'julian@iridian.co', 'Email');
    sleep(0.2);
        
    await funciones.interactuarCampo(navegador, "//input[@id='direccion']", 'Carrera 4 # 8-83', 'Direccion');
    sleep(0.2);
        
    await funciones.clickBoton(navegador, "//button[@type='submit']", 'Enviar')
    sleep(0.2);

    await funciones.finalNavegador(navegador, 3000);
}
