
const {uuid} = require('uuidv4');
const { db } = require('../../firebase');

var express = require('express');
var router = express.Router();

const  collections = {
    USER_CART: 'userCart',
    PRODUCTS: 'products',
}

router.post('/addItem/:userkey', async (req, res) => {
    let body;
    try {
        body = JSON.parse(req.body)
    } catch (err) {
        body = req.body;
    }
    try {
        const { userkey } = req.params;
        const item = body;
        console.log(body);

        const productToAdd = await getProductForCart(item);
        const userCart = await updateUserCart(userkey, productToAdd);
        return res.status(201).json({message: 'item added to cart', itemAdded: productToAdd, cartBefore: userCart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: err.message});
    }
})

async function getProductForCart(item) {
    try {
        const productToAddSS = await db.doc(`${collections.PRODUCTS}/${item.type}`).get();
        const fbProduct = productToAddSS.data();
        if(!productToAddSS.exists) {
            throw new Error(`item not exists or out of stock ${item.type}`);
        }

        const newCartProd = {
            ...fbProduct,
            id: uuid(),  
        };
        
        return newCartProd;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

async function updateUserCart(uk, productToAdd) {
    const userCartRef = db.doc(`${collections.USER_CART}/${uk}`);
    const userCartSS = await userCartRef.get();
    const userCart = userCartSS.data();


    if(!userCartSS.exists) {
        await db.collection(`${collections.USER_CART}`).doc(`${uk}`).set({
            items: [ productToAdd ]
        });
    } else {
        await userCartRef.update({
            items: [...userCart.items, productToAdd]
        });
    }

    return userCart;
}

router.get('/getItems/:userkey', async (req, res) => {
    try {
        const { userkey } = req.params;
        // if user key not exists -> return empty object
        if(!userkey) return res.status(204).json({});
        // get items and return them
        const userItems = await getUserItems(userkey);
        return res.json(userItems);
    } catch (err) {
        return res.status(500).send({error: err});
    }
})

async function getUserItems(userKey, couponCode) {
    const fallbackUserItems = {items:[], totalPrice: 0}
    if(!userKey || typeof userKey !== 'string') return fallbackUserItems;

    const itemsSnapshot = await db.doc(`${collections.USER_CART}/${userKey}`).get();
    if(!itemsSnapshot.exists) {
        return fallbackUserItems;
    }

    const userItems = itemsSnapshot.data();
    
    if(userItems.items && userItems.items.length) {
        userItems.totalPrice = getCartPrice(userItems.items);
        // userItems.totalPrice = userItems.items.reduce((total, item) => item.price + total, 0);
        if(couponCode && couponCode !== '' && typeof couponCode === 'string') {
            return await forceCouponOnUserItems(couponCode, userItems);
        }
    } else {
        userItems.totalPrice = 0;
    }
    return userItems;
}

function getCartPrice(items = []) {
    return items.reduce((total, item) => {
        if(item.quantity) {
            try {
                const qnty = parseInt(item.quantity);
                return (qnty*item.price) + total;
            } catch (err) {
                return item.price + total
            }
        }
        return item.price + total
    }, 0);
}

async function forceCouponOnUserItems(couponCode, userItems) {
    if(couponCode && couponCode !== '' && typeof couponCode === 'string') {
        const couponSnapshot = await db.doc(`${collections.COUPONS}/${couponCode}`).get();
        const couponData = couponSnapshot.data();
        userItems.couponCode = couponCode;
        if(
            couponSnapshot.exists 
            && couponData.isActive 
            && couponData.type === PERCENTAGE
        ) {
            userItems.originalPrice = userItems.totalPrice;
            userItems.totalPrice -= parseInt((userItems.totalPrice * couponData.value) / 100); 
            userItems.isValidCoupon = true;
            userItems.couponType = couponData.type;
            userItems.couponValue = couponData.value;
        } else {
            userItems.isValidCoupon = false;
        }
    }
    return userItems;
}



router.post('/payCart', async (req, res) => {
    let body;
    try {
        body = JSON.parse(req.body);
    } catch (err) {
        body = req.body;
    }
    try {
        const { userKey } = body;
        console.log(body);
        const cartToDelete = await db.collection(collections.USER_CART).doc(userKey).get();
        await cartToDelete.ref.delete();
        return res.status(200).json({userKey, pay: true});
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})


module.exports = router;