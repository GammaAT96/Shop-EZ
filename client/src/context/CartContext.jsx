import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userInfo } = useAuth();
    const [cart, setCart] = useState(null);

    const fetchCart = async () => {
        if (!userInfo) {
            setCart(null);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/cart', config);
            setCart(data);
        } catch (error) {
            console.error("Cart fetch error", error);
            setCart(null);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userInfo]);

    return (
        <CartContext.Provider value={{ cart, fetchCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
