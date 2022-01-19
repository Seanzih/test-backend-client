import React, { useState, useEffect } from 'react';
import { request } from '../../utils/api.utils';
import ProductCard from '../../components/ProductCard';
import { getUserKey } from '../../utils/user.utils';
import Modal from '../../components/Modal';

import './style.css';

const Home = () => {
  const [ products, setProducts ] = useState([]);
  const [ userKey, setUserKey ] = useState(getUserKey())
  const [ userModal, setUserModal ] = useState(false);
  const [ message, setMessage] = useState(false);

  const addProdMessage = () => {
    setMessage(true);
    setTimeout(() => {
      setMessage(false);
    },5000)
  }
  const toggleUserCartModal = () => {
    setUserModal(!userModal);
  }
  const fetchProducts = async () => {
    const requestOptions = { method: 'get', path: 'products' };
    const res = await request(requestOptions);
    const { products } = res.data
    setProducts(products);
  }

  const addProdToCart = async (prod) => {
    const requestOptions = { method: 'post', path: `cart/addItem/${userKey}`, body: prod };
    const res = await request(requestOptions);
    addProdMessage();
  }

  useEffect(() => {
    fetchProducts();
  }, [])
  
  return (
    <div className='home-container'>
      <div className='user-cart-container'>
          <h1 className='main-title'>My Cart</h1>
          <p className='add-prod-message'>{message? 'Product  Added to Cart!' : ''}</p>
          {userModal ? <UserCart closeModal={toggleUserCartModal} userKey={userKey} /> : ''}
          <button onClick={toggleUserCartModal}>Open Cart</button>
      </div>
      <h1>Products</h1>
      <div className='products-container'>
         {products?.length ? products.map((prod) => <ProductCard handler={() => addProdToCart(prod)} key={`${prod.type}-${Math.floor(Math.random() * 999999)}`} product={prod} />) : null }
      </div>
    </div>
  );
};

const UserCart = ({ closeModal, userKey }) => {
  const [ items, setItems ] = useState([])
  const [ totalPrice, setTotalPrice ] = useState();

  const fetchUserCart = async () => {
    const requestOptions = { method: 'get', path: `cart/getItems/${userKey}` };
    const res = await request(requestOptions);
    const { items, totalPrice } = res.data; 
    setItems(items)
    setTotalPrice(totalPrice);
  }
  
  const payCart = async () => {
    const body = {
      userKey
    }
    const requestOptions = { method: 'post', path: 'cart/payCart', body};
    const res = await request(requestOptions);
    const { pay } = res.data;
    closeModal();
    console.log(`Cart Pay: ${pay}`)
  }

  useEffect(() => {
    fetchUserCart();
  },[])
  const CartItemCard = ({ prod }) => {
    const {title, price} = prod;
    return <li><p className='title'>{title}</p><p className='price'>price:{price}$</p></li>
  }
  return (
      <Modal>
        <div className='user-cart'>
            <ul className='cart-items-list'>
              {items?.length ? items.map((prod) => <CartItemCard prod={prod} key={`${prod.type}-${Math.floor(Math.random() * 999999)}`}/>) : <div><p>Got no Items in Cart</p></div>}
            </ul>
            <p>Total: {totalPrice ? totalPrice : 0}</p>
            <button onClick={payCart}>Pay</button>
            <button onClick={closeModal}>Close Cart</button>
        </div>
      </Modal>  
  )
}

export default Home;
