import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { mergeGuestCart } from "@/store/auth-slice";
import { clearGuestCart } from "@/store/shop/guest-cart-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then(async (data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });

        const userId = data.payload.user?.id;

        // Merge guest cart into server cart
        if (userId) {
          await dispatch(mergeGuestCart(userId));
          dispatch(clearGuestCart());
          dispatch(fetchCartItems(userId));
        }

        // Redirect back to checkout (or wherever they came from)
        const returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) {
          sessionStorage.removeItem("returnTo");
          navigate(returnTo);
        }
        // Otherwise CheckAuth/App will handle navigation
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        renderAfterInputs={() => (
          <div className="flex justify-end p-0">
            <Link
              className="text-sm font-medium text-primary hover:underline"
              to="/auth/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
        )}
      />
    </div>
  );
}

export default AuthLogin;
