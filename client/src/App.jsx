import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import "./App.css";

const products = [
  { id: 1, name: "Everyday Crossbody", category: "Bags", price: 2499, tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85" },
  { id: 2, name: "Classic Leather Wallet", category: "Wallets", price: 1299, tag: "TIMELESS", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85" },
  { id: 3, name: "Weekender Duffle", category: "Travel", price: 3499, tag: "MADE TO MOVE", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Minimal Daily Tote", category: "Bags", price: 1999, tag: "EVERYDAY ESSENTIAL", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85" },
  { id: 5, name: "Urban Sling Bag", category: "Bags", price: 1799, tag: "NEW SEASON", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=85" },
  { id: 6, name: "Travel Organiser", category: "Travel", price: 999, tag: "SMART STORAGE", image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=85" },
  { id: 7, name: "Signature Card Holder", category: "Wallets", price: 899, tag: "SMALL DETAIL", image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85" },
  { id: 8, name: "City Explorer Backpack", category: "Travel", price: 2999, tag: "BUILT FOR DAYS OUT", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" },
];

const money = (amount) => `Rs. ${amount.toLocaleString("en-PK")}`;

function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hazalis_static_cart") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = ["All", "Bags", "Wallets", "Travel"];
  const filtered = useMemo(() => products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function saveCart(next) {
    setCart(next);
    localStorage.setItem("hazalis_static_cart", JSON.stringify(next));
  }
  function addToCart(product) {
    const found = cart.find((item) => item.id === product.id);
    saveCart(found ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { ...product, quantity: 1 }]);
    setCartOpen(true);
  }
  function changeQuantity(id, delta) {
    saveCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }
  function sendOrder() {
    const lines = cart.map((item) => `${item.name} x ${item.quantity} — ${money(item.price * item.quantity)}`).join("\\n");
    const body = encodeURIComponent(`Hi Hazalis, I'd like to enquire about this order:\\n\\n${lines}\\n\\nTotal: ${money(total)}\\nPlease confirm availability and delivery.`);
    window.location.href = `mailto:hello@hazalis.com?subject=Hazalis%20order%20enquiry&body=${body}`;
  }

  return (
    <div className="site-shell">
      <div className="announcement">THOUGHTFULLY CHOSEN ESSENTIALS <span>•</span> DELIVERY ACROSS PAKISTAN</div>
      <header className="site-header">
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <a className="wordmark" href="#home" aria-label="Hazalis home">HAZALIS<span>®</span></a>
        <nav className={menuOpen ? "main-nav nav-open" : "main-nav"}>
          <a href="#collection" onClick={() => setMenuOpen(false)}>Shop all</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#promise" onClick={() => setMenuOpen(false)}>The details</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Search size={17}/><input aria-label="Search products" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}/></label>
          <button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={19}/><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <img className="hero-image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90" alt="Neutral-toned everyday fashion essentials" />
          <div className="hero-shade"/>
          <div className="hero-content">
            <p className="eyebrow light">THE EVERYDAY EDIT · 2026</p>
            <h1>Good things.<br/><em>Made to go places.</em></h1>
            <p className="hero-copy">Everyday carry, considered design, and the little details that make a difference.</p>
            <a className="button button-light" href="#collection">Explore the collection <ArrowRight size={17}/></a>
          </div>
          <div className="hero-caption"><span>01 / THE NEW EVERYDAY</span><span>DESIGNED FOR REAL LIFE</span></div>
        </section>

        <section className="benefit-strip" id="promise">
          <div><span className="benefit-icon">01</span><p><strong>Considered essentials</strong><small>Useful by design, easy to love</small></p></div>
          <div><span className="benefit-icon">02</span><p><strong>Made for everyday</strong><small>From slow mornings to long days</small></p></div>
          <div><span className="benefit-icon">03</span><p><strong>Pakistan-wide delivery</strong><small>Delivery details confirmed with your order</small></p></div>
        </section>

        <section className="collection section-wrap" id="collection">
          <div className="section-heading">
            <div><p className="eyebrow">THE HAZALIS COLLECTION</p><h2>Everyday, <em>elevated.</em></h2><p className="section-subtitle">A curated edit of pieces that work as hard as you do.</p></div>
            <a className="text-link desktop-link" href="#story">A little about us <ArrowRight size={16}/></a>
          </div>
          <div className="collection-controls">
            <div className="category-tabs" role="group" aria-label="Filter products">{categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <span className="result-count">{filtered.length} pieces</span>
          </div>
          <div className="product-grid">
            {filtered.map((product, index) => <article className="product-card" key={product.id}>
              <div className="product-image-wrap"><img src={product.image} alt={product.name} loading={index > 3 ? "lazy" : "eager"}/><span className="product-tag">{product.tag}</span><button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><Plus size={18}/></button></div>
              <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><strong>{money(product.price)}</strong></div>
            </article>)}
          </div>
          {filtered.length === 0 && <p className="empty-search">No pieces found. Try another search.</p>}
          <p className="catalog-note">Product names, images and prices shown here are a sample catalogue. Availability and final prices must be confirmed before ordering.</p>
        </section>

        <section className="editorial" id="story">
          <div className="editorial-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85" alt="A calm, curated retail space" loading="lazy"/></div>
          <div className="editorial-copy"><p className="eyebrow">LESS, BUT BETTER</p><h2>Keep what works.<br/><em>Love it longer.</em></h2><p>Hazalis is about the pieces you reach for without thinking: versatile essentials, thoughtful details, and a more considered everyday.</p><a className="text-link" href="#collection">Find your everyday <ArrowRight size={16}/></a></div>
        </section>

        <section className="newsletter">
          <p className="eyebrow light">A NOTE FROM HAZALIS</p><h2>Good things, occasionally.</h2><p>For product updates and collection news, get in touch with us directly.</p><a className="button button-outline" href="mailto:hello@hazalis.com?subject=Hazalis%20updates">Say hello <ArrowRight size={16}/></a>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-mark" href="#home">HAZALIS<span>®</span></a><p>Everyday essentials, thoughtfully chosen.</p><div className="footer-links"><a href="#collection">Shop</a><a href="#story">Our approach</a><a href="mailto:hello@hazalis.com">Contact</a></div><small>© {new Date().getFullYear()} Hazalis. All rights reserved.</small></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping bag">
        <div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>
        {cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34}/><h3>Your bag is taking a breather.</h3><p>Explore the collection and add something you love.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById("collection")?.scrollIntoView({behavior:"smooth"}); }}>Explore products <ArrowRight size={16}/></button></div> : <>
          <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-info"><h3>{item.name}</h3><p>{money(item.price)}</p><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => changeQuantity(item.id,-1)}><Minus size={13}/></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => changeQuantity(item.id,1)}><Plus size={13}/></button></div></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
          <div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="checkout-note"><Check size={15}/> This is a static catalogue. Orders are sent as an email enquiry; no payment is collected online.</p><button className="button button-dark checkout-button" onClick={sendOrder}>Send order enquiry <ArrowRight size={17}/></button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue browsing</button>
        </>}
      </aside></div>}
    </div>
  );
}
export default App;
