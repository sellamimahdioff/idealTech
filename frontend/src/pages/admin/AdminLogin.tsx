import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuthStore } from '../../store/authStore.js';
import { Field } from '../../components/ui/Field.js';
import { Button } from '../../components/ui/Button.js';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.access_token);
      navigate('/admin');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B3A57] flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="w-2 h-2 rounded-full bg-[#E0212B]" />
          <span className="font-extrabold text-lg font-heading text-[#5FA8D3]">
            iDeal <em className="text-[#E0212B] not-italic">Tech</em>
          </span>
        </div>
        <h1 className="text-center text-sm text-[#A6A6A6] mb-4">
          Espace administrateur
        </h1>

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-[#E0212B]">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
}
