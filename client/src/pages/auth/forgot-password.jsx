import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "@/config/api";

const initialState = {
  email: "",
};

function AuthForgotPassword() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `/auth/forgot-password`,
        formData,
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description:
            response.data.message || "Reset link sent to your email.",
        });
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
          Forgot Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email to receive a password reset link.
        </p>
      </div>
      <CommonForm
        formControls={[
          {
            name: "email",
            label: "Email",
            placeholder: "Enter your email",
            componentType: "input",
            type: "email",
          },
        ]}
        buttonText={isLoading ? "Sending..." : "Send Reset Link"}
        isBtnDisabled={isLoading}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthForgotPassword;
