const API_URL = import.meta.env.VITE_URL_BACK; // Cambia el puerto si es necesario

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}product`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', // Esperamos recibir JSON
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los productos'); // Lanza error si la respuesta no es exitosa
    }

    const data = await response.json(); // Convertimos la respuesta a JSON
    console.log('Datos recibidos:', data); // Imprime en la terminal los datos recibidos

    return data; // Retorna los datos
  } catch (error) {
    console.error('Error al obtener los productos:', error); // Imprime el error en la terminal
    throw error; // Propaga el error para manejo posterior
  }
};

// Obtener productos activados (para usuario)
export const getActivatedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}productUser`);
    if (!response.ok) {
      throw new Error('Error fetching activated products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching activated products:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}productUser/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching product with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Añadir un producto
export const addProduct = async (product, image) => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price);
  formData.append('categoryId', product.categoryId);
  formData.append('image', image);
  formData.append('activated', product.activated);
  formData.append('stock', product.stock);
  formData.append('size', product.size);
  formData.append('color', product.color);
  try {
    const response = await fetch(`${API_URL}product`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok || !response.status === 201) {
      throw new Error('Error adding product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Editar un producto
export const updateProduct = async (id, product, image) => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price);
  formData.append('categoryId', product.categoryId);
  formData.append('image', image);
  formData.append('activated', product.activated);
  formData.append('stock', product.stock);
  formData.append('size', product.size);
  formData.append('color', product.color);
  try {
    const response = await fetch(`${API_URL}product/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok || !response.status === 200) {
      throw new Error(`Error updating product with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}product/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok || !response.status === 200) {
      throw new Error(`Error deleting product with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

//Recibir todas las categorías
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}category`);
    if (!response.ok) {
      throw new Error('Error fetching categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Recibir todos los comandos
export const getAllCommands = async () => {
  try {
    const response = await fetch(`${API_URL}orders`);
    if (!response.ok) {
      throw new Error('Error fetching commands');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching commands:', error);
    throw error;
  }
};

// Recibir un comando por ID
export const getCommandById = async (id) => {
  try {
    const response = await fetch(`${API_URL}orders/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching command with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching command with ID ${id}:`, error);
    throw error;
  }
};

// Editar un comando
export const updateCommand = async (id, command) => {
  try {
    const response = await fetch(`${API_URL}orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!response.ok || !response.status === 200) {
      throw new Error(`Error updating command with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating command with ID ${id}:`, error);
    throw error;
  }
};