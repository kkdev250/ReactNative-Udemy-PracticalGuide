import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
  items: {}, // format: {id_prod_x: {CartItemObj}, id_prod_y: {CartItemObj}...}
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: 
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      const pushToken = addedProduct.pushToken;

      let updatedOrNewCartItem;
      if (state.items[addedProduct.id]) { // already have the product in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          pushToken,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else { // new product, not existing in the cart yet
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, pushToken, prodPrice);
      }
      return {
        ...state,
        items: {...state.items, [addedProduct.id]: updatedOrNewCartItem},
        totalAmount: state.totalAmount + prodPrice,
      };

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid]
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) { // need to reduce product's quantity
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = {
          ...state.items,
          [action.pid]: updatedCartItem,
        };
      } else { // need to erase product from cart
        updatedCartItems = {...state.items};
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };

    case ADD_ORDER: //clearing the cart after placing an order
      return initialState; 

    case DELETE_PRODUCT: 
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = {...state.items};
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  
  return state;
}
