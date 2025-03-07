const Auth =  require("../model/authModel");
const Order = require("../model/order");
const News = require("../model/newsletterModel")
exports.userCount = async(req,res)=>{
    try{
        console.log("Enter");
        const count = await Auth.countDocuments();
        console.log(count);
        
        res.status(200).json({
            message:"Fetched",
            success:true,
            count,
        })
    }catch(error){
        console.error(error.message);
        res.status(500).json({ message: "Error fetching user count" });
    }
}
exports.ordersCount = async(req,res)=>{
    try{
        console.log("Enter");
        const count = await Order.countDocuments();
        console.log(count);
        
        res.status(200).json({
            message:"Fetched",
            success:true,
            count,
        })
    }catch(error){
        console.error(error.message);
        res.status(500).json({ message: "Error fetching user count" });
    }
}
exports.newsletterCount = async(req,res)=>{
    try{
        console.log("Enter");
        const count = await News.countDocuments();
        console.log(count);
        
        res.status(200).json({
            message:"Fetched",
            success:true,
            count,
        })
    }catch(error){
        console.error(error.message);
        res.status(500).json({ message: "Error fetching user count" });
    }
}
exports.totalItemsSold = async (req, res) => {
  try {
    const [result] = await Order.aggregate([
      { $unwind: '$items' },  // Flatten the 'items' array
      { $group: { 
          _id: null, 
          totalSold: { $sum: '$items.quantity' }  // Sum the quantities
        }
      }
    ]);

    const totalSold = result ? result.totalSold : 0;  // Default to 0 if no result found

    res.status(200).json({
      success: true,
      message: 'Total items sold successfully fetched',
      totalSold,
    });
  } catch (error) {
    console.error('Error fetching total items sold:', error);
    res.status(500).json({ message: 'Error fetching total items sold' });
  }
};
