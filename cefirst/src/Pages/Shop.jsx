import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero";
import Footer from "../Components/Footer";
import "./ShopCart.css";
import { toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Components/Loader";


const products = [
  {
    id: 1,
    name: "Product 1",
    price: "₹5,000",
    image: "/public/assets/picc1.jpg",
  },
  { id: 2, name: "Product 2", price: "₹8,000", image: "src/assets/picc1.jpg" },
  { id: 16, name: "Product 3", price: "₹15,000", image: "src/assets/picc1.jpg" },
  { id: 3, name: "Product 4", price: "₹8,000", image: "src/assets/picc1.jpg" },

  {
    id: 18,
    name: "Product 5",
    price: "₹30,000",
    image: "src/assets/picc1.jpg",
  },
  
  {
    id: 19,
    name: "Product 6",
    price: "₹1,25,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 20,
    name: "Product 7",
    price: "₹40,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 21,
    name: "Product 8",
    price: "₹8,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 22,
    name: "Product 9",
    price: "₹55,100",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 23,
    name: "Product 10",
    price: "₹40,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 24,
    name: "Product 11",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 25,
    name: "Product 12",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 28,
    name: "Product 13",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 15,
    name: "Product 14",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 14,
    name: "Product 15",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 12,
    name: "Product 16",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 11,
    name: "Product 17",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 10,
    name: "Product 18",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 9,
    name: "Product 19",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 8,
    name: "Product 20",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 7,
    name: "Product 21",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 6,
    name: "Product 22",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },
  {
    id: 5,
    name: "Product 23",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 4,
    name: "Product 24",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 3,
    name: "Product 25",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 2,
    name: "Product 26",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },{
    id: 1,
    name: "Product 27",
    price: "₹25,000",
    image: "src/assets/picc1.jpg",
  },
];



function Shop({ addToCart }) {
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [loadingAddToCart, setLoadingAddToCart] = useState(null);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }

    // Preload images
    const preloadImages = products.map((product) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = product.image;
        img.onload = resolve;
        img.onerror = reject;
      })
    );

    Promise.all(preloadImages)
      .then(() => {
        setShopProducts(products);
      })
      .catch((error) => console.error("Error preloading images", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    setLoadingAddToCart(product.id);

    setTimeout(() => {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        setCartItems([...cartItems]);
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }

      setLoadingAddToCart(null);

      addToCart(product);
      // toast.success(`${product.name} added to cart!`);
    }, 1000);
  };

  return (
    <>
      <Hero heading="Shop Exclusive Products" />
      <div className="shop-container">
        {loading ? (
          <Loader />
        ) : (
          shopProducts.map((product) => (
            <div
              key={product.id}
              className="shop-card"
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="shop-card-img"
                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <div
                className="shop-card-actions"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingAddToCart === product.id}
                  style={{
                    position: "relative",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "#f9bf29",
                    color: "white",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  {loadingAddToCart === product.id ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f9bf29",
                      }}
                    >
                      <Loader />
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default Shop;