import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "@/config/api";

const initialState = {
  newPassword: "",
  confirmPassword: "",
};

function AuthResetPassword() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`/auth/reset-password`, {
        token,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password reset successful. You can now login.",
        });
        navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <CommonForm
        formControls={[
          {
            name: "newPassword",
            label: "New Password",
            placeholder: "Enter new password",
            componentType: "input",
            type: "password",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm new password",
            componentType: "input",
            type: "password",
          },
        ]}
        buttonText={isLoading ? "Resetting..." : "Reset Password"}
        isBtnDisabled={isLoading}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthResetPassword;
