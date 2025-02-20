import API from "./api";


// Llamado a crear un inventario
export const createInventory = async (inventory) => {
    try {
        const response = await API.post('/inventory', inventory);
        return response.data;
    } catch (err) {
        throw new Error('No se pudo crear el movimiento de inventario.');
    }
    };
    
// Llamado a all inventories
export const getInventory = async () => {
    try {
        const response = await API.get('/inventory');
        return response.data;
    } catch (err) {
        throw new Error('No se pudo cargar el inventario.');
    }
    };

// Llamado a un solo inventario
export const getInventoryById = async (id) => {
    try {
        const response = await API.get(`/inventory/${id}`);
        return response.data;
    } catch (err) {
        throw new Error('No se pudo cargar el movimiento de inventario.');
    }
    };