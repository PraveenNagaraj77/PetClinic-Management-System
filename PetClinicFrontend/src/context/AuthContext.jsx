import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialToken = () => localStorage.getItem("token");

  const [token, setToken] = useState(getInitialToken());
  const [user, setUser] = useState(() => {
    try {
      const storedToken = getInitialToken();
      if (storedToken && storedToken.split(".").length === 3) {
        const decoded = jwtDecode(storedToken);
        const role = decoded.roles?.[0]?.replace("ROLE_", "") || "USER";
        return {
          email: decoded.sub,
          role,
          original: decoded,
        };
      }
      return null;
    } catch (error) {
      console.error("Invalid token at startup:", error.message);
      return null;
    }
  });

  const login = (jwt) => {
    if (jwt && jwt.split(".").length === 3) {
      localStorage.setItem("token", jwt);
      setToken(jwt);

      const decoded = jwtDecode(jwt);
      const role = decoded.roles?.[0]?.replace("ROLE_", "") || "USER";

      setUser({
        email: decoded.sub,
        role,
        original: decoded,
      });
    } else {
      console.error("⚠ Invalid JWT token received from backend:", jwt);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.roles?.[0]?.replace("ROLE_", "") || "USER";

        setUser({
          email: decoded.sub,
          name,
          role,
          original: decoded,
        });
      } catch (error) {
        console.error("Invalid token in useEffect:", error.message);
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
