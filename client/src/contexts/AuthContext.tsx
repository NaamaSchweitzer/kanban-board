import {
  createContext,
  useState,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import * as authApi from "../api/auth";
import * as usersApi from "../api/users";
import type { User } from "../types/auth";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (data: { username?: string; email?: string }) => Promise<void>;
  deleteUser: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const saveSession = (userData: User, tokenValue: string) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    saveSession(result.user, result.token);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const result = await authApi.register({ username, email, password });
    saveSession(result.user, result.token);
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = async (data: { username?: string; email?: string }) => {
    if (!user) return;
    const updated = await usersApi.updateUser(user._id, data);
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const deleteUser = async () => {
    if (!user) return;
    await usersApi.deleteUser(user._id);
    clearSession();
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return;
    await usersApi.changePassword(user._id, { oldPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        deleteUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
