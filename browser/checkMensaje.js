import { browser } from 'k6/browser';
import { sleep, check } from 'k6';
import { configurarEscenario } from './usuarios.js';
import * as funciones from './funciones.js';

export const options = {
    scenarios: Object.assign(
        configurarEscenario('escenario1', 2, 2, '10s'),
        configurarEscenario('escenario2', 4, 4, '20s')
    ),
    thresholds: {
        // Thresholds estándar
    'http_req_duration': ['p(95)<3000'],  
    'iteration_duration': ['p(99)<24000'],
    'http_req_failed': ['rate<0.01'],
    },
}; 

export default async function() {
    console.log('Iniciando prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

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
    sleep(0.2);

    //Validando e interactuando con el campo Apellido
    const apellidoVisible = await navegador.$("//input[@id='apellidos']");
    check(apellidoVisible, {
        'El campo "Apellido" esta visible': (apellido) => apellido !== null,
    });

    if(apellidoVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='apellidos']", 'Garcia', 'Apellido');
        const apellidoValor = await navegador.evaluate(() => document.querySelector('#apellidos').value);
        check(apellidoValor, {
            'El apellido se inserto correctamente': (apellido) => apellido === 'Garcia',
        }); 
    };
    sleep(0.2);
    
    //Validando e interactuando con el campo Telefono
    const telefonoVisible = await navegador.$("//input[@id='tel']");
    check(telefonoVisible, { 
        'El campo "Telefono" esta visible': (telefono) => telefono !== null,
    });

    if(telefonoVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='tel']", '3162356114', 'Telefono');
        const telefonoValor = await navegador.evaluate(() => document.querySelector('input#tel').value);
        check(telefonoValor, {
            'El telefono se inserto correctamente': (telefono) => telefono == '3162356114',
        });
    };
    sleep(0.2);

    //Validando e interactuando con el campo Email
    const emailVisible = await navegador.$("//input[@id='email']");
    check(emailVisible, { 
        'El campo "Email" esta visible': (email) => email !== null,
    });

    if(emailVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='email']", 'julian@iridian.co', 'Email');
        const emailValor = await navegador.evaluate(() => document.querySelector('#email').value);
        check(emailValor, {
            'El telefono se inserto correctamente': (email) => email === 'julian@iridian.co',
        });
    };
    sleep(0.2);

    //Validando e interactuando con el campo Direccion
    const direccionVisible = await navegador.$("//input[@id='direccion']",);
    check(direccionVisible, { 
        'El campo "Direccion" esta visible': (direccion) => direccion !== null,
    });

    if(direccionVisible) {
        await funciones.interactuarCampo(navegador, "//input[@id='direccion']", 'Carrera 4 # 8-83', 'Direccion');
        const direccionValor = await navegador.evaluate(() => {
            document.querySelector('#direccion').value});
        check(direccionValor, {
            'El telefono se inserto correctamente': (direccion) => direccion === 'Carrera 4 # 8-83',
        });
    };
    sleep(0.2);

    //Validando e interactuando con el Boton Enviar
    const botonVisible = await navegador.$("//button[@type='submit']");
    check(botonVisible, {
        'El boton "Enviar" esta visible': (boton) => boton !== null,
    });

    if(botonVisible) {
        await funciones.clickBoton(navegador, "//button[@type='submit']", 'Enviar');
        
        //Validamos que el formulario se envio correctamente 
        const confimacionVisible = await navegador.$("div#flashMessage.alert.alert-success.mt-3");
        const confimacionTexto = await navegador.evaluate(() => {
            const mensaje = document.querySelector("div#flashMessage.alert.alert-success.mt-3").innerHTML;
            //console.log('Mensaje de validacion' + mensaje)
            console.log('Mensaje de confirmacion con trim' + mensaje.trim());
            return mensaje.trim();//Usamos trim() para eliminar espacios en blanco 
        });

        check(confimacionVisible, {
            'El mensaje de confirmacion esta visible': (mensaje) => mensaje !== null,
        });

        check(confimacionTexto, {
            'El mensaje de confirmacion es correcto': (mensaje) => mensaje === 'El formulario se ha enviado correctamente.',
        });
    };
    sleep(0.2);

    await funciones.finalNavegador(navegador, 3000);
};