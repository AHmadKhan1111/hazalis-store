import logo from "../../assets/logo.png";
import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, setLoginDialogOpen } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`),
      )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { items: guestItems } = useSelector((state) => state.guestCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  // Unified cart: server cart for logged-in, localStorage cart for guests
  const unifiedItems = user
    ? cartItems?.items?.length > 0 ? cartItems.items : []
    : guestItems || [];

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {unifiedItems.length}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={unifiedItems}
        />
      </Sheet>

      {user?.role === "admin" ? (
        <Button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Admin Dashboard
        </Button>
      ) : null}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => dispatch(setLoginDialogOpen(true))}>
          Sign In
        </Button>
      )}
    </div>
  );
}

function MobileCartButton() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { items: guestItems } = useSelector((state) => state.guestCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const unifiedItems = user
    ? cartItems?.items?.length > 0 ? cartItems.items : []
    : guestItems || [];

  return (
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
      <Button
        onClick={() => setOpenCartSheet(true)}
        variant="ghost"
        size="icon"
        className="relative text-black"
      >
        <ShoppingCart className="w-5 h-5" />
        {unifiedItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unifiedItems.length}
          </span>
        )}
      </Button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={unifiedItems}
      />
    </Sheet>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Bar */}
      <div className="w-full bg-[#8B0000] text-white text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide">
        Free delivery on shopping more than Rs: 1500
      </div>

      {/* Main Header */}
      <div className="bg-background border-b">
        {/* ===== MOBILE HEADER ===== */}
        <div className="flex lg:hidden h-14 items-center justify-between px-3 relative">
          {/* Left: Hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-6">
                <MenuItems />
              </div>
              <div className="mt-4 border-t pt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-gray-500">
                      Hi, {user?.userName || "User"}
                    </span>
                    {user?.role === "admin" && (
                      <Button
                        size="sm"
                        onClick={() => navigate("/admin/dashboard")}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch(logoutUser())}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => dispatch(setLoginDialogOpen(true))}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Center: Logo (absolutely centered) */}
          <Link
            to="/shop/home"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <img src={logo} alt="Hazalis Logo" className="h-9 w-auto" />
          </Link>

          {/* Right: Cart only */}
          <div className="flex items-center">
            <MobileCartButton />
          </div>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6">
          <Link to="/shop/home" className="flex items-center gap-2">
            <img src={logo} alt="Hazalis Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight">HAZALIS</span>
          </Link>

          <MenuItems />

          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
