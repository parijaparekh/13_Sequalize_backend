const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productsData = await Product.findAll({
      include: [ 
        {model: Category}
        /*{model: Tag,
        through: {
          attributes: ['']
        }  }*/]
    })
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const singleProductData = await Product.findByPk(req.params.id, {
      include: [{ model: Category },{ model: Tag }]
    });

    if (!singleProductData) {
      res.status(404).json({ message: 'No Product was found with that id!' });
      return;
    }
    res.status(200).json(singleProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tags && req.body.tags.length > 0) {
        const productTagIdArr = req.body.tags.map((tag_id) => {
          return {
            "product_id": product.id,
            "tag_id": tag_id,
          };
        });
        console.log(productTagIdArr);
        ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    //.then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((updatedProductTags) => res.status(200).json(updatedProductTags))
  .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const singleProductData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!singleProductData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(singleProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;