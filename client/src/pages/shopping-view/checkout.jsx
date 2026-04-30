import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllAddresses, addNewAddress } from "@/store/shop/address-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
  Banknote,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

const SHIPPING_FEE = 200;

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { items: guestItems } = useSelector((state) => state.guestCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { addressList } = useSelector((state) => state.shopAddress);

  // Use guest cart when not logged in
  const isGuest = !user;
  const activeCartItems = isGuest
    ? guestItems
    : cartItems?.items || [];

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address form
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (user?.id) dispatch(fetchAllAddresses(user.id));
  }, [dispatch, user]);

  // Auto-select first address
  useEffect(() => {
    if (addressList?.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addressList[0]._id);
    }
  }, [addressList]);

  const selectedAddress = addressList?.find((a) => a._id === selectedAddressId);

  const subtotal =
    activeCartItems.reduce(
      (sum, item) =>
        sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    );

  const total = subtotal + SHIPPING_FEE;
  const itemCount = activeCartItems.reduce((s, i) => s + i.quantity, 0);

  // PayPal redirect
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  async function handleSaveAddress(e) {
    e.preventDefault();
    const result = await dispatch(addNewAddress({ ...addressForm, userId: user?.id }));
    if (result?.payload?.success) {
      dispatch(fetchAllAddresses(user?.id));
      setShowNewAddressForm(false);
      setAddressForm({ address: "", city: "", phone: "", pincode: "", notes: "" });
      toast({ title: "Address saved!" });
    }
  }

  async function handlePlaceOrder() {
    if (!activeCartItems.length) {
      toast({ title: "Your cart is empty.", variant: "destructive" });
      return;
    }

    // Guest: save return URL, redirect to login
    if (isGuest) {
      sessionStorage.setItem("returnTo", "/shop/checkout");
      navigate("/auth/login");
      return;
    }

    if (!selectedAddress) {
      toast({ title: "Please select or add a delivery address.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: activeCartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: selectedAddress._id,
        address: selectedAddress.address,
        city: selectedAddress.city,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone,
        notes: selectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: total,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    const result = await dispatch(createNewOrder(orderData));
    setIsProcessing(false);

    if (result?.payload?.success) {
      if (paymentMethod === "cod") {
        setOrderPlaced(true);
      }
      // PayPal: approvalURL will trigger redirect via the useSelector above
    } else {
      toast({ title: "Failed to place order. Please try again.", variant: "destructive" });
    }
  }

  // ── Order Placed confirmation screen ──────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="text-gray-500">
            Thank you for your order. You'll pay <span className="font-semibold">PKR {total}</span> when your package arrives.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            📦 Our team will contact you on <span className="font-semibold">{selectedAddress?.phone}</span> to confirm delivery.
          </div>
          <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={() => navigate("/shop/home")}>
            Continue Shopping
          </Button>
          <button
            className="text-sm text-gray-500 underline"
            onClick={() => navigate("/shop/account")}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ── Left column ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Order Summary (mobile collapsible) */}
          <div className="bg-white rounded-xl border lg:hidden">
            <button
              className="w-full flex items-center justify-between p-4 text-sm font-medium"
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            >
              <span className="flex items-center gap-2 text-blue-600">
                <ShoppingBag className="w-4 h-4" />
                Order summary ({itemCount} item{itemCount !== 1 ? "s" : ""})
              </span>
              <span className="flex items-center gap-2 font-bold text-gray-900">
                PKR {total}
                {isOrderSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            {isOrderSummaryOpen && (
              <div className="border-t px-4 pb-4 space-y-3 pt-3">
                {activeCartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover border" />
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      PKR {(item.salePrice > 0 ? item.salePrice : item.price) * item.quantity}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>PKR {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>PKR {SHIPPING_FEE}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>PKR {total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="text-lg font-bold">Delivery Address</h2>

            {/* Saved addresses */}
            {addressList?.length > 0 && (
              <div className="space-y-2">
                {addressList.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr._id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className="mt-1 accent-black"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.address}</p>
                      <p className="text-gray-500">{addr.city} {addr.pincode}</p>
                      <p className="text-gray-500">{addr.phone}</p>
                    </div>
                  </label>
                ))}
                {!showNewAddressForm && (
                  <button
                    className="text-sm text-blue-600 hover:underline mt-1"
                    onClick={() => setShowNewAddressForm(true)}
                  >
                    + Add new address
                  </button>
                )}
              </div>
            )}

            {/* New address form */}
            {(showNewAddressForm || addressList?.length === 0) && (
              <form onSubmit={handleSaveAddress} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-gray-500 mb-1 block">Address</Label>
                    <Input
                      placeholder="Street address"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">City</Label>
                    <Input
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Postal code</Label>
                    <Input
                      placeholder="Postal code"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Phone</Label>
                    <Input
                      placeholder="+92XXXXXXXXXX"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Notes (optional)</Label>
                    <Input
                      placeholder="Delivery notes"
                      value={addressForm.notes}
                      onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 text-sm">
                    Save Address
                  </Button>
                  {addressList?.length > 0 && (
                    <Button type="button" variant="outline" className="text-sm" onClick={() => setShowNewAddressForm(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Shipping Method */}
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="text-lg font-bold">Shipping Method</h2>
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Flat Shipping</p>
                  <p className="text-xs text-gray-500">3–5 business days</p>
                </div>
              </div>
              <span className="font-semibold text-sm">PKR {SHIPPING_FEE}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="text-lg font-bold">Payment</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              🔒 All transactions are secure and encrypted.
            </p>

            {/* COD Option */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod"
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-black"
              />
              <Banknote className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cash on Delivery (COD)</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs hover:bg-green-100">
                Recommended
              </Badge>
            </label>

            {/* PayPal Option */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "paypal"
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="accent-black"
              />
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">PayPal / Debit Card</p>
                <p className="text-xs text-gray-500">You'll be redirected to PayPal to complete your purchase.</p>
              </div>
              <img
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                alt="PayPal"
                className="h-6 rounded"
              />
            </label>

            {paymentMethod === "cod" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                📦 Our team will call you to confirm the delivery. Please keep your phone reachable.
              </div>
            )}
          </div>

          {/* Place Order Button (mobile) */}
          <div className="lg:hidden">
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base font-semibold rounded-xl"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Placing Order..."
                : paymentMethod === "cod"
                  ? "Place Order — Cash on Delivery"
                  : "Pay with PayPal"}
            </Button>
          </div>
        </div>

        {/* ── Right column (desktop order summary) ────────────── */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-xl border p-5 space-y-4 sticky top-6">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {activeCartItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover border" />
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    PKR {(item.salePrice > 0 ? item.salePrice : item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({itemCount} items)</span>
                <span>PKR {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>PKR {SHIPPING_FEE}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>PKR {total}</span>
              </div>
            </div>

            <Button
              className="w-full bg-black text-white hover:bg-gray-800 py-5 text-sm font-semibold rounded-xl"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Placing Order..."
                : paymentMethod === "cod"
                  ? "Place Order — Cash on Delivery"
                  : "Pay with PayPal"}
            </Button>

            <p className="text-xs text-center text-gray-400">
              🔒 Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
