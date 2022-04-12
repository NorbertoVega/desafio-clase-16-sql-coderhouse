const knex = require('knex');

class ContenedorMensajes {

    constructor(config) {
        this.config = config;
        this.knex = knex(config);
    }

    async createTable() {
        try {
            await this.knex.schema.createTable('mensajes', table => {
                table.increments('id');
                table.string('email');
                table.string('time');
                table.string('text');
            });
            console.log('Tabla mensajes creada.');
        }
        catch (err) {
            console.log("Error al crear tabla: " + err);
        }
    }

    async insertMockProducts(messagesList) {
        try {
            await this.knex('mensajes').insert(messagesList);
            console.log('Mensajes agregados');
        }
        catch (err) {
            console.log(err);
        }
    }

    closeConnection() {
        this.knex.destroy();
    }

    async getAll() {
        try {
            const allMessages = await this.knex.from('mensajes').select('*');
            return allMessages;
        }
        catch (err) {
            console.log(err);
        }
    }

    async save(message) {
        try {
            const id = await this.knex.from('mensajes').insert(message);
            return id[0];
        }
        catch (err) {
            console.log(err);
            return -1;
        }
    }
}

module.exports = ContenedorMensajes;

