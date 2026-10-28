import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
interface ProdectedRouteProps {
  children: ReactNode;
}
export default function ProdectedRoute({ children }: ProdectedRouteProps) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to={"/login"} />;
  } else {
    return <>{children}</>;
  }
}
