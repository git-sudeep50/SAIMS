// RoleBasedRedirect.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function RoleBasedRedirect() {
  const user = useSelector((state: any) => state.auth.user);
  console.log("HELLO INSIDE");

  if (!user) return null; // or loading state

  const target = user.roles.includes("STUDENT")
    ? "/overview"
    : "/employee-overview";

  return <Navigate to={target} replace />;
}
