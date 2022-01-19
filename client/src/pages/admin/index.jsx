import React, { useEffect, useState } from 'react';
import { request } from '../../utils/api.utils';
import Modal from '../../components/Modal';
import './style.css';


const Admin = () => {
  const [ products, setProducts ] = useState([]);
  const [ addProductModal, setAddProductModal ] = useState(false);

  const fetchProducts = async () => {
    const requestOptions = { method: 'get', path: 'products' };
    const res = await request(requestOptions);
    const { products } = res.data
    setProducts(products);
  }

  const toggleAddProdModal = () => {
    setAddProductModal(!addProductModal);
  }

  const addProduct = async (formData) => {
    const requestOptions = {
      method: 'post',
      path: `products`,
      body: formData
    };
      await request(requestOptions)
      toggleAddProdModal();
      fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  const adminState = {
    fetchProducts
  }

  return (
    <div className='admin-container'>
      <h1>Products Dashboard</h1>
      <div className='action-panel'>
        <button className='add-product' onClick={toggleAddProdModal}>add product</button>
        {addProductModal && <EditModal editHandler={addProduct} closeModal={toggleAddProdModal} btnText={'Add Product'}/> }
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>options</th>
          </tr>
        </thead>
        <tbody>
          {products?.length ? products.map((prod) => <ProductsCard key={prod.type} product={prod} state={adminState} />) : null }
        </tbody>
      </table>
    </div>
  )
};


const ProductsCard = ({ product, state }) => {
  const { title, price, type } = product;
  return (
    <tr>
        <td>{title}</td>
        <td>{price}</td>
        <td><OptionsBtns type={type} state={state} prod={product} /></td>
    </tr>
  )
}


const OptionsBtns = ({ type, state, prod }) => {
  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ editModal, setEditModal ] = useState(false);
  const { fetchProducts } = state;

  const toggleEditModal = () => {
    setEditModal(!editModal)

  }
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal)
  }

  const editHandler = async (body) => {
    const requestOptions = {
      method: 'post',
      path: `products`,
      body
    };
      await request(requestOptions)
      toggleEditModal();
      fetchProducts();
  }


  const deleteHandler = async () => {
    const requestOptions = {
      method: 'delete',
      path: `products/${type}`
    };
      await request(requestOptions)
      toggleDeleteModal();
      fetchProducts();
  }
  
  return (
    <>
      <button onClick={toggleEditModal}>edit</button>
      {editModal && <EditModal state={state} prod={prod} type={type} editHandler={editHandler} closeModal={toggleEditModal} btnText={'Edit Products'} /> }
      <button onClick={toggleDeleteModal}>delete</button>
      {deleteModal && <DeleteModal type={type} handler={deleteHandler} closeModal={toggleDeleteModal} />}
    </>
  )
}


const DeleteModal = ({ type, handler , closeModal }) => {
  return (
    <Modal>
        <div className='modal delete-modal'>
            <h2>Are you sure you want 
            to delete Product:{type}</h2>
            <p>action will be permanent</p>
            <button onClick={handler}>yes</button>
            <button onClick={closeModal}>no</button>
        </div>
    </Modal>
  )
}

const EditModal = ({ type = '', editHandler , closeModal, prod = {}, btnText }) => {

  const [ _type, setType ] = useState(type || '');
  const [ typeState, setTypeState ] = useState(_type?.length ? true : false);

  const [ title, setTitle ] = useState(prod.title || '');
  const [ price, setPrice ] = useState(prod.price || '');
  const [ image, setImage ] = useState(prod.image || '');

  const submitHandler = () => {
    const formData = {type: _type, title, price, image};
    editHandler(formData);
  }

  return (
    <div className='modal edit-modal'>
      <Modal>
        <h3>Edit Product</h3>
        <p>action will be permanent</p>
          <div onSubmit={submitHandler}>
            <div className='input type'>
              <label htmlFor='type'>Type:</label>
              <input disabled={typeState ? true : false} type='text' id='title'  value={_type} onChange={(e) => setType(e.target.value)} />
            </div>
            <div className='input'>
              <label htmlFor='title'>Title:</label>
              <input type='text' id='title' value={title || ''} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='input'>
              <label htmlFor='price'>price:</label>
              <input type='number' id='price' value={price || ''} onChange={(e) => setPrice(e.target.value)}  />
            </div>
            <div className='input'>
              <label htmlFor='image'>image:</label>
              <input type='text' id='image' value={image || ''} onChange={(e) => setImage(e.target.value)}  />
            </div>
            <br />
            <button onClick={() => submitHandler()}>{btnText}</button>
            <button onClick={closeModal}>Close Edit Modal</button>
          </div>
      </Modal>
    </div>
  )
}


export default Admin;
