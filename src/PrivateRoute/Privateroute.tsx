import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
    const isAuthenticated = () => {
        const tokenData = localStorage.getItem('token');
        if (!tokenData) return false;

        try {
            const { token, expiresAt } = JSON.parse(tokenData);
            return token && Date.now() < expiresAt;
        } catch {
            return false;
        }
    };

    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;