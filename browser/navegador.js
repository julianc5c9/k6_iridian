import { browser } from 'k6/browser';
import { check } from 'k6';

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
    console.log('Iniciando prueba de navegador'); 

    const navegador = await browser.newPage(); 
    await navegador.goto('https://test.k6.io/');

    const titulo = await navegador.title(); 
    console.log(`El titulo de la pagina es: ${titulo}`);

    const tituloEsperado = 'QuickPizza'; 
    const checkTitle = check(titulo, {
        'El titulo es correcto': (t) => t === tituloEsperado,
    });

    console.log(`El titulo es correcto: ${checkTitle}`);

    if(!checkTitle) {
        console.error('Error: El titulo de la pagina no coincide con lo esperado'); 
    }

    //Agregar un pequeño retraso para observar el navegador 
    await navegador.waitForTimeout(3000);

    await navegador.close();
}