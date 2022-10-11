const { Product, User, UserProduct } = require("../models");

class ProductController {
  static async getAll(req, res, next) {
    try {
      const products = await Product.findAll({
        include: ["OwnerProduct"],
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
  static async findOne(req, res, next) {
    try {
      const id = +req.params.id;
      const product = await Product.findOne(
        {
          include: ["OwnerProduct"],
        },
        { where: { id } }
      );
      if (product === null) {
        throw { name: "invalid" };
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      next(error);
    }
  }

  static async startBid(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = +req.params.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { name: "invalid" };
      }
      const bidded = await Product.update(
        {
          price: product.price + 5000,
          BidderId: userId,
        },
        { where: { id: productId } }
      );
      res.status(200).json({
        message: `new bid by ${req.user.username} on ${product.name}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async newList(req, res, next) {
    try {
      const productId = +req.params.productId;
      const userId = req.user.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { name: "invalid" };
      }
      const userProduct = await UserProduct.create({
        UserId: userId,
        ProductId: productId,
      });
      res.status(201).json(userProduct);
    } catch (error) {
      next(error);
    }
  }

  static async getAllList(req, res, next) {

  }
}

module.exports = ProductController;
