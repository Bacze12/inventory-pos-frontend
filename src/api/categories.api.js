import Api from "./api";

// Llama a create 
export const create = (data) => {
    return Api.post('/categories', data);
}

// Llama a getAll
export const getAll = () => {
    return Api.get('/categories');
}

// Llama a update
// This is how your update function should look like
export const update = (id, data) => {
    try{
        const filteredData = {};
        const allowedFields = ['name', 'description', 'isActive'];
        allowedFields.forEach(field => {
            if(data[field] !== undefined){
            filteredData[field] = data[field];
            }
        });
        const response = Api.patch(`/categories/${id}`, filteredData);
        return response;
    }
    catch(error){
        return error;
    }
  };

// Llama a remove
export const remove = (id) => {
    return Api.delete(`/categories/${id}`);
}