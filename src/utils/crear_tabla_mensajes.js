const ContenedorMensajes = require('../utils/ContenedorMensajes');
const optionssqliteDB = require('../options/sqliteDB');

const contenedorMensajes = new ContenedorMensajes(optionssqliteDB);

const messages = [
    {
        email: "juan@gmail.com",
        text: "¡Hola! ¿Que tal?",
        time: "04/03/2022 15:50:22",
    },
    {
        email: "pedro@gmail.com",
        text: "¡Muy bien! ¿Y vos?",
        time: "04/03/2022 15:50:22",
    },
    {
        email: "ana@gmail.com",
        text: "¡Genial!",
        time: "04/03/2022 15:50:22",
    }
];

contenedorMensajes.createTable().then(async () => {
    try {
        await contenedorMensajes.insertMockProducts(messages);
        contenedorMensajes.closeConnection();
    }
    catch (err) {
        console.log("Hubo un error al cargar los productos de prueba: " + err);
    }
});