// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
//One to Many relation between category and product 
// Products belongsTo Category
Product.belongsTo(Category);

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

//Many to many relation between Product and Tag through ProductTag
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {  
  through: 'ProductTag',
  //as: 'products', 
  //foreignKey: 'product_id', 
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {  
  through: 'ProductTag',
  //as: 'tags',
  //foreignKey: 'tag_id',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};