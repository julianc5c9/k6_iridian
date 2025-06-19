import {browser} from 'k6/browser';
import { sleep } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 10,
            maxDuration: '30s',
            options: {
                browser: {
                    type: 'chromium',
                    launchOptions: {
                        headless: true,
                        executablePatch: 'C:\Program Files\Google\Chrome\Application\chrome.exe',// Ruta al ejecutable de Chrome
                         args: [
                            '--disable-crashpad',
                            '--no-sandbox',
                            '--start-maximized',// Abre el navegador en modo maximizado
                            '--disable-gpu',// Ejecuta sin aceleración de hardware
                            '--disable-extensions'// Deshabilita las extensiones del navegador
                        ],
                        dataDir: 'C:\Users\JULIAN\Desktop\IRIDIAN\CURSOS\k6\browser',//Directorio personalizado 
                        devTools: true,// Abre las DevTools para depuración
                        slowMo: 500// Reduce la velocidad de las acciones para observarlas mejor (en milisegundos)
                    },
                },
            },
        },
    },
    thresholds: {
        checks: ['rate==1.0'],
    }
};

export default async function() {
    console.log('Iniciando prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    // Interactuamos con el campo nombre
    const nombreSelector = '#nombre';
    await navegador.waitForSelector(nombreSelector, { timeout: 3000, visible: true});
    const nombreTexto = 'Julian';
    await navegador.type(nombreSelector, nombreTexto);
    sleep(0.4);
    console.log(`Se inserto el nombre: ${nombreTexto}`);

    //Interactuamos con el campo apellido 
    const apellidoSelector = '#apellidos';
    await navegador.waitForSelector(apellidoSelector, { timeout:3000, visible:true});
    const apellidoTexto = 'Garcia';
    await navegador.type(apellidoSelector, apellidoTexto);
    sleep(0.4);
    console.log(`Se inserto el apellido: ${apellidoTexto}`); 

    //Interactuamos con el campo telefono 
    const telefonoSelector = '#tel';
    await navegador.waitForSelector(telefonoSelector, { timeout:3000, visible:true});
    const numeroTelefono = 3162356114;
    sleep(0.4);
    console.log(`Se inserto el telefono: ${numeroTelefono}`); 

    await navegador.waitForTimeout(3000);

    await navegador.close();
};