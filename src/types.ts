export interface Product {
  id: string;
  name: string;
  price: number;
  timeHours: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  unitsRequired: number;
}

export interface OptimizationResultItem {
  orderItemId: string;
  product: Product;
  unitsRequested: number;
  unitsProduced: number;
  timeConsumed: number;
  revenue: number;
  unfulfilledUnits: number;
}

export interface OptimizationResult {
  totalRevenue: number;
  totalTimeConsumed: number;
  schedule: OptimizationResultItem[];
}
