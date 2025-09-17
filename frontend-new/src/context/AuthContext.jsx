// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

// 1️⃣ Create context
const AuthContext = createContext(null);

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook (optional but recommended)
export const useAuth = () => useContext(AuthContext);

// 4️⃣ Export context itself too
export { AuthContext };
