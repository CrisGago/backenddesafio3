import express from "express";
import { ProductManager } from "./ProductManager.js";

const PM = new ProductManager("./productos.json");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNumber = limit ? parseInt(limit) : undefined;

        let products = await PM.getProducts();
        if (limitNumber) {
            products = products.slice(0, limitNumber);
        }

        res.send(products);
    } catch (error) {
        console.error("Error al obtener el producdto:", error.message);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

app.get("/", async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const limitNumber = limit ? parseInt(limit) : undefined;

        let products = await PM.getProducts();
        if (limitNumber) {
            products = products.slice(0, limitNumber);
        }

        res.send(products);
    } catch (error) {
        console.error("Error al obtener el producdto:", error.message);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});
// app.get("/", async (req, res) => {
//     try {
//         const { limit } = req.query;
//         let products = await PM.getProducts();

//         if (limit) {
//             products = products.slice(0, limit);
//         }

//         res.send(products);
//     } catch (error) {
//         console.error("Error al obtener productos:", error.message);
//         res.status(500).send({ error: "Error interno del servidor" });
//     }
// });

app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await PM.getProductById(parseInt(pid));
        res.send(product);
    } catch (error) {
        console.error("Error al obtener la ID producto:", error.message);
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});



// Testing
(async () => {
    // 1.- Arreglo vacío
    console.log(await PM.getProducts());

    // 2.- Agrega productos
    await PM.addProduct('modulo1', 'presupuestador', '20000', 'img1', 'sp142', 5);
    await PM.addProduct('modulo2', 'ppto y planif', '45000', 'img2', 'sp143', 15);
    await PM.addProduct('modulo5', 'control', '55000', 'img5', 'sp150', 15);

    console.log(await PM.getProducts());

    // 3.- Probando getProductById - existente y Not found
    try {
        console.log(await PM.getProductById(1));
        await PM.getProductById(3);
    } catch (error) {
        console.error(error.message);
    }

    // 4.- Validando que no se repita el campo "code"
    await PM.addProduct('modulo3', 'control', '5000', 'img3', 'sp143', 20);

    // 5.- Validando que todos los campos son obligatorios. Todos los datos (values) obligatorios
    //await productos.addProduct('modulo4', 'certif', '15000', '', 'sp144', 2);

    try {
        // Mostrar productos antes de las operaciones
        console.log("Productos antes de las operaciones:");
        console.log(await PM.getProducts());

        // 6.- Actualizando producto
        await PM.updateProduct(1, { price: '25000', stock: 10 });
        console.log("Producto actualizado:");
        console.log(await PM.getProductById(1));

        // 7.- Eliminando producto
        //   await PM.deleteProduct(3);
        // console.log("Producto eliminado, lista de productos actualizada:");
        //   console.log(await PM.getProducts());
    } catch (error) {
        console.error(error.message);

    }

})();
