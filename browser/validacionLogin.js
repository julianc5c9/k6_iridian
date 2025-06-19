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
    await navegador.goto('https://the-internet.herokuapp.com/login');

     //Validacion del contenido del body
    const bodyContent = await navegador.content();
    check(bodyContent, {
        'El contenido del body esta presente': (body) => body.length > 0,
        'El body contiene el texto: "Login Page"': (body) => body.includes('Login Page'), 
    });


    //Validando e interactuando con el campo Nombre "Username"
    const usernameVisible = await navegador.$('#username');
    check(usernameVisible, {
        'Campo "Username" está visible': (username) => username !== null,
    });

    if (usernameVisible) {
        await funciones.interactuarCampo(navegador, '#username', 'tomsmith', 'username');
        const usernameValor = await navegador.evaluate(() => document.querySelector('#username').value);
        check(usernameValor, {
            'El username se ingresó correctamente': (valor) => valor === 'tomsmith',
        });
    }
    sleep(0.4);

    //Validando e interactuando con el campo Nombre "Password"
    const passwordVisible = await navegador.$('#password');
    check(passwordVisible, {
        'Campo "Password" está visible': (password) => password !== null,
    });

    if (passwordVisible) {
        await funciones.interactuarCampo(navegador, '#password', 'SuperSecretPassword!', 'Password');
        const passwordValor = await navegador.evaluate(() => document.querySelector('#password').value);
        check(passwordValor, {
            'El password se ingresó correctamente': (valor) => valor === 'SuperSecretPassword!',
        });
    }
    sleep(0.4);

    // Validación del botón "Login"
    const botonLoginVisible = await navegador.$('button[type="submit"]');
    check(botonLoginVisible, {
        'El botón de "Login" está visible': (btn) => btn !== null,
    });

    if (botonLoginVisible) {
        await funciones.clickBoton(navegador, 'button[type="submit"]');
        
        // Espera a que el mensaje de éxito sea visible
        const successMessage = await navegador.waitForSelector('#flash', { timeout: 5000 });
        check(successMessage, {
            'El mensaje de éxito está visible': (msg) => msg !== null,
        });

        const successText = await navegador.evaluate(() => {
            const mensaje = document.querySelector('#flash').innerText;
            console.log("Texto para comparar y Validar: " + mensaje.trim())
            return mensaje.trim();  // Eliminamos posibles espacios en blanco
        });
        check(successText, {
            // 'El mensaje de éxito es correcto, Validación Ok': (mensaje) => mensaje.includes('You logged into a secure area!'),
            'El mensaje de éxito es correcto, Validación Ok': (mensaje) => mensaje.includes('You logged '),
        });

    };
    sleep(0.4);

    await funciones.finalNavegador(navegador, 3000);
};
