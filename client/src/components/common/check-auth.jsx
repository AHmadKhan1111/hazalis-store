import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  console.log(path, isAuthenticated);

  // 1. Root path handling
  if (path === "/") {
    if (isAuthenticated) {
      return user?.role === "admin" ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <Navigate to="/shop/home" />
      );
    }
    // Redirect unauthenticated users to shop home instead of login
    return <Navigate to="/shop/home" />;
  }

  // 2. Auth Pages (Login/Register)
  if (path.includes("/auth")) {
    if (isAuthenticated) {
      return user?.role === "admin" ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <Navigate to="/shop/home" />
      );
    }
    return <>{children}</>;
  }

  // 3. Admin Routes
  if (path.includes("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
    return <>{children}</>;
  }

  // 4. Shop Routes
  if (path.includes("/shop")) {
    // Protected shop routes (NOT checkout — guests can browse)
    if (
      path.includes("/account") ||
      path.includes("/payment-success")
    ) {
      if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
      }
    }

    // Public shop routes allowed for everyone (including admins)
    return <>{children}</>;
  }

  // Default allow
  return <>{children}</>;
}

export default CheckAuth;
