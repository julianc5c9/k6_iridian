export function configurarEscenario(nombre, vus, iteraciones, maxDuration) {
    return {
        [nombre]: {  // Usamos el nombre del escenario dinámicamente
            executor: 'shared-iterations',  // Ejecutamos un número fijo de iteraciones compartidas entre los usuarios virtuales (VUs)
            vus: vus,  // Definimos los VUs pasados como parámetro
            iterations: iteraciones,  // Número total de iteraciones
            maxDuration: maxDuration,  // Duración máxima pasada como parámetro
            options: {
                browser: {
                    type: 'chromium',  // Usamos Chromium
                    launchOptions: {
                        headless: false,  // Desactivamos el modo headless para abrir el navegador
                        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',  // Ruta al ejecutable de Chrome
                        args: [
                            '--disable-crashpad',
                            '--no-sandbox',
                            '--start-maximized',  // Abre el navegador en modo maximizado
                            '--disable-gpu',  // Ejecuta sin aceleración de hardware
                            '--disable-extensions'  // Deshabilita las extensiones del navegador
                        ],
                        dataDir: 'C:\\Users\\Rodrigo\\Documents\\K6_Temp_Nuevo',  // Directorio temporal personalizado
                        devtools: true,  // Abre las DevTools para depuración
                        slowMo: 200  // Reduce la velocidad de las acciones para observarlas mejor (en milisegundos)
                    },
                },
            },
        },
    };
}