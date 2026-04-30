import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Star,
  Instagram,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addGuestItem } from "@/store/shop/guest-cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchPublicCategories } from "@/store/shop/categories-slice";
import { setLoginDialogOpen } from "@/store/auth-slice";

const categoriesWithIcon = [
  { id: "wallet", label: "Wallet", icon: ShirtIcon },
  { id: "belts", label: "Belts", icon: CloudLightning },
  { id: "laptop-bags", label: "Laptop Bags", icon: WatchIcon },
  { id: "duffle-bags", label: "Duffle Bags", icon: UmbrellaIcon },
  { id: "jacket", label: "Jacket", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const reviews = [
  {
    id: 1,
    name: "Sana H.",
    date: "2 months ago",
    rating: 5,
    text: "Excellent fabric and stitching. Loved the dress!",
    image: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "Ayesha K.",
    date: "1 month ago",
    rating: 5,
    text: "Beautiful design and perfect fit. Highly recommended.",
    image: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    name: "Fatima R.",
    date: "3 weeks ago",
    rating: 4,
    text: "Good quality but delivery was a bit late. Overall satisfied.",
    image: "https://github.com/shadcn.png",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  // Use public shop categories slice (no auth required)
  const { categoryList } = useSelector((state) => state.shopCategories);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    // Guest support: add to localStorage cart
    if (!user) {
      const product = productList?.find((p) => p._id === getCurrentProductId);
      if (product) {
        dispatch(addGuestItem({
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          salePrice: product.salePrice,
          quantity: 1,
        }));
        toast({ title: "Product added to cart" });
      }
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000); // Changed to 5 seconds for better UX

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchPublicCategories()); // public — no auth needed
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Banner Image</span>
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length,
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length,
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Our Collections - Circular Images */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-serif text-center mb-8 md:mb-12 tracking-widest uppercase">
            Our Collections
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 justify-items-center">
            {categoriesWithIcon.map((categoryItem) => {
              const serverCategory = categoryList?.find(
                (c) => c.id === categoryItem.id,
              );
              const displayImage = serverCategory?.collection_icon;
              const Icon = categoryItem.icon;

              return (
                <div
                  key={categoryItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer group flex flex-col items-center gap-2 md:gap-4"
                >
                  <div className="w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all shadow-md">
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={categoryItem.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-8 h-8 md:w-12 md:h-12" />
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-xs md:text-base uppercase tracking-wider group-hover:text-primary transition-colors text-center">
                    {categoryItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Products Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12 uppercase tracking-widest">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {productList && productList.length > 0
              ? productList
                .filter((productItem) => productItem.isFeatured)
                .map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Pret Section - Product Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-2">PRET</h2>
            <Button variant="link" className="text-gray-500 hover:text-black">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {productList && productList.length > 0
              ? productList
                .slice(0, 4)
                .map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Second Banner */}
      <section className="py-12">
        <div
          className="w-full h-[300px] md:h-[400px] relative overflow-hidden flex items-center justify-center bg-amber-50"
          style={{
            backgroundImage:
              featureImageList && featureImageList.length > 0 && featureImageList[currentSlide]?.image
                ? `url(${featureImageList[currentSlide].image})`
                : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </section>

      {/* New Arrival Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12 uppercase tracking-widest">
            New Arrival
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {productList && productList.length > 0
              ? productList
                .filter((productItem) => productItem.isNewArrival)
                .map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Real Reviews Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-serif text-center mb-8 md:mb-12 uppercase tracking-widest text-gray-800">
            Real Review from Real Customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="border-none shadow-sm bg-white">
                <CardContent className="p-8 flex flex-col gap-4">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{review.name}</h4>
                      <span className="text-xs text-gray-400">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest flex items-center justify-center gap-2">
            <Instagram className="w-6 h-6" /> Motifz Instagram
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-100 relative group overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                </div>
                <img
                  src={`https://picsum.photos/400?random=${item}`}
                  alt="Instagram post"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
