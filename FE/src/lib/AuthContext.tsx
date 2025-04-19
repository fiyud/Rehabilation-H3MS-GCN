import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  // Add other user properties as needed
  age?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
}
import { http } from "@/lib"; // Adjust the import path as needed
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        const user = localStorage.getItem("user");
        if (!user) {
          setUser(null);
          return;
        } else {
          const parsedUser = JSON.parse(user as string) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);
  const login = async (name: string, id: string) => {
    setIsLoading(true);
    try {
      const response = await http.post("/login", {
        name,
        id,
      });
      if (response.status !== 200) {
        throw new Error("Login failed");
      }
      const user = response?.data as User;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      if (isAxiosError(error)) {
        setAuthError(error.response?.data.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setAuthError(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    authError,
    setAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
