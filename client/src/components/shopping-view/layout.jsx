import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";
import AuthLoginDialog from "../auth/login-dialog";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      <ShoppingFooter />
      <AuthLoginDialog />
    </div>
  );
}

export default ShoppingLayout;
