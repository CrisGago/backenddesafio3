import fs from "fs/promises";

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.initialize();
    }

    static id = 0;


    async initialize() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error("Error al leer", error.message);
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar en el archivo:", error.message);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            await this.initialize();

            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].code === code) {
                    console.log(`El código ${code} ya existe`);
                    return;
                }
            }

            const newProduct = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            if (!Object.values(newProduct).every(value => value !== undefined && value !== null && value !== "")) {
                console.log("Completar todos los campos obligatorios");
                return;
            }

            ProductManager.id++;
            this.products.push({
                ...newProduct,
                id: ProductManager.id,
            });

            await this.saveToFile();
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
        }
    }

    async getProducts() {
        try {
            await this.initialize();
            return this.products;
        } catch (error) {
            console.error("Error al obtener productos:", error.message);
            return [];
        }
    }

    async getProductById(id) {
        try {
            await this.initialize();
            const product = this.products.find((producto) => producto.id === id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error.message);
            throw error;
        }
    }

    // async updateProduct(id, updateFields) {
    //     try {
    //         await this.initialize();
    //         const index = this.products.findIndex((producto) => producto.id === id);
    //         if (index === -1) {
    //             throw new Error("Producto no encontrado");
    //         }
    //         this.products[index] = {
    //             ...this.products[index],
    //             ...updateFields,
    //             id: this.products[index].id,
    //         };
    //         await this.saveToFile();
    //     } catch (error) {
    //         console.error("Error actualizar el producto:", error.message);
    //         throw error;
    //     }
    // }
    async deleteProduct(id) {
        try {
            await this.initialize();
            const index = this.products.findIndex((producto) => producto.id === id);

            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            this.products.splice(index, 1);

            await this.saveToFile();
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            throw error;
        }
    }

}



