export async function interactuarCampo(navegador, selectorCampo, textoCampo, nombreCampo) {
    try {
        await navegador.waitForSelector(selectorCampo, { timeout: 3000, visible: true});
        await navegador.type(selectorCampo, textoCampo);
        console.log(`Se inerto el texto en el campo: ${nombreCampo} : ${textoCampo}`);
    } catch (error) {
        console.error(`Hubo un error al interactuar con el campo: ${nombreCampo}`, error); 
    }
}

export async function clickBoton(navegador, botonSelector, nombreBoton) {
    try {
    await navegador.waitForSelector(botonSelector, { timeout: 3000, visible:true});
    await navegador.click(botonSelector);
    console.log(`Se hizo click en el boton: ${nombreBoton}`)
    } catch (error) {
        console.error(`Hubo un error al hacer click en el boton: ${nombreBoton}`);
    }
}

export async function finalNavegador(navegador, time) {
    console.log('Prueba finalizda');
    await navegador.waitForTimeout(time);
    await navegador.close();
}