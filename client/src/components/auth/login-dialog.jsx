import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, setLoginDialogOpen } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const initialState = {
  email: "",
  password: "",
};

function AuthLoginDialog() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoginDialogOpen } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        dispatch(setLoginDialogOpen(false));
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog
      open={isLoginDialogOpen}
      onOpenChange={(open) => dispatch(setLoginDialogOpen(open))}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Enter your email and password to access your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
          <div className="text-center text-sm">
            Don't have an account?
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/register"
              onClick={() => dispatch(setLoginDialogOpen(false))}
            >
              Register
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthLoginDialog;
