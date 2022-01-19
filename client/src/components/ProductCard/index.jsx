import React from 'react';
import './style.css';

const ProductCard = ({ product, handler }) => {
    const { type, title, price, image, details } = product;
    
    return (
        <div className='product-card'>
            <img src={image} className='prod-img' />
            <p>title:{title}</p>
            <p>price:{price}$</p>
            <p>{details}</p>
            <button onClick={handler}>Buy</button>
        </div>
    );
};

export default ProductCard;
