import React, { useState } from 'react';
import ProductCard from './ProductCard';  
import { toast } from 'react-toastify';  

function ProductList() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);


        toast.success(`${product.name} added to cart!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
    };

    const products = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
        { id: 3, name: "Product 3" },
        
    ];

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                />
            ))}
        </div>
    );
}

export default ProductList;
