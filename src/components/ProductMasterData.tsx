import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductMasterDataProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onNext: () => void;
}

export function ProductMasterData({ products, setProducts, onNext }: ProductMasterDataProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [timeHours, setTimeHours] = useState<string>('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !timeHours) return;

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      price: parseFloat(price),
      timeHours: parseFloat(timeHours),
    };

    setProducts([...products, newProduct]);
    setName('');
    setPrice('');
    setTimeHours('');
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Product Master Data</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Build your catalog of manufacturing capabilities.</p>
        </div>
        <button
          onClick={onNext}
          disabled={products.length === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-colors",
            products.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed hidden sm:flex"
          )}
        >
          Next: Enter Orders
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-5">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Product Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-all placeholder-slate-300"
                placeholder="e.g. Machined Valve-X"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Selling Price (₹)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-all placeholder-slate-300"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Production Time (Hours)</label>
              <input
                id="time"
                type="number"
                min="0"
                step="0.1"
                value={timeHours}
                onChange={e => setTimeHours(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-all placeholder-slate-300"
                placeholder="e.g. 2.5"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add to Catalog
            </button>
          </form>
        </div>

        <div className="md:col-span-8 flex flex-col h-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Product Catalog</h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white py-1 px-2 rounded border border-slate-200 shadow-sm">{products.length} Items</div>
             </div>
             {products.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                     <Plus className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No products added</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-2">Add your first product to begin planning.</p>
                </div>
             ) : (
                <div className="flex-grow p-5 overflow-y-auto">
                  <div className="space-y-3">
                    {products.map(product => (
                      <div key={product.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all hover:shadow-sm">
                        <div>
                          <div className="text-sm font-bold text-slate-800">{product.name}</div>
                          <div className="flex gap-4 text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            <span className="text-emerald-600">₹{product.price.toFixed(2)} / unit</span>
                            <span>{product.timeHours} hrs</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:opacity-100"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             )}
          </div>
          
          <div className="mt-4 sm:hidden">
            <button
               onClick={onNext}
               disabled={products.length === 0}
               className={cn(
                 "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-colors",
                 products.length > 0
                   ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
               )}
             >
               Next: Enter Orders
               <ArrowRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
