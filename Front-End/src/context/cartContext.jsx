import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para añadir un item al carrito
  const addToCart = (item) => {
    const isItemInCart = cartItems.find(cartItem => cartItem.id === item.id);

    if (isItemInCart) {
      toast.warn(`${item.name || item.title} ya está en el carrito.`);
      return; 
    }
    
    toast.success(`${item.name || item.title} ha sido añadido al carrito!`);
    setCartItems(prevItems => {
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Función para eliminar un item del carrito
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculamos el total de items, el badge
  const cartItemCount = cartItems.length;

  // Calculamos el precio total
  const totalCartPrice = cartItems.reduce((total, item) => {
    
    const rawPrice = item.precio !== undefined ? item.precio : item.price;
    
    if (rawPrice === undefined || rawPrice === null) {
      return total; // Si no hay precio, no sumar nada
    }

    const priceString = String(rawPrice).replace('S/ ', '');
    const price = parseFloat(priceString);

    if (isNaN(price)) {
      return total;
    }

    return total + (price * item.quantity);
  }, 0);


  //Pasamos el estado y las funciones al Provider
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartItemCount,
    totalCartPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};