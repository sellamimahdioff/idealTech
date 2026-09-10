import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../../store/cartStore.js';
import { orderService } from '../../services/orderService.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { countries, tunisianRegions } from '../../utils/countries.js';
import { Field } from '../../components/ui/Field.js';
import { Button } from '../../components/ui/Button.js';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Nom requis'),
  customer_email: z.string().email('Email invalide'),
  phone_local: z.string().min(6, 'Numéro invalide'),
  country: z.string().min(1, 'Pays requis'),
  region: z.string().optional(),
  shipping_address: z.string().min(5, 'Adresse requise'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { items, totalAmount, clear } = useCartStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'Tunisie' },
  });

  const selectedCountry = watch('country');
  const selectedCountryData = countries.find((c) => c.name === selectedCountry);
  const isTunisia = selectedCountry === 'Tunisie';

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    setError('');
    try {
      const fullPhone = `${selectedCountryData?.dialCode ?? ''} ${data.phone_local}`.trim();
      const order = await orderService.create({
        type: 'order',
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: fullPhone,
        customer_country: data.country,
        customer_region: data.region,
        shipping_address: data.shipping_address,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      clear();
      navigate(`/confirmation/${order.order_number}`);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <p className="max-w-3xl mx-auto px-6 py-16 text-center text-sm">
        Votre panier est vide.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Finaliser la commande
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6"
      >
        <Field
          label="Nom complet"
          {...register('customer_name')}
          error={errors.customer_name?.message}
        />
        <Field
          label="Email"
          type="email"
          {...register('customer_email')}
          error={errors.customer_email?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#2E2E2E]">Pays</label>
            <select
              {...register('country')}
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#2E2E2E]">
              Téléphone
            </label>
            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg text-sm text-[#A6A6A6] bg-gray-50">
                {selectedCountryData?.dialCode ?? '+216'}
              </span>
              <input
                type="tel"
                {...register('phone_local')}
                placeholder="12 345 678"
                className="flex-1 border border-gray-200 rounded-r-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
              />
            </div>
            {errors.phone_local && (
              <span className="text-xs text-[#E0212B]">
                {errors.phone_local.message}
              </span>
            )}
          </div>
        </div>

        {/* Région : liste déroulante pour la Tunisie, champ libre sinon */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Région / Gouvernorat
          </label>
          {isTunisia ? (
            <select
              {...register('region')}
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
            >
              <option value="">Sélectionner...</option>
              {tunisianRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...register('region')}
              placeholder="Région / État / Province"
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
            />
          )}
        </div>

        <Field
          label="Adresse de livraison"
          {...register('shipping_address')}
          error={errors.shipping_address?.message}
        />

        {error && <p className="text-sm text-[#E0212B]">{error}</p>}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-[#2E2E2E]">
            Total : <strong>{formatPrice(totalAmount())}</strong>
          </span>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Confirmer la commande'}
          </Button>
        </div>
      </form>
    </div>
  );
}
