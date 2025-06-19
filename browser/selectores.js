import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations', 
            vus: 5,
            iterations: 5,
            maxDuration: '30s',
            options: {
                browser: {
                    type: 'chromium',
                    launchOptions: {
                        headless: true,// Desactivamos el modo headless para abrir el navegador
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
        checks: ['rate == 1.0'], 
    },
};

export default async function() {
    console.log('Iniciandon prueba de navegador');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/index.html');

    // Interactuamos con el campo "Nombre"

    //esta es otra manera de declarar las variables y procesos para interactuar con elementos
    /*const nombreSelector = '#nombre';
    await navegador.waitForSelector(nombreSelector);
    const nombreTexto = 'Julian';
    await navegador.type(nombreSelector, nombreTexto);
    sleep(4.0);
    console.log('Se inserto: ' + nombreTexto);
    console.log(`Se inbserto: ${nombreTexto}`);//Otra forma de inmprimir en consola*/

    await navegador.type('#nombre', 'Julian');
    sleep(0,4);
    console.log('Se inserto el nombre: ' + 'Julian'); 

    //Interactuamos con el campo apellido 
    await navegador.type('#apellidos', 'Garcia');
    sleep(0.4);
    console.log('Se inserto el apellido: ' + 'Garcia');

    //Interactuamos con el telefono 
    await navegador.type('#tel', 3162356114);
    sleep(0.4);
    console.log('Se inserto el numero de telefono: ' + 3162356114); 

    await navegador.waitForTimeout(3000);

    await navegador.close(); 
}