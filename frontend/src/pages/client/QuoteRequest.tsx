import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '../../services/orderService.js';
import { categoryService } from '../../services/categoryService.js';
import { productService } from '../../services/productService.js';
import type { Category, Product } from '../../services/types.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { Field } from '../../components/ui/Field.js';
import { Button } from '../../components/ui/Button.js';

const quoteSchema = z.object({
  customer_name: z.string().min(2, 'Nom requis'),
  customer_company: z.string().min(2, "Nom de l'entreprise requis"),
  customer_email: z.string().email('Email invalide'),
  customer_phone: z.string().min(8, 'Numéro invalide'),
});

type QuoteForm = z.infer<typeof quoteSchema>;

interface QuoteItem {
  product: Product;
  quantity: number;
}

export function QuoteRequest() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteForm>({ resolver: zodResolver(quoteSchema) });

  useEffect(() => {
    categoryService.getFlat().then(setCategories);
  }, []);
useEffect(() => {
    productService
      .getAll({
        categoryId: categoryId ? Number(categoryId) : undefined,
        limit: 100,
      })
      .then((res) => {
        setProducts(res.items);
        setSelectedProductId('');
      });
  }, [categoryId]);

  const addItem = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + selectedQty }
            : i,
        );
      }
      return [...prev, { product, quantity: selectedQty }];
    });
    setSelectedProductId('');
    setSelectedQty(1);
  };

  const removeItem = (productId: number) => {
    setQuoteItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const onSubmit = async (data: QuoteForm) => {
    setSubmitting(true);
    try {
      await orderService.create({
        type: 'quote',
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_company: data.customer_company,
        items: quoteItems.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#1B3A57] mb-3 font-heading">
          Demande envoyée
        </h1>
        <p className="text-sm text-[#2E2E2E]">
          Merci, notre équipe vous recontactera sous 24h avec votre devis
          personnalisé.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold text-[#1B3A57] mb-2 font-heading">
        Demander un devis
      </h1>
      <p className="text-sm text-[#A6A6A6] mb-6 md:mb-8">
        Sélectionnez les produits et quantités qui vous intéressent, puis
        laissez vos coordonnées — nous revenons vers vous sous 24h.
      </p>

      {/* ---- Sélecteur de produits ---- */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 mb-5">
        <h3 className="text-sm font-semibold text-[#1B3A57] mb-4">
          Produits souhaités
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parent ? `↳ ${c.name}` : c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex-[2] min-w-[200px] max-w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5FA8D3] truncate"
          >
            <option value="">Sélectionner un produit...</option>
            {products.map((p) => (
              <option
                key={p.id}
                value={p.id}
                disabled={p.stock_quantity <= 0}
              >
                {p.name.length > 60 ? `${p.name.slice(0, 60)}…` : p.name}
                {p.stock_quantity <= 0 ? ' (rupture)' : ''}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={selectedQty}
            onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
            className="w-20 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5FA8D3] text-center"
          />

          <Button
            type="button"
            variant="secondary"
            onClick={addItem}
            disabled={!selectedProductId}
            className="whitespace-nowrap"
          >
            Ajouter
          </Button>
        </div>

        {quoteItems.length > 0 ? (
          <div className="space-y-2">
            {quoteItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-[#F7F8FA] rounded-lg px-4 py-2.5"
              >
                <div className="text-sm min-w-0 flex-1">
                  <span className="font-medium text-[#2E2E2E] break-words">
                    {product.name}
                  </span>
                  <span className="text-[#A6A6A6]"> × {quantity}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[#5FA8D3] whitespace-nowrap">
                    ~ {formatPrice(product.retail_price * quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-[#E0212B] text-xs font-semibold whitespace-nowrap"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#A6A6A6]">
            Aucun produit ajouté pour l'instant. Vous pouvez aussi envoyer une
            demande sans produit précis — décrivez votre besoin ci-dessous.
          </p>
        )}
      </div>

      {/* ---- Coordonnées ---- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold text-[#1B3A57]">
          Vos coordonnées
        </h3>
        <Field
          label="Nom complet"
          {...register('customer_name')}
          error={errors.customer_name?.message}
        />
        <Field
          label="Société"
          {...register('customer_company')}
          error={errors.customer_company?.message}
        />
        <Field
          label="Email"
          type="email"
          {...register('customer_email')}
          error={errors.customer_email?.message}
        />
        <Field
          label="Téléphone"
          {...register('customer_phone')}
          error={errors.customer_phone?.message}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Envoi...' : 'Envoyer la demande'}
        </Button>
      </form>
    </div>
  );
}