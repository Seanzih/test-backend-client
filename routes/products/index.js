var express = require('express');
var router = express.Router();
const { db } = require('../../firebase');

const collections = {
    PRODUCTS: 'products'
}

router.get('/', async (req, res) => {
    try {
        const products = (await db.collection(collections.PRODUCTS).get()).docs.map((doc) => doc.data());
        return res.status(200).json({products});
    } catch (err) {
        return res.status(500).json({ok: err});
    }
})


// upload prod / update
router.post('/', async (req, res) => {
    let body;
    try {
        body = JSON.parse(req.body)
    } catch (err) {
        body = req.body
    }
    try {
        // update or create
        const {type, ...params} = body;
        console.log(body)
        const prodRef = db.doc(`products/${type}`);
        await prodRef.set({
            ...params, type
        }, { merge: true });
        return res.status(200).json({ok: true, product: body});
            
    } catch(err) {
        return res.status(500).json({error: err});
    }
});

// delete products
router.delete('/:type', async (req, res) => {
    try {
        const prodToDeleteId = req.params.type;
        const productToDeleteSS = await db.collection(collections.PRODUCTS).doc(prodToDeleteId).get();

        if(!productToDeleteSS.exists) {
            throw new Error('Product to delete is not exists');
        }

        await productToDeleteSS.ref.delete();
        return res.status(200).json({prodToDeleteId, ok: true});
    } catch(err) {
        return res.status(500).json({err: err.message});
    }
});


module.exports = router;