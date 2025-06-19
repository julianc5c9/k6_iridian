import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',// Ejecutamos un número fijo de iteraciones compartidas entre los usuarios virtuales (VUs)
            vus: 10,
            iterations: 20,
            maxDuration: '20s',
            options: {
                browser: {
                    type: 'chromium',
                    launchOptions: {
                        args: ['--disable-crashpad', '--no-sandbox'],// Desactivamos el crashpad para evitar el problema de acceso denegado
                        dataDir: 'C:\Users\JULIAN\Desktop\IRIDIAN\CURSOS\k6\browser',//Directorio personalizado 
                    },
                },
            },
        },
    },
    thresholds: {
        checks: ['rate==1.0'], 
    },
}; 

export default async function() {
    const navegador = await browser.newPage();// Creamos una nueva página en el navegador
    await navegador.goto('https://test.k6.io/');// Navegamos a la URL deseada

    // Capturamos el título de la página y lo mostramos en la consola
    const titulo = await navegador.title();
    console.log(`Titulos de la pagina: ${titulo}`);

    // Verificamos si el título de la página es el esperado
    const tituloEsperado = 'QuickPizza'//Asignamos el titulo a una constante 
    check(titulo, {
        'El titulo es correcto': (t) => t === tituloEsperado,
    }); 

    await navegador.close(); 
}