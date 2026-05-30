import React, { useState } from 'react';
import { ProductMasterData } from './components/ProductMasterData';
import { CustomerOrdersPlanning } from './components/CustomerOrdersPlanning';
import { Product, OrderItem } from './types';
import { Blocks } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  
  // Minimal seed data for easy demonstration
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Premium Car', price: 10, timeHours: 4 },
    { id: '2', name: 'Budget Car', price: 1, timeHours: 1 },
    { id: '3', name: 'Standard Car', price: 5, timeHours: 2.5 },
  ]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex flex-shrink-0 items-center justify-between z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Blocks className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
            Factory <span className="text-indigo-600">Optimizer</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest">
          <button 
            onClick={() => setCurrentPage(1)}
            className={`flex items-center gap-2 transition-colors ${currentPage === 1 ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${currentPage === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>01</span>
            <span className="hidden sm:inline">Master Data</span>
          </button>
          <div className="w-8 h-[2px] bg-slate-200"></div>
          <button 
            onClick={() => setCurrentPage(2)}
            className={`flex items-center gap-2 transition-colors ${currentPage === 2 ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${currentPage === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>02</span>
            <span className="hidden sm:inline">Orders & Plan</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto p-4 sm:p-6 pb-12">
        {currentPage === 1 ? (
          <ProductMasterData
            products={products}
            setProducts={setProducts}
            onNext={() => setCurrentPage(2)}
          />
        ) : (
          <CustomerOrdersPlanning
            products={products}
            orders={orders}
            setOrders={setOrders}
            onBack={() => setCurrentPage(1)}
          />
        )}
      </main>
      
      <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between flex-shrink-0 w-full mt-auto">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">© 2026 OptiFlow Analytics</div>
        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          System Ready
        </div>
      </footer>
    </div>
  );
}
