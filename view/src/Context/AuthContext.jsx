import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequet, getAllTrainersRequest } from '../api/auth.js';

import Cookies from "js-cookie";
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debería estar dentro de un AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            setErrors(error.response.data);
            setLoading(false);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            setIsAuthenticated(true);
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                setErrors(error.response.data)
            } else {
                setErrors([error.response.data.message])
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const Timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(Timer)
        }
    }, [errors])

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
    }

    useEffect(() => {
        async function checkLogin() {
            try {
                const res = await verifyTokenRequet();
                if (!res.data) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    setIsAuthenticated(true);
                    setUser(res.data);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        }
        checkLogin();
    }, []);

    // NUEVO: Obtener todos los trainers
    const getAllTrainers = async () => {
        try {
            setLoading(true);
            const response = await getAllTrainersRequest();
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            loading,
            logout,
            user,
            setUser,
            isAuthenticated,
            errors,
            getAllTrainers // <-- Añadido aquí
        }}>
            {children}
        </AuthContext.Provider>
    )
}