import {browser} from 'k6/browser';
import {sleep} from 'k6'; 
import {configurarEscenario} from './usuarios.js';
import * as funciones from './funciones.js';  

export const options = {
    scenarios: Object.assign(
        configurarEscenario('escenario1', 3, 3, '10s'),
        configurarEscenario('escenario2', 5, 5, '20s'),
        configurarEscenario('escenario3', 7, 7, '30s')
    ),
    thresholds: {
        checks: ['rate==1.0'],
        'http_req_duration': ['p(95)<3000'],  // El 95% de las solicitudes HTTP deben ser menores a 3000ms
        'http_req_duration{scenario:escenario1}': ['avg<300'],  // Definir el thresholds para un escenario 
        'iteration_duration': ['p(99)<9000'],  // El 99% de las iteraciones deben completarse en menos de 9000ms
        'http_req_failed': ['rate<0.01'],  // Menos del 1% de las solicitudes HTTP deben fallar
    },
};

export default async function() {
    console.log('Iniciando prueba end to end');

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

    console.log('Prueba finalizada');

    await funciones.finalNavegador(navegador, 3000); 
}

