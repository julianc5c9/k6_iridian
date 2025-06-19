import { browser } from 'k6/browser';
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

    try {
        // Interactuamos con el campo nombre
        const nombreSelector = "//input[@id='nombre']";
        await navegador.waitForSelector(nombreSelector, { timeout: 3000, visible: true});
        const nombreTexto = 'Julian';
        await navegador.type(nombreSelector, nombreTexto);
        console.log('Se inserto el nombre: ' + nombreTexto);
        sleep(0.4);
        
    } catch (error) {
       console.error('Hubo un error al interactuar con el campo: Nombre ', error); 
    }

    const apellidoSelector = "//input[@id='apellidos']"; 
    await navegador.waitForSelector(apellidoSelector, { timeout: 3000, visible: true});
    const apellidoTexto = 'Garcia';
    await navegador.type(apellidoSelector, apellidoTexto);
    console.log('Se inserto el apellido: ' + apellidoTexto);
    sleep(0.4);

    const telefonoSelector = "//input[@id='tel']";
    await navegador.waitForSelector(telefonoSelector, { timeout:3000, visible: true});
    const numeroTelefono = 3162356114;
    await navegador.type(telefonoSelector, numeroTelefono);
    console.log('Se inserto el numero de telefono: ' + numeroTelefono);
    sleep(0.4);

    try {
        const emailSelector = "//input[@id='email']";
        await navegador.waitForSelector(emailSelector, { timeout:3000, visible:true});
        const emailTexto = 'julian@iridian.co';
        await navegador.type(emailSelector, emailTexto);
        console.log('Se inserto el email: ' + emailTexto);
        sleep(0.4);
    } catch (error) {
        console.error('Hubo un error al interactuar con el campo: Email', error)
    }

    const direccionSelector = "//input[@id='direccion']";
    await navegador.waitForSelector(direccionSelector, { timeout:3000, visible:true});
    const direccionTexto = 'Carrera 4 # 8-83'
    await navegador.type(direccionSelector, direccionTexto);
    console.log('Se inserto la direccion: ' + direccionTexto);
    sleep(0.4);

    await navegador.waiForTime(3000);
    await navegador.close();
}