import { browser } from 'k6/browser';
import { sleep, check } from 'k6';
import { configurarEscenario } from './usuarios.js';
import { Trend, trend } from 'k6/metrics';
import * as funciones from './funciones.js';

const tiempoCargaFormulario = Trend('tiempo_de_formulario')

export const options = {
    scenarios: Object.assign(
        configurarEscenario('escenario1', 3, 3, '10s'),
        configurarEscenario('escenario2', 5, 5, '20s'),
        configurarEscenario('escenario3', 7, 7, '30s')
    ), 
    thresholds: {
        // Threshold para la métrica personalizada
        'tiempo_de_formulario': ['p(95)<8000'],

        //Thresholds por escenario
        'http_req_duration{scenarios:escenario1}': ['p(95)<3000'],
        'http_req_duration{scenarios:escenario2}': ['p(95)<3000'],
        'http_req_duration{scenarios:escenario3}': ['p(95)<3000'],

        'iteration_duration{scenarios:escenario1}': ['p(99)<9000'],
        'iteration_duration{scenarios:escenario2}': ['p(99)<9000'],
        'iteration_duration{scenarios:escenario3}': ['p(99)<9000'],

        // Thresholds estándar
        'http_req_duration': ['p(95)<3000'],  // El 95% de las solicitudes HTTP deben ser menores a 3000ms
        'iteration_duration': ['p(99)<24000'],
        'http_req_failed': ['rate<0.01'],  // Menos del 1% de las solicitudes HTTP deben fallar
    },
};

export default async function() {
    console.log('Iniciando prueba end to end ');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    // Registramos el tiempo que toma cargar el formulario
    const inicioFormulario = Date.now();

    //Validacion del contenido del body 
    const bodyContent = await navegador.content();
    check(bodyContent, {
        'El contenido del body esta presente': (body) => body.length > 0,
        'El body contiene el texto': (body) => body.includes('Direccion'),
    }); 

    //Validando e interactuando con el campo Nombre
    const nombreVisible = await navegador.$('#nombre');
    check(nombreVisible, {
        'El campo "Nombre" esta presente': (nombre) => nombre !== null,
    });

    if(nombreVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='nombre']", 'Julian', 'Nombre');
    };
    sleep(0.2);

    //Validando e interactuando con el campo Apellido
    const apellidoVisible = await navegador.$('#apellidos');
    check(apellidoVisible, {
        'El campo "Apellido" esta presente': (apellido) => apellido !== null,
    });

    if(apellidoVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='apellidos']", 'Garcia', 'Apellido');
    }
    sleep(0.2);

    // Calculamos el tiempo total y lo registramos en la métrica personalizada
    const finalFormulario = Date.now();
    const totalFormulario = finalFormulario - inicioFormulario;
    tiempoCargaFormulario.add(totalFormulario);
    
    console.log(`El formulario completado en: ${tiempoTotal} ms`);

    await funciones.finalNavegador(navegador, 3000);
}; 