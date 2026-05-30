import React, { useState } from 'react';
import { OrderItem, Product, OptimizationResult } from '../types';
import { optimizeProduction } from '../lib/optimization';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CustomerOrdersPlanningProps {
  products: Product[];
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  onBack: () => void;
}

export function CustomerOrdersPlanning({ products, orders, setOrders, onBack }: CustomerOrdersPlanningProps) {
  const [totalTimeMode, setTotalTimeMode] = useState<string>('120');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [unitsRequired, setUnitsRequired] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !unitsRequired) return;

    const newOrder: OrderItem = {
      id: crypto.randomUUID(),
      productId: selectedProductId,
      unitsRequired: parseInt(unitsRequired, 10),
    };

    setOrders([...orders, newOrder]);
    setUnitsRequired('');
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleOptimize = () => {
    const time = parseFloat(totalTimeMode);
    if (isNaN(time) || time <= 0) return;
    
    const optimizationResult = optimizeProduction(products, orders, time);
    setResult(optimizationResult);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Orders & Planning</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Execute the production algorithm</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Order Input & List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Add Order</h2>
            <form onSubmit={handleAddOrder} className="flex flex-col gap-4">
              <div>
                <label htmlFor="product" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Product</label>
                <select
                  id="product"
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-all placeholder-slate-300"
                  required
                >
                  <option value="" disabled>Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price} | {p.timeHours}h)</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="units" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Units Required</label>
                <input
                  id="units"
                  type="number"
                  min="1"
                  value={unitsRequired}
                  onChange={e => setUnitsRequired(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-all placeholder-slate-300"
                  placeholder="e.g. 50"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-100 transition-colors"
              >
                Add to Orders
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col min-h-[250px]">
             <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Current Orders</h2>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-1 px-2 rounded border border-slate-100">{orders.length} ITEMS</span>
             </div>
             {orders.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  No orders added
                </div>
             ) : (
                <div className="space-y-3 overflow-y-auto pr-1">
                  {orders.map(order => {
                    const product = products.find(p => p.id === order.productId);
                    return (
                      <div key={order.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between group hover:border-indigo-200 transition-colors">
                        <div>
                          <div className="text-sm font-bold text-slate-800">{product?.name || 'Unknown'}</div>
                          <div className="flex gap-3 text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                             <span>{order.unitsRequired} units</span>
                             <span>{product?.timeHours} hrs/ea</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
             )}
          </div>

          <div className="bg-indigo-900 rounded-xl p-5 text-white shadow-lg flex-shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Shift Constraints</h2>
            <label className="block text-[10px] uppercase font-bold mb-1.5 opacity-60">Total Available Hours</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={totalTimeMode}
              onChange={(e) => setTotalTimeMode(e.target.value)}
              className="w-full bg-indigo-800 border-none rounded-lg py-2 px-3 text-lg font-mono text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-indigo-400"
            />
            <button
              onClick={handleOptimize}
              disabled={orders.length === 0 || !totalTimeMode}
              className={cn(
                "w-full py-3 rounded-lg font-bold text-[11px] transition-colors uppercase tracking-widest",
                orders.length > 0 && totalTimeMode
                  ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                  : "bg-indigo-800/50 text-indigo-300/50 cursor-not-allowed"
              )}
            >
              Generate Optimized Plan
            </button>
          </div>
        </div>

        {/* Right Side: Results Dashboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!result ? (
            <div className="h-full border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 min-h-[500px] bg-slate-50/50">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <Play className="w-8 h-8 text-slate-300 translate-x-0.5" />
               </div>
               <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Algorithm Standby</p>
               <p className="text-[11px] font-medium max-w-[280px] text-center text-slate-400">Add orders and specify total time available, then click Generate Plan to run the optimization.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 h-full">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Projected Revenue</div>
                    <div className="text-3xl font-bold text-slate-900 font-mono">₹{result.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Time Utilization</div>
                    <div className="text-3xl font-bold text-slate-900 font-mono">{((result.totalTimeConsumed / parseFloat(totalTimeMode)) * 100).toFixed(1)}%</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min((result.totalTimeConsumed / parseFloat(totalTimeMode)) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex justify-between">
                       <span>Items Processed</span>
                       <span className="text-slate-300">/ Total Units</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 font-mono">{result.schedule.filter(s => s.unitsProduced > 0).reduce((acc, curr) => acc + curr.unitsProduced, 0)}</div>
                  </div>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-grow flex flex-col overflow-hidden">
                 <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Optimized Production Schedule</h2>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold rounded uppercase tracking-widest shadow-sm">Queueing Logic: High-Value</span>
                    </div>
                 </div>
                 <div className="flex-grow overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Product Item</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Total Time</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {result.schedule.map((s, idx) => (
                            <tr key={s.orderItemId} className={s.unitsProduced === 0 ? "bg-rose-50/30" : "hover:bg-slate-50"}>
                               <td className="px-6 py-4">
                                  {s.unitsProduced > 0 ? (
                                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                                        {(idx + 1).toString().padStart(2, '0')}
                                     </span>
                                  ) : (
                                     <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-[10px] font-bold">!</span>
                                  )}
                               </td>
                               <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                  {s.product.name}
                                  {s.unfulfilledUnits > 0 && (
                                     <span className={cn(
                                       "text-[10px] px-1.5 py-0.5 rounded ml-2 uppercase font-bold tracking-widest",
                                       s.unitsProduced === 0 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                     )}>
                                        {s.unitsProduced === 0 ? 'UNFULFILLED' : 'PARTIAL'}
                                     </span>
                                  )}
                               </td>
                               <td className="px-6 py-4 text-right font-mono text-sm">
                                  <span className={s.unitsProduced > 0 ? "text-slate-900" : "text-slate-400"}>{s.unitsProduced}</span> 
                                  <span className="text-[10px] text-slate-400 ml-1">/ {s.unitsRequested}</span>
                               </td>
                               <td className="px-6 py-4 text-right font-mono text-slate-500 text-sm">{s.timeConsumed.toFixed(1)} hrs</td>
                               <td className="px-6 py-4 text-right font-bold text-sm text-slate-900">₹{s.revenue.toFixed(2)}</td>
                            </tr>
                         ))}
                         {result.schedule.length === 0 && (
                           <tr>
                             <td colSpan={5} className="px-6 py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                               No schedule generated.
                             </td>
                           </tr>
                         )}
                      </tbody>
                    </table>
                 </div>
                 {result.schedule.some(s => s.unfulfilledUnits > 0) && (
                   <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] font-bold text-slate-500 flex gap-2 items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block flex-shrink-0"></span>
                     <span>Constraint Warning: Not enough time available to completely fulfill all requested priority orders.</span>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
