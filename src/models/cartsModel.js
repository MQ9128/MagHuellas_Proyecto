const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/sequelize');
const Product = require('./productModel'); // Asegúrate de tener el modelo de Product

const Cart = sequelize.define('cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const CartItem = sequelize.define('cartItem', {
    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

// Establecer las relaciones
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

module.exports = { Cart, CartItem, Product };
