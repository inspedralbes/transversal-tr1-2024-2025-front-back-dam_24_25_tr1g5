const API_URL = 'http://localhost:3000'; // Cambia el puerto si es necesario

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response:', response); // Muestra la respuesta

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const textResponse = await response.text(); // Obtiene la respuesta como texto

    console.log('Text Response:', textResponse); // Muestra la respuesta como texto

    if (contentType && contentType.includes('application/json')) {
      return JSON.parse(textResponse); // Parseo manual
    } else {
      throw new Error('La respuesta no es un JSON.');
    }
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};



// Obtener productos activados (para usuario)
export const getActivatedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/productUser`);
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
    const response = await fetch(`${API_URL}/product/${id}`);
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
export const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Error adding product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Editar un producto
export const updateProduct = async (id, product) => {
  try {
    const response = await fetch(`${API_URL}/product/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
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
    const response = await fetch(`${API_URL}/product/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting product with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
