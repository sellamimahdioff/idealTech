import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  productService,
  uploadService,
} from '../../../services/productService.js';
import { categoryService } from '../../../services/categoryService.js';
import type { Category } from '../../../services/types.js';
import { Field } from '../../../components/ui/Field.js';
import { Button } from '../../../components/ui/Button.js';

export function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    retail_price: '',
    wholesale_price: '',
    wholesale_min_qty: '',
    stock_quantity: '',
    categoryId: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getFlat().then(setCategories);
    if (isEdit) {
      productService.getOne(Number(id)).then((p) => {
        setForm({
          sku: p.sku,
          name: p.name,
          description: p.description ?? '',
          retail_price: String(p.retail_price),
          wholesale_price: p.wholesale_price ? String(p.wholesale_price) : '',
          wholesale_min_qty: p.wholesale_min_qty
            ? String(p.wholesale_min_qty)
            : '',
          stock_quantity: String(p.stock_quantity),
          categoryId: p.category ? String(p.category.id) : '',
        });
        setImages(p.images ?? []);
      });
    }
  }, [id]);

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const results = await uploadService.uploadImages(files);
      const urls = results.map((r) => `${import.meta.env.VITE_API_URL}${r.url}`);
      setImages((prev) => [...prev, ...urls]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        sku: form.sku,
        name: form.name,
        description: form.description || undefined,
        retail_price: Number(form.retail_price),
        wholesale_price: form.wholesale_price
          ? Number(form.wholesale_price)
          : undefined,
        wholesale_min_qty: form.wholesale_min_qty
          ? Number(form.wholesale_min_qty)
          : undefined,
        stock_quantity: Number(form.stock_quantity),
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        images,
      };
      if (isEdit) {
        await productService.update(Number(id), payload);
      } else {
        await productService.create(payload);
      }
      navigate('/admin/produits');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Erreur lors de l'enregistrement.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Référence (SKU)"
            value={form.sku}
            onChange={(e) => updateField('sku', e.target.value)}
            required
          />
          <Field
            label="Nom du produit"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Prix détail (TND)"
            type="number"
            step="0.01"
            value={form.retail_price}
            onChange={(e) => updateField('retail_price', e.target.value)}
            required
          />
          <Field
            label="Stock disponible"
            type="number"
            value={form.stock_quantity}
            onChange={(e) => updateField('stock_quantity', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Prix gros (TND, optionnel)"
            type="number"
            step="0.01"
            value={form.wholesale_price}
            onChange={(e) => updateField('wholesale_price', e.target.value)}
          />
          <Field
            label="Quantité min. pour prix gros"
            type="number"
            value={form.wholesale_min_qty}
            onChange={(e) =>
              updateField('wholesale_min_qty', e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Catégorie
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
          >
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parent ? `↳ ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Images (galerie, jusqu'à 6)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
          />
          {uploading && (
            <span className="text-xs text-[#A6A6A6]">Envoi en cours...</span>
          )}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-2 -right-2 bg-[#E0212B] text-white w-5 h-5 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-[#E0212B]">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/produits')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
