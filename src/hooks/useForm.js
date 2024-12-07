import { useState } from 'react';

/**
 * Hook personalizado para manejar formularios.
 * @param {Object} initialValues - Valores iniciales del formulario.
 * @param {Function} validate - Función para validar los campos del formulario.
 */
const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /**
   * Maneja el cambio de valor de los campos.
   * @param {Object} event - Evento del campo de entrada.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (validate) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors(validationErrors);
    }
  };

  /**
   * Reinicia los valores del formulario a los valores iniciales.
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  /**
   * Maneja el envío del formulario.
   * @param {Function} callback - Función a ejecutar al enviar el formulario.
   * @returns {Function} Una función que maneja el evento de envío.
   */
  const handleSubmit = (callback) => (event) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useForm;
