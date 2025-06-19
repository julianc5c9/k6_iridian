import { browser } from 'k6/browser';
import { sleep, check } from 'k6';
import { configurarEscenario } from './usuarios.js';   
import * as Funciones from './funciones.js'; 

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
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/ComboBox_ok.html');

    try {
        // Esperamos a que el combobox esté listo para interactuar
        const comboBoxVisible = await navegador.waitForSelector('#comboBox1', { visible: true });
        check(comboBoxVisible, {
            'El combobox está visible y listo para interactuar': (combo) => combo != null,
        });

        if(comboBoxVisible) {
            // Ejecutamos una función dentro del contexto del navegador para seleccionar la opción
            await navegador.evaluate(() => {
                const comboBox = document.querySelector('#comboBox1');
                comboBox.value = '1';// Seleccionamos la opción con valor 1 del comboBox
                const evento = new Event('change', { bubbles:true}); //Capturo el evento de cambio de comboBox
                comboBox.dispatchEvent(evento); // Disparamos el evento 'change' para simular la selección de la opcion del comboBox
            }); 
            // Validamos que la opción correcta fue seleccionada
            const comboBoxValor = await navegador.evaluate(() => {
                return document.querySelector('#comboBox1').value;
            }); 
            check(comboBoxValor, {
                'La opción seleccionada es correcta': (valor) => valor === '1', // Validamos que el valor seleccionado es la opcion '1' del comboBox
            });
        }
    } catch (error) {
        console.error('Error interactuando con el combobox:', error);
    }
    sleep(0.4);

    await funciones.finalNavegador(navegador, 3000);
}; 