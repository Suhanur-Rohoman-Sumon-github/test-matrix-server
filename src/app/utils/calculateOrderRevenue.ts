import productModel from "../modiules/products/product.model";

export const calculateOrderRevenue = async (order: any) => {
    
    

    
  
    let totalBuyPrice = 0;
  
    const product = await productModel.findById(order.products); // ✅ Correct key
    if (product) {
      totalBuyPrice += (product.buyPrice || 0) * (order.quantity || 1);
    }
  
    const totalSellPrice = order.totalAmount || 0;
    
    return totalSellPrice - totalBuyPrice;
  };
  