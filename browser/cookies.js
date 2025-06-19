import { browser } from 'k6/browser';
import { sleep, check } from 'k6';
import { configurarEscenario } from './usuarios.js';
import * as funciones from './funciones.js';

export const options = { 
    scenarios: Object.assign( 
        configurarEscenario('escenario1', 1, 1, '10s'), 
        configurarEscenario('escenario2', 2, 2, '20s'), 
        configurarEscenario('escenario3', 3, 3, '30s') 
    ),
    thresholds: {
        'http_req_failed': ['rate<0.01'],  
        'http_req_duration{scenario:escenario1}': ['p(95)<2500'],  
        'http_req_duration{scenario:escenario2}': ['p(95)<7000'],  
    }, 
}; 

export default async function() {
    console.log('Iniciando prueba end to end');

    const navegador = await browser.newPage();

     try {
        await navegador.goto('https://the-internet.herokuapp.com/login');

        // Validamos que el botón de login esté presente
        const botonLogin = await navegador.waitForSelector('button[type="submit"]', { visible: true });
        check(botonLogin, {
            'El botón de login está presente': (boton) => boton !== null,
        });

        // Paso 1: Ingresamos los credenciales
        await navegador.type('#username', 'tomsmith'); // Usuario de prueba
        await navegador.type('#password', 'SuperSecretPassword!'); // Contraseña de prueba
        await navegador.click('button[type="submit"]'); // Iniciar sesión

        // Esperamos a que la página cargue
        await navegador.waitForTimeout(3000);

        // Validamos que el login fue exitoso
        const mensajeOK = await navegador.locator('#flash').textContent();
        check(mensajeOK, {
            'Inicio de sesión exitoso': (mensaje) => mensaje.includes('You logged into a secure area!'),
        }); 

        // Capturamos las cookies de sesión
        const cookies = await navegador.context().cookies();
        check(cookies, {
            'Cookies de sesión obtenidas': (cookies) => cookies.length > 0,
        });

        console.log('Cookies obtenidas:', JSON.stringify(cookies));//Imprime en consola todas las Cookies 

        // En lugar de cerrar el navegador, usamos el mismo para acceder a la página protegida
        console.log('Usuario ha iniciado sesion');

        // Usamos el mismo navegador sin cerrarlo
        await navegador.goto('https://the-internet.herokuapp.com/secure');

        // Validamos que hemos accedido a la página protegida
        const secureAreaText = await navegador.locator('h2').textContent();
        check(secureAreaText, {
            'Acceso a la página protegida': (texto) => texto.includes('Secure Area'),
        });

        await funciones.finalNavegador(navegador, 3000);

     } catch (error) {
        console.error('Error interactuando con la página de login:', error);
     }
     sleep(0.5);
}