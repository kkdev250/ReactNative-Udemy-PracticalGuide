import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://rm-complete-guide-a6d71-default-rtdb.europe-west1.firebasedatabase.app/products.json'
      );

      if (!response.ok) { //fetch api don't throw an error if response is !200 - but response.ok is false
        throw new Error('Something went wrong!'); //now the catch block also fires for 400, 500's
      }

      const resData = await response.json();
      loadedProducts = [];
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      };
      /*return { //doesn't work - async action creator in the end has to dispatch sync action, not return it!
        type: SET_PRODUCTS,
        products: loadedProducts,
      };*/
       dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId),
      });
    } catch (err) {
      //do something - e.g. send error to custom analytics server
      throw err; //re-throw the error
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rm-complete-guide-a6d71-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
      { 
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch ({
      type: DELETE_PRODUCT,
      pid: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price ) => {
  return async (dispatch, getState) => {
    //async code here...:
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch( //firebase url format: db_url/node_name.json
      `https://rm-complete-guide-a6d71-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`, 
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    const resData = await response.json();
    //...then dispatching sync action:
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name, //resData.name - firebase object id
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      },
    });
  }
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rm-complete-guide-a6d71-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
      { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch ({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};