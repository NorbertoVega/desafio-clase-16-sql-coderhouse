const { Router } = require('express');
const ContenedorProductos = require('../utils/ContenedorProductos');
const optionsMariaDB = require('../options/mariaDB');

const router = Router();

router.get('/tableProd', async (req, res) => {
    try {
        const contenedorProductos = new ContenedorProductos(optionsMariaDB);
        const allProducts = await contenedorProductos.getAll();
        contenedorProductos.closeConnection();
        res.render('table', { productList: allProducts, emptyList: allProducts.length === 0 });
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;