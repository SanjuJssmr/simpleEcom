const products = require("../models/products.js");
const Sales = require("../models/sales.js");

const addtoCard = async (req, res) => {
  try {
    let { userBuying, productBuying, quantity } = req.body, buyProduct;

    buyProduct = await Sales.create({
      userBuying: userBuying,
      productBuying: productBuying,
      quantity: quantity
    });

   return res.send({ status: 1, response: buyProduct });
  } catch (error) {
   return res.send({ status: 0, response: error });
  }
};


const buyProduct = async (req, res) => {
  try {
    let {id} = req.body, purchaseDetails, productDetails, decQuality, sameUserCheack;

    purchaseDetails = await Sales.findById({ _id: id })

    productDetails = await products.findById({
        _id: purchaseDetails.productBuying,
      });

    decQuality =  productDetails.quantity - purchaseDetails.quantity
    sameUserCheack = productDetails.userPosted === purchaseDetails.userBuying

    if(productDetails.quantity < purchaseDetails.quantity){
      return res.send({status:0, respone:`You exceed the available stock quantity, which is ${productDetails.quantity}`});
    }

    if (!sameUserCheack) {
      if (purchaseDetails.status != 2) {
        await Sales.findByIdAndUpdate(
          { _id: purchaseDetails._id },
          { status: 2 }
        );
        await products.findByIdAndUpdate(
          { _id: productDetails._id },
          { quantity:decQuality}
        );
        return res.send({ status: 1, response: "user status updated" });
      } else {
        return res.send({
          status: 0,
          response: "You're already buyed the product",
        });
      }
    } else {
      return res.send({
        status: 0,
        response: "You can't buy your own product",
      });
    }
    
  } catch (error) {
    return  res.send({ status: 0, response: error.message });
  }
};


module.exports = { addtoCard, buyProduct };


