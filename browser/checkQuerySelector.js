import { browser } from 'k6/browser';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';
import { configurarEscenario } from './usuarios.js';
import * as funciones from './funciones.js';

const tiempoCargFormulario = Trend('tiempo_de_formulario');

export const options = {
    scenarios: Object.assign(
        configurarEscenario('escenario1', 2, 2, '5s'),
        configurarEscenario('escenario2', 4, 4, '10s'),
        configurarEscenario('escenario3', 6, 6, '15s') 
    ), 

thresholds: {
    // Threshold para la métrica personalizada
    'tiempo_de_formulario': ['p(95)<8000'],

    //Thresholds por escenario
    'http_req_duration{scenarios:escenario1}': ['p(95)<3000'],
    'http_req_duration{scenarios:escenario2}': ['p(95)<3000'],
    'http_req_duration{scenarios:escenario3}': ['p(95)<3000'],

    // Thresholds estándar
    'http_req_duration': ['p(95)<3000'],  // El 95% de las solicitudes HTTP deben ser menores a 3000ms
    'iteration_duration': ['p(99)<24000'],
    'http_req_failed': ['rate<0.01'],  // Menos del 1% de las solicitudes HTTP deben fallar
    },
};

export default async function() {
    console.log('Iniciando la prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    // Registramos el tiempo que toma cargar el formulario
    const inicioFormulario = Date.now();

    //Validacion del contenido del body
    const bodyContent = await navegador.content();
    check(bodyContent, {
        'El contenido del body esta presente': (body) => body.length > 0,
        'El body contiene el texto: "Direccion': (body) => body.includes('Direccion'), 
    });

    //Validando e interactuando con el campo Nombre
    const nombreVisible = await navegador.$('#nombre');
    check(nombreVisible, {
        'El campo "Nombre" esta visible': (nombre) => nombre !== null, 
    });

    if(nombreVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='nombre']", 'Julian', 'Nombre');
        const nombreValor = await navegador.evaluate(() => document.querySelector('#nombre').value);
        check(nombreValor, {
            'El nombre se inserto correctamente': (nombre) => nombre == 'Julian',
        });
    };

    //Validando e interactuando con el campo Apellido
    const apellidoVisible = await navegador.$("//input[@id='apellidos']");
    check(apellidoVisible, {
        'El campo "Apellido" esta visible': (apellido) => apellido !== null,
    });

    if(apellidoVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='apellidos']", 'Garcia', 'Apellido');
        const apellidoValor = await navegador.evaluate(() => document.querySelector('#apellidos').value);
        check(apellidoValor, {
            'El apellido se inserto correctamente': (apellido) => apellido == 'Garcia',
        }); 
    };

    //Validando e interactuando con el campo Telefono
    const telefonoVisible = await navegador.$("//input[@id='tel']");
    check(telefonoVisible, { 
        'El campo "Telefono" esta visible': (telefono) => telefono !== null,
    });

    if(telefonoVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='tel']", 3162356114, 'Telefono');
        const telefonoValor = await navegador.evaluate(() => document.querySelector('#tel').value);
        check(telefonoValor, {
            'El telefono se inserto correctamente': (telefono) => telefono == 3162356114,
        });
    };

     //Validando e interactuando con el campo Email
    const emailVisible = await navegador.$("//input[@id='email']");
    check(emailVisible, { 
        'El campo "Email" esta visible': (email) => email !== null,
    });

    if(emailVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='email']", 'julian@iridian.co', 'Email');
        const emailValor = await navegador.evaluate(() => document.querySelector('#email').value);
        check(emailValor, {
            'El telefono se inserto correctamente': (email) => email == 'julian@iridian.co',
        });
    };

    //Validando e interactuando con el campo Direccion
    const direccionVisible = await navegador.$("//input[@id='direccion']",);
    check(direccionVisible, { 
        'El campo "Direccion" esta visible': (direccion) => direccion !== null,
    });

    if(direccionVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='direccion']", 'Carrera 4 # 8-83', 'Direccion');
        const direccionValor = await navegador.evaluate(() => document.querySelector('#direccion').value);
        check(direccionValor, {
            'El telefono se inserto correctamente': (direccion) => direccion == 'Carrera 4 # 8-83',
        });
    };

    //Validando e interactuando con el Boton Enviar
    const botonVisible = await navegador.$("//button[@type='submit']");
    check(botonVisible, {
        'El boton "Enviar" esta visible': (boton) => boton !== null,
    });

    if(botonVisible) {
        await funciones.clickBoton(navegador, "//button[@type='submit']", 'Enviar');
        const botonValor = await navegador.evaluate(() => document.querySelector('button[type="submit"]').value);
        check(botonValor, {
            'El boton Enviar se ejecuto correctamente': (boton) => boton == 'Enviar',
        });
    };

    // Calculamos el tiempo total y lo registramos en la métrica personalizada
    const finFormulario = Date.now();
    const tiempoTotal = finFormulario - inicioFormulario;
    tiempoCargFormulario.add(tiempoTotal);

    console.log(`El formulario completado en: ${tiempoTotal} ms`);

    await funciones.finalNavegador(navegador, 3000);
    
};