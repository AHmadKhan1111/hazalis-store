import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, TrendingUp, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/shop/account");
    } else {
      // In a real app, this would query a public tracking API
      // For now, we'll just show a "mock" result or prompt login
      alert(
        "In a production environment, this would query the shipping carrier. For now, please log in to view your order status in your account.",
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Track Your Order
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Enter your order ID to see the current status of your shipment.
        </p>

        <div className="bg-white p-8 rounded-xl border shadow-sm mb-12">
          <form
            onSubmit={handleTrack}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="orderId" className="sr-only">
                Order ID
              </Label>
              <Input
                id="orderId"
                placeholder="Enter your Order ID (e.g., #ORD-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Track Status
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">Order Placed</h3>
            <p className="text-sm text-gray-500">
              Your order has been received and is being prepared.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">In Transit</h3>
            <p className="text-sm text-gray-500">
              Your package is on its way to your destination.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">Delivered</h3>
            <p className="text-sm text-gray-500">
              The package has been successfully delivered.
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mt-16 bg-gray-50 p-8 rounded-xl text-center border">
            <h2 className="text-xl font-bold mb-4">
              Want a more detailed view?
            </h2>
            <p className="text-gray-600 mb-6">
              Log in to your account to see your full order history, detailed
              tracking updates, and manage your returns.
            </p>
            <Button
              onClick={() => navigate("/auth/login")}
              variant="outline"
              className="border-black"
            >
              Log In to My Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
