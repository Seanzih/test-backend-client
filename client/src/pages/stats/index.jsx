import React, { useEffect, useState } from 'react';
import { request } from '../../utils/api.utils';
import { getUserKey } from '../../utils/user.utils';
import './style.css';

const Stats = () => {
  const [ items, setItems ] = useState();
  const [ userKey, setUserKey ] = useState(getUserKey());

  const [ topSell, setTopSell ] = useState({});
  const [ topUnique, setTopUnique ] = useState({});
  const [ pastDays, setPastDays ] = useState({});

  const fetchUserCart = async () => {
    const requestOptions = { method: 'get', path: `cart/getItems/${userKey}` };
    const res = await request(requestOptions);
    const { items } = res.data; 
    setItems(items)
  }

  useEffect(() => {
    fetchUserCart()
  },[])

  useEffect(() => {
    if (items?.length) {
      const categories = {
        TOPSELL: 'topSell',
        TOPUNIQUE: 'topUnique',
        TOPPASTDAYS: 'pastDays',
      }
      const topSellItems = items.filter((itm) => itm.cate === categories.TOPSELL);
      setTopSell({
        products: topSellItems.slice(0, 1),
        count: topSellItems.length,
      });
      const topUniqueItems = items.filter((itm) => itm.cate === categories.TOPUNIQUE);
      setTopUnique({
        products: topUniqueItems.slice(0, 1),
        count: topUniqueItems.length,
      });
      const pastDaysItems = items.filter((itm) => itm.cate === categories.TOPPASTDAYS);
      setPastDays({
        products: pastDaysItems.slice(0, 1),
        count: pastDaysItems.length,
      });
    }
  }, [items])

  return (
    <div className='products-list-container'>
      <ProductList title={'Top 5 Sells'} products={topSell.products} count={topSell.count} />
      <ProductList title={'Top 5 Unique'} products={topUnique.products} count={topUnique.count}  />
      <ProductList title={'Top 5 In Past Days'} products={pastDays.products} count={pastDays.count} />
    </div>
  );
};

const ProductList = ({ title, products, count = 0 }) => {
  const ProductItem = ({ product, count }) => {
    return (
      <div className='product-item'>
        <p>{product.title || 'No one is interested in the product'}</p>
        <p>Sold:{count} Times</p>
      </div>
    )
  }
  return (
    <div className='product-list'>
      <h2>{title}</h2>
      {products.map((prod) => <ProductItem key={`${prod.title}-${Math.floor(Math.random() * 99999)}`} product={prod} count={count} />)}
    </div>
  )
}


export default Stats;
