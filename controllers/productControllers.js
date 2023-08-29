const Products = require("../models/products");

let createProduct, aggregateData, bucketTest;

 createProduct = async (req, res) => {
  try {
    let { userPosted, productName, quantity, price } = req.body,newProduct;

    newProduct = await Products.create({
      userPosted: userPosted,
      productName: productName,
      quantity: quantity,
      price: price,
      image: req.image,
      pdf: req.pdf
    });

   return res.send({
      status: 1,
      response: "product posted successfully",
      product: newProduct,
    });
  } catch (error) {
   return res.send({ status: 0, response: error });
  }
};


aggregateData = async (req, res) => {
  try {
   let aggregated = await Products.aggregate([
    {
      $facet: {
        "categorizedByQuantity": [
          {
            $bucket: {
              groupBy: "$quantity",                        
              boundaries: [ 5, 10, 15, 20, 1000, 1100 ], 
              default: "Other",                            
              output: {                                    
                "count": { $sum: 1 },
                "products" :
                  {
                    $push: {
                      "name": "$productName",
                      "quantity": "$quantity",
                    }
                  }
              }
            }
          },
        ],
        "categorizedByPrice": [
          {
            $bucket: {
              groupBy: "$price",                        
              boundaries: [ 100, 200, 700, 800, 1000, 1100 ], 
              default: "Other",                            
              output: {                                    
                "count": { $sum: 1 },
                "products" :
                  {
                    $push: {
                      "name": "$productName",
                      "price":"$price"
                    }
                  }
              }
            }
          },
        ]
      }
    }
  ])
    return res.send({ status: 1, reponse: aggregated });
  } catch (error) {
   return res.send({ status: 0, response: error });
  }
};


bucketTest = async(req,res)=>{
  try {
    let payload =  await Products.aggregate( [      {
        $bucket: {
          groupBy: "$price",                        
          boundaries: [ 100, 200, 700, 800, 1000, 1100 ], 
          default: "Other",                            
          output: {                                    
            "count": { $sum: 1 },
            "products" :
              {
                $push: {
                  "name": "$productName",
                  "quantity": "$quantity",
                  "price":"$price"
                }
              }
          }
        }
      },
    ] )
    return res.send({status:1, response: payload})
  } catch (error) {
    return res.send({status:0, response:error.message})
  }
}

module.exports = { createProduct, aggregateData, bucketTest };
