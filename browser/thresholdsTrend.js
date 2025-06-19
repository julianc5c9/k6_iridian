import { browser } from 'k6/browser';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { configurarEscenario } from './usuarios.js';
import * as funciones from './funciones.js';

const tiempoDeFormulario = Trend('tiempo_de_formulario');

export const options = {
    scenarios: Object.assign(
        configurarEscenario('escenario1', 3, 3, '10s'),
        configurarEscenario('escenario2', 5, 5, '20s'),
        configurarEscenario('escenario3', 7, 7, '30s')
    ), 
    thresholds: {
        // Threshold para la métrica personalizada
        'tiempo_de_formulario': ['p(95)<8000'],

        // Thresholds estándar
        'http_req_duration': ['p(95)<3000'],  // El 95% de las solicitudes HTTP deben ser menores a 3000ms
        'http_req_duration{scenario:escenario1}': ['avg<300'],  // Definir el thresholds para un escenario 
        'iteration_duration': ['p(99)<24000'],  
        'http_req_failed': ['rate<0.01'],  // Menos del 1% de las solicitudes HTTP deben fallar
    },
};

export default async function() {
    console.log('Iniciando prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    // Registramos el tiempo que toma cargar el formulario
    const inicioFormulario = Date.now();

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

    // Calculamos el tiempo total y lo registramos en la métrica personalizada
    const finFormulario = Date.now();

    const tiempoTolat = finFormulario - inicioFormulario;
    tiempoDeFormulario.add(tiempoTolat);// Añadimos el tiempo a la métrica personalizada

    console.log(`Formulario completado en: ${tiempoTolat} ms`);

    await funciones.finalNavegador(navegador, 3000);
}