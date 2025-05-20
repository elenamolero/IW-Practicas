import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequet } from '../api/auth.js';
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
    const [loading, setloading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            setIsAuthenticated(true);
            setUser(res.data);
          //  window.location.reload();
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message])
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
    }

   useEffect(() => {
    console.log("useEffect de checkLogin ejecutado");
    async function checkLogin() {
        try {
            // No necesitas leer la cookie, solo haz la petición
            const res = await verifyTokenRequet();
            console.log("Respuesta de verifyTokenRequet:", res.data);
            if (!res.data) {
                setIsAuthenticated(false);
                setUser(null);
                setloading(false);
                return;
            }
            setIsAuthenticated(true);
            setUser(res.data);
            setloading(false);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            setloading(false);
        }
    }
    checkLogin();
}, []);

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            loading,
            logout,
            user,
            setUser, // <-- Añadido para poder actualizar el usuario desde otras páginas
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    )
}