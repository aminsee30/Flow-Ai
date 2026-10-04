import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductService } from '../../types';

export const ProductsView: React.FC = () => {
  const { workspace, saveProduct, deleteProduct, lang } = useApp();
  const isRtl = lang === 'fa';

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [benefits, setBenefits] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainCta, setMainCta] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setFeatures('');
    setBenefits('');
    setTargetAudience('');
    setMainCta('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (p: ProductService) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setFeatures(p.features);
    setBenefits(p.benefits);
    setTargetAudience(p.targetAudience);
    setMainCta(p.mainCta);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const newProduct: ProductService = {
      id: editingId || 'prod-' + Date.now(),
      name: name.trim(),
      description: description.trim(),
      features: features.trim(),
      benefits: benefits.trim(),
      targetAudience: targetAudience.trim(),
      mainCta: mainCta.trim() || 'ارسال پیام در دایرکت',
    };

    await saveProduct(newProduct);
    resetForm();
  };

  const products = workspace?.products || [];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'کاتالوگ محصولات و خدمات (Products & Services)' : 'Products & Services'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'اطلاعات کامل محصولات برای ارجاع خودکار در سناریونویسی، هوک‌ها، کاروسل‌ها و دعوت به اقدام‌ها'
              : 'Add your offerings so AI embeds features, benefits, and exact CTAs naturally.'}
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'افزودن محصول یا خدمت جدید' : 'Add Product'}</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal Card */}
      {showAddForm && (
        <div className="glass-panel rounded-2xl p-6 border-indigo-500/40 space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white">
              {editingId ? (isRtl ? 'ویرایش مشخصات محصول' : 'Edit Product') : (isRtl ? 'ثبت محصول یا خدمت جدید' : 'New Product')}
            </h3>
            <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white">
              انصراف
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                نام محصول یا خدمت *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: دوره تخصصی سناریونویسی، پکیج طراحی سایت..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                دعوت به اقدام اصلی (Main CTA)
              </label>
              <input
                type="text"
                value={mainCta}
                onChange={(e) => setMainCta(e.target.value)}
                placeholder="مثال: کلمه «سناریو» رو دایرکت بفرست تا سرفصل‌ها برات ارسال بشه"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">توضیح کلی</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیح کوتاه اینکه این محصول چه کمکی می‌کند..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                ویژگی‌های کلیدی (Features)
              </label>
              <textarea
                rows={2}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="مثال: ۵۰ قالب آماده، پشتیبانی ۶ ماهه..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                مزایا و نتایج ملموس (Benefits)
              </label>
              <textarea
                rows={2}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="مثال: صرفه‌جویی در ۸۰٪ زمان، افزایش ۳ برابری فروش..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                مخاطب خاص این محصول
              </label>
              <textarea
                rows={2}
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="مثال: مدرسان آنلاین و بلاگرهای تخصصی..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'ذخیره محصول در حافظه برند' : 'Save Product'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-xs text-slate-500">
            هنوز محصولی در حافظه برند ثبت نشده است. روی «افزودن محصول» کلیک کنید.
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-5 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-400" />
                    <span>{p.name}</span>
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="ویرایش"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] mt-3 pt-3 border-t border-slate-800/80">
                  {p.features && (
                    <div>
                      <span className="text-slate-500 block mb-0.5">ویژگی‌ها:</span>
                      <span className="text-slate-300">{p.features}</span>
                    </div>
                  )}
                  {p.benefits && (
                    <div>
                      <span className="text-slate-500 block mb-0.5">مزایا و فایده:</span>
                      <span className="text-emerald-400 font-medium">{p.benefits}</span>
                    </div>
                  )}
                </div>
              </div>

              {p.mainCta && (
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs">
                  <span className="text-amber-400 font-bold ml-1">CTA هدف:</span>
                  <span className="text-slate-200">{p.mainCta}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
