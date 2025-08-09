import { calculateOrderRevenue } from "./calculateOrderRevenue";

export const calculateRevenueForOrders = async (orders: any[]) => {
    
    if (!Array.isArray(orders)) {   
        throw new Error("Invalid input: orders should be an array");
        }
    let totalRevenue = 0;
  
    for (const order of orders) {
      if (order.orderStatus?.toLowerCase().trim() === 'completed') {
        const revenue = await calculateOrderRevenue(order);
        totalRevenue += revenue;
      }
    }
  
    return totalRevenue;
  };