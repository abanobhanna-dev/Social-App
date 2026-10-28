import { createContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  userLogin: string | null;
  setuserLogin: Dispatch<SetStateAction<string | null>>;
  userId: string;
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setuserLogin: () => {},
  userId: "",
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userLogin, setuserLogin] = useState<string | null>(() => localStorage.getItem("userToken"));

  // ← احسب userId مباشرة بدل useEffect + setState
  const userId = useMemo(() => {
    if (!userLogin) return "";

    try {
      const decoded: { user: string } = jwtDecode(userLogin);
      return decoded.user;
    } catch (error) {
      console.error("Invalid token", error);
      return "";
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
}