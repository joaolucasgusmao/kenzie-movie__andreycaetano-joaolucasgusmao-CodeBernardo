import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

interface IAuthContextState {
  token: ITokenState | null;
  signIn({ email, password }: IUserData): Promise<void>;
  userLogged(): boolean;
  userRegister({ email, password, name }: IRegisterUser): Promise<void>;
  useUser: Function
}

interface IUserData {
  email: string;
  password: string;
}

interface IRegisterUser extends IUserData {
  name: string;
}

interface ITokenState {
  token: string;
}

interface IInputProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextState>({} as IAuthContextState);

export const AuthProvider: React.FC<IInputProps> = ({ children }) => {
  // const navigate = useNavigate();
  const [token, setToken] = useState<ITokenState | null> (() => {
    const token = localStorage.getItem("@KenzieMovie:token");

    if (token) {
      return { token };
    }

      return null
  });

  const userRegister = useCallback(
    async ({ email, password, name }: IRegisterUser) => {
      try {
        await api.post("/users", {
          email,
          password,
          name,
        });
        // navigate("/login");
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const signIn = useCallback(async ({ email, password }: IUserData) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem("@KenzieMovie:token", token);
      // navigate("/");
    } catch (error) {
      console.error(error);
    }
  }, []);

  const userLogged = useCallback(() => {
    const token = localStorage.getItem("@KenzieMovie:token");
    if (token) {
      return true;
    }
    return false;
  }, []);

  const useUser = useCallback(async (id: number) => {
    try {
      const {data} = await api.get(`/users/${id}`)
      return data
    } catch (error) {
      console.error(error)
    }
  },[])

  return (
    <AuthContext.Provider
      value={{
        token,
        signIn,
        userLogged,
        userRegister,
        useUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContextState {
  const context = useContext(AuthContext);
  return context;
}
