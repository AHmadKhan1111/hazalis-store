import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

function AdminHomeButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      onClick={() => navigate("/shop/home")}
      className="flex items-center gap-2 mr-4"
    >
      <House className="w-4 h-4" />
      Home
    </Button>
  );
}

export default AdminHomeButton;
