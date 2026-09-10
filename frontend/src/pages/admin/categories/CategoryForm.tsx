import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../../../services/categoryService.js';
import { uploadService } from '../../../services/productService.js';
import type { Category } from '../../../services/types.js';
import { slugify } from '../../../utils/formatPrice.js';
import { Field } from '../../../components/ui/Field.js';
import { Button } from '../../../components/ui/Button.js';

export function CategoryForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getFlat().then(setCategories);
    if (isEdit) {
      categoryService.getOne(Number(id)).then((cat) => {
        setName(cat.name);
        setSlug(cat.slug);
        setImageUrl(cat.image_url ?? '');
        setParentId(cat.parent ? String(cat.parent.id) : '');
      });
    }
  }, [id]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit) setSlug(slugify(value));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      setImageUrl(`${import.meta.env.VITE_API_URL}${url}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name,
        slug,
        image_url: imageUrl || undefined,
        parentId: parentId ? Number(parentId) : undefined,
      };
      if (isEdit) {
        await categoryService.update(Number(id), payload);
      } else {
        await categoryService.create(payload);
      }
      navigate('/admin/categories');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
      >
        <Field
          label="Nom"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
        <Field
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">
            Catégorie parente (optionnel)
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
          >
            <option value="">Aucune (catégorie racine)</option>
            {categories
              .filter((c) => c.id !== Number(id) && !c.parent)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2E2E2E]">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && (
            <span className="text-xs text-[#A6A6A6]">Envoi en cours...</span>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Aperçu"
              className="w-24 h-24 object-cover rounded-lg mt-2"
            />
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
            onClick={() => navigate('/admin/categories')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
