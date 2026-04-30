import { Facebook, Instagram, Link, Twitter, Youtube } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import logo from "../../assets/logo.png";

function ShoppingFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="Hazalis Logo"
                className="h-8 w-auto invert"
              />
              <h3 className="text-xl font-bold">HAZALIS</h3>
            </div>
            <p className="text-gray-400 text-sm">
              HAZALIS is a premium fashion brand dedicated to providing the
              latest trends and high-quality clothing for men, women, and kids.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <RouterLink
                  to="/shop/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/shop/shipping-returns"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/shop/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/shop/order-tracking"
                  className="hover:text-white transition-colors"
                >
                  Order Tracking
                </RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: hazalisofficial.com</li>
              <li>Phone: +923086777765</li>
              <li>Address: Shahdra, Lahore, Pakistan</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 HAZALIS. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
