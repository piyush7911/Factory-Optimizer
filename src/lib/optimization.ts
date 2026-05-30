import { OrderItem, Product, OptimizationResult, OptimizationResultItem } from '../types';

export function optimizeProduction(
  products: Product[],
  orders: OrderItem[],
  totalTimeAvailable: number
): OptimizationResult {
  // 1. Merge & Calculate
  const mergedList = orders.map(order => {
    const product = products.find(p => p.id === order.productId);
    if (!product) throw new Error("Product not found");
    const turnoverPerHour = product.price / product.timeHours;
    return {
      order,
      product,
      turnoverPerHour
    };
  });

  // 2. Sort
  mergedList.sort((a, b) => b.turnoverPerHour - a.turnoverPerHour);

  // 3. Execute & Deduct
  let timeRemaining = totalTimeAvailable;
  const schedule: OptimizationResultItem[] = [];
  let totalRevenue = 0;
  let totalTimeConsumed = 0;

  for (const item of mergedList) {
    const timeNeededForFullOrder = item.order.unitsRequired * item.product.timeHours;
    
    let unitsProduced = 0;
    
    if (timeNeededForFullOrder <= timeRemaining) {
      // Fulfill the whole order
      unitsProduced = item.order.unitsRequired;
    } else {
      // Partial fulfillment
      unitsProduced = Math.floor(timeRemaining / item.product.timeHours);
    }

    const timeConsumed = unitsProduced * item.product.timeHours;
    timeRemaining -= timeConsumed;
    const revenue = unitsProduced * item.product.price;
    const unfulfilledUnits = item.order.unitsRequired - unitsProduced;

    schedule.push({
      orderItemId: item.order.id,
      product: item.product,
      unitsRequested: item.order.unitsRequired,
      unitsProduced,
      timeConsumed,
      revenue,
      unfulfilledUnits
    });

    totalRevenue += revenue;
    totalTimeConsumed += timeConsumed;
  }

  return {
    totalRevenue,
    totalTimeConsumed,
    schedule
  };
}
