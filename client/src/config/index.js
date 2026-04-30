import { Wallet } from "lucide-react";

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "wallets", label: "Wallets" },
      { id: "belts", label: "Belts" },
      { id: "LaptopDuffleBags", label: "Duffle & Laptop Bags" },
      { id: "jacket", label: "Jacket" },
      { id: "accessories", label: "Accessories" },
    ],
  },

  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Featured Product",
    name: "isFeatured",
    componentType: "checkbox",
  },
  {
    label: "New Arrival",
    name: "isNewArrival",
    componentType: "checkbox",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "wallet",
    label: "Wallet",
    path: "/shop/listing",
  },
  {
    id: "belts",
    label: "Belts",
    path: "/shop/listing",
  },
  {
    id: "jacket",
    label: "Jacket",
    path: "/shop/listing",
  },
  {
    id: "laptop-bags",
    label: "Laptop Bags",
    path: "/shop/listing",
  },
  {
    id: "duffle-bags",
    label: "Duffle Bags",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  wallet: "Wallet",
  belts: "Belts",
  "laptop-bags": "Laptop Bags",
  "duffle-bags": "Duffle Bags",
  jacket: "Jacket",
  accessories: "Accessories",
};

export const filterOptions = {
  category: [
    { id: "wallet", label: "Wallet" },
    { id: "belts", label: "Belts" },
    { id: "laptop-bags", label: "Laptop Bags" },
    { id: "duffle-bags", label: "Duffle Bags" },
    { id: "jacket", label: "Jacket" },
    { id: "accessories", label: "Accessories" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
