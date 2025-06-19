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
    console.log('Inciando la prueba end to end');

    const navegador = await browser.newPage();
    await navegador.goto('https://validaciones.rodrigovillanueva.com.mx/ComboBox_ok.html');

    try {
        // Ejecutamos una función dentro del contexto del navegador para seleccionar la opción
        const comboBoxVisible1 = await navegador.waitForSelector('#comboBox1', { visible: true });
        check(comboBoxVisible1, {
            'El combobox 1 está visible y listo para interactuar': (combo1) => combo1 != null,
        });

        if(comboBoxVisible1) { 
            // Seleccionamos una opción en el ComboBox 1
             await navegador.evaluate(() => {
                const comboBox = document.querySelector('#comboBox1');
                comboBox.value = '1';// Seleccionamos la opción con valor 1 del comboBox 1
                const evento = new Event('change', { bubbles:true }); //Capturo el evento de cambio de comboBox
                comboBox.dispatchEvent(evento); // Disparamos el evento 'change' para simular la selección de la opcion del comboBox 1
            }); 
            // Validamos que la opción correcta fue seleccionada
            const comboBoxValor = await navegador.evaluate(() => {
                return document.querySelector('#comboBox1').value;
            });
            check(comboBoxValor, {
                'La opción seleccionada es correcta': (valor1) => valor1 === '1', // Validamos que el valor seleccionado es la opcion '1' del comboBox
            });
        };
    }
    catch (error) {
        console.error('Error interactuando con el combobox 1:', error);
    };

    try {        
        // Ahora interactuamos con el ComboBox 2 (multi-selección)
        const comboboxVisible2 = await navegador.waitForSelector('#comboBox2', { visible: true });
        check(comboboxVisible2, {
            'El combobox 2 está visible y listo para interactuar': (combo2) => combo2 !== null,
        });

        if (comboboxVisible2) {
            // Seleccionamos múltiples opciones en ComboBox 2
            await navegador.evaluate(() => {
                const combobox2 = document.querySelector('#comboBox2');
                combobox2.options[0].selected = true; // Seleccionamos la primera opción
                combobox2.options[1].selected = true; // Seleccionamos la segunda opción
                combobox2.options[3].selected = true; // Seleccionamos la cuarta opción

                const evento2 = new Event('Change', { bubbles: true });
                comboBox2.dispatchEvent(evento2); // Disparamos el evento 'change' para simular la selección de la opcion del comboBox 2
            });

            // Validamos que las opciones correctas fueron seleccionadas
            const comboBoxValue2 = await navegador.evaluate(() => {
                const selectedOptions = Array.from(document.querySelector('#comboBox2').selectedOptions); //La funcion Array.from convierte los valores en un array 
                return selectedOptions.map(option => option.value);//Funcion map recorre el array
            });

            check(comboBoxValue2, {
                'Las opciones seleccionadas en ComboBox 2 son correctas, opción 1,2,4': (valores) => {
                    return valores.includes('1') && valores.includes('2') && valores.includes('4');
                },
            });
        }
        
    } catch (error) {
        console.error('Error interactuando con el combobox 2:', error);
    };
    sleep(0.4);

    await funciones.finalNavegador(navegador, 3000);
};