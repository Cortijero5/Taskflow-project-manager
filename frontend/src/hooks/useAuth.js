import { useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    registerUser,
} from "../services/authService.js";

function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authSubmitting, setAuthSubmitting] = useState(false);
    const [authError, setAuthError] = useState("");
    const [authMode, setAuthMode] = useState("login");

    const [authFormData, setAuthFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Comprueba si hay sesión guardada al cargar la app.
    useEffect(() => {
        async function loadCurrentUser() {
            const token = localStorage.getItem("taskflow_token");

            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                localStorage.removeItem("taskflow_token");
                setCurrentUser(null);
            } finally {
                setAuthLoading(false);
            }
        }

        loadCurrentUser();
    }, []);

    function handleAuthInputChange(event) {
        const { name, value } = event.target;

        setAuthFormData({
            ...authFormData,
            [name]: value,
        });
    }

    async function handleAuthSubmit(event) {
        event.preventDefault();

        setAuthError("");
        setAuthSubmitting(true);

        try {
            if (authMode === "register") {
                await registerUser(authFormData);
            }

            const data = await loginUser({
                email: authFormData.email,
                password: authFormData.password,
            });

            localStorage.setItem("taskflow_token", data.token);
            setCurrentUser(data.user);

            setAuthFormData({
                name: "",
                email: "",
                password: "",
            });
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setAuthSubmitting(false);
        }
    }

    function handleAuthModeChange() {
        setAuthError("");

        setAuthMode((currentMode) =>
            currentMode === "login" ? "register" : "login",
        );
    }

    function logout() {
        localStorage.removeItem("taskflow_token");
        setCurrentUser(null);
        setAuthError("");
        setAuthMode("login");

        setAuthFormData({
            name: "",
            email: "",
            password: "",
        });
    }

    return {
        currentUser,
        authLoading,
        authSubmitting,
        authError,
        authMode,
        authFormData,
        handleAuthInputChange,
        handleAuthSubmit,
        handleAuthModeChange,
        logout,
    };
}

export default useAuth;