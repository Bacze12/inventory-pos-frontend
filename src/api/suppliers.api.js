import Api from './api';

// Llama a create (Incorporado)
export const create = (data) => {
    return Api.post('/suppliers', data);
}

// Llama a getAll (Incorporado)
export const getAll = () => {
    return Api.get('/suppliers');
}

// Llama a getid (No incorporado)
export const getById = (id) => {
    return Api.get(`/suppliers/${id}`);
}
// Llama a update (corregido)
export const update = async (id, data) => {
    try {
        // Crear una copia del objeto sin los campos problemáticos
        const filteredData = {};
        
        // Solo incluir campos permitidos
        const allowedFields = ['name', 'email', 'phone', 'address', 'isActive', 'products'];
        
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                filteredData[field] = data[field];
            }
        });
        
        const response = await Api.patch(`/suppliers/${id}`, filteredData);
        return response;
    } catch (error) {
        
        return error;
    }
};

// Llama a remove (Incorporado)
export const remove = (id) => {
    return Api.delete(`/suppliers/${id}`);
}