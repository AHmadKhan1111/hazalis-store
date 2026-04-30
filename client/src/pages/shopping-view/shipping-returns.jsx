import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

function ShippingReturns() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">
          Shipping &amp; Returns
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Everything you need to know about our shipping policies and how to
          return an item.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-black" />
              <h2 className="text-2xl font-bold">Shipping Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We offer standard and express shipping options to ensure your
              premium fashion reaches you as quickly as possible. All orders are
              processed within 1-2 business days.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Standard:
                </div>
                <div className="text-gray-600">
                  5-7 Business Days (Free on orders over $100)
                </div>
              </li>
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Express:
                </div>
                <div className="text-gray-600">2-3 Business Days ($15.00)</div>
              </li>
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Next Day:
                </div>
                <div className="text-gray-600">
                  1 Business Day ($25.00 - Order by 2pm EST)
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-black" />
              <h2 className="text-2xl font-bold">Returns & Exchanges</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Not perfectly satisfied? We offer hassle-free returns on all items
              within 30 days of purchase. Items must be in original condition
              with tags attached.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Window:
                </div>
                <div className="text-gray-600">30 days from delivery date</div>
              </li>
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Processing:
                </div>
                <div className="text-gray-600">
                  5-10 business days after receipt
                </div>
              </li>
              <li className="flex gap-4">
                <div className="font-bold text-black min-w-[120px]">
                  Method:
                </div>
                <div className="text-gray-600">
                  Refund to original payment method
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <ShieldCheck className="w-10 h-10 mx-auto text-black" />
            <h3 className="font-bold text-lg">Secure Shipping</h3>
            <p className="text-sm text-gray-500">
              Fully insured delivery with tracking provided for every order.
            </p>
          </div>
          <div className="space-y-3">
            <Clock className="w-10 h-10 mx-auto text-black" />
            <h3 className="font-bold text-lg">Fast Processing</h3>
            <p className="text-sm text-gray-500">
              95% of orders ship within 24 hours of placement.
            </p>
          </div>
          <div className="space-y-3">
            <RotateCcw className="w-10 h-10 mx-auto text-black" />
            <h3 className="font-bold text-lg">Easy Returns</h3>
            <p className="text-sm text-gray-500">
              Self-service return portal for a smooth return experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingReturns;
