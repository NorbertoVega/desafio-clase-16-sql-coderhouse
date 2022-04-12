const express = require('express');
const moment = require('moment');
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const ContenedorProductos = require('./utils/ContenedorProductos');
const ContenedorMensajes = require('./utils/ContenedorMensajes.js');
const optionsMariaDB = require('./options/mariaDB');
const optionsSqliteDB = require('./options/sqliteDB');

const app = express();
const router = require('./router/productos')
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('./public'))

const renderAllMessages = async (socket) => {
    const contenedorMensajes = new ContenedorMensajes(optionsSqliteDB);
    const messages = await contenedorMensajes.getAll();
    contenedorMensajes.closeConnection();
    io.sockets.emit("render-all-messages", messages);
}

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado.");

    socket.on('add-new-product', async data => {
        const contenedorProductos = new ContenedorProductos(optionsMariaDB);
        const id = await contenedorProductos.save(data);
        if (id !== -1) {
            const newProduct = await contenedorProductos.getById(id);
            io.sockets.emit('render-new-product', JSON.parse(JSON.stringify(newProduct))[0]);
            contenedorProductos.closeConnection();
        }
    });

    renderAllMessages(socket);

    socket.on('add-new-message', data => {
        const now = moment();
        data = { ...data, time: now.format("D/MM/YYYY h:mm:ss") }
        const contenedorMensajes = new ContenedorMensajes(optionsSqliteDB);
        contenedorMensajes.save(data)
            .then(() => {
                contenedorMensajes.closeConnection();
                renderAllMessages(socket);
            })
            .catch((error) => {
                console.log(`Error al cargar mensajes: ${error}`)
            });
    });
});

app.use('/api', router);

module.exports = httpServer;

