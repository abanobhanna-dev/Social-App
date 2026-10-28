import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
interface ProdectedRouteProps {
  children: ReactNode;
}
export default function AuthProdectedRoute({ children }: ProdectedRouteProps) {
  if (!localStorage.getItem("userToken")) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/home"} />;
  }
}
