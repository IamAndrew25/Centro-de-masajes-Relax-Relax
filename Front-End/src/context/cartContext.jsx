import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para añadir un item al carrito
  const addToCart = (item) => {
    // Comprobamos si el item ya existe
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (isItemInCart) {
        // De momento, solo evitamos duplicados
        alert(`${item.name || item.title} ya está en el carrito.`);
        return prevItems;
      } else {
        // Añadir nuevo item
        alert(`${item.name || item.title} ha sido añadido al carrito!`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
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
    // Aseguramos que el precio sea un numero y no una cadena
    const priceString = String(item.price).replace('S/ ', '');
    const price = parseFloat(priceString);
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