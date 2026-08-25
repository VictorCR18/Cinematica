import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '../lib/api-client';
import { changeMyEmail, changeMyPassword, getMySettings, updateMySettings } from '../lib/api/users';
import { useAuthStore } from '../store/auth-store';
import { Button } from '../components/ui/Button';

const privacyOptions = [
  { key: 'diaryPublic', label: 'Diário', description: 'Permitir que outras pessoas vejam seu diário de filmes.' },
  { key: 'reviewsPublic', label: 'Resenhas', description: 'Permitir que outras pessoas vejam suas resenhas.' },
  { key: 'watchlistPublic', label: 'Watchlist', description: 'Permitir que outras pessoas vejam seus filmes para assistir.' },
  { key: 'listsPublic', label: 'Listas', description: 'Permitir que outras pessoas vejam suas listas.' },
] as const;

type SettingsForm = Record<(typeof privacyOptions)[number]['key'], boolean>;

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const viewer = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [privacy, setPrivacy] = useState<SettingsForm>({ diaryPublic: true, reviewsPublic: true, watchlistPublic: true, listsPublic: true });
  const [email, setEmail] = useState('');
  const [currentEmailPassword, setCurrentEmailPassword] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getMySettings });
  const settingsMutation = useMutation({ mutationFn: updateMySettings });
  const emailMutation = useMutation({ mutationFn: changeMyEmail });
  const passwordMutation = useMutation({ mutationFn: changeMyPassword });

  useEffect(() => {
    if (!settings) return;
    setPrivacy({
      diaryPublic: settings.diaryPublic,
      reviewsPublic: settings.reviewsPublic,
      watchlistPublic: settings.watchlistPublic,
      listsPublic: settings.listsPublic,
    });
    setEmail(settings.email);
  }, [settings]);

  const savePrivacy = async (key: keyof SettingsForm, value: boolean) => {
    setMessage(null);
    setPrivacy((current) => ({ ...current, [key]: value }));
    try {
      await settingsMutation.mutateAsync({ [key]: value });
      await queryClient.invalidateQueries({ queryKey: ['profile', viewer?.username] });
      setMessage({ type: 'success', text: 'Preferência de privacidade salva.' });
    } catch (error) {
      setPrivacy((current) => ({ ...current, [key]: !value }));
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Não foi possível salvar a preferência.') });
    }
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    try {
      const updated = await emailMutation.mutateAsync({ email: email.trim(), currentPassword: currentEmailPassword });
      if (viewer) setUser({ ...viewer, email: updated.email });
      setCurrentEmailPassword('');
      setMessage({ type: 'success', text: 'E-mail atualizado com sucesso.' });
    } catch (error) {
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Não foi possível atualizar o e-mail.') });
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
      return;
    }
    try {
      await passwordMutation.mutateAsync(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso.' });
    } catch (error) {
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Não foi possível alterar a senha.') });
    }
  };

  if (isLoading || !settings) return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted">Carregando configurações...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Conta</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Configurações</h1>
        <p className="mt-2 text-sm text-muted">Controle o que outras pessoas podem ver e mantenha seus dados atualizados.</p>
      </div>

      {message && <p className={`mb-6 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>}

      <section className="border-y border-border py-6">
        <div className="mb-5 flex items-center gap-3"><ShieldCheck className="text-accent" size={20} /><div><h2 className="font-display text-xl text-paper">Privacidade</h2><p className="text-sm text-muted">Você sempre poderá ver o próprio conteúdo.</p></div></div>
        <div className="divide-y divide-border">
          {privacyOptions.map((option) => (
            <label key={option.key} className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span><span className="block text-sm text-paper">{option.label}</span><span className="mt-1 block text-xs text-muted">{option.description}</span></span>
              <input
                type="checkbox"
                checked={privacy[option.key]}
                onChange={(event) => savePrivacy(option.key, event.target.checked)}
                className="h-5 w-5 accent-accent"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="border-b border-border py-6">
        <div className="mb-5 flex items-center gap-3"><Mail className="text-accent" size={20} /><div><h2 className="font-display text-xl text-paper">E-mail</h2><p className="text-sm text-muted">Seu e-mail atual: {settings.email}</p></div></div>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Novo e-mail" className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-accent" />
          <input type="password" required value={currentEmailPassword} onChange={(event) => setCurrentEmailPassword(event.target.value)} placeholder="Senha atual" className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-accent" />
          <Button type="submit" disabled={emailMutation.isPending}>{emailMutation.isPending ? 'Salvando...' : 'Salvar e-mail'}</Button>
        </form>
      </section>

      <section className="border-b border-border py-6">
        <div className="mb-5 flex items-center gap-3"><LockKeyhole className="text-accent" size={20} /><div><h2 className="font-display text-xl text-paper">Senha</h2><p className="text-sm text-muted">Use uma senha com pelo menos 8 caracteres.</p></div></div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input type="password" required value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} placeholder="Senha atual" className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-accent" />
          <div className="relative"><input type={showPassword ? 'text' : 'password'} required minLength={8} value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} placeholder="Nova senha" className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 pr-10 text-sm text-paper outline-none focus:border-accent" /><button type="button" onClick={() => setShowPassword((show) => !show)} aria-label="Mostrar ou ocultar senha" className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
          <input type={showPassword ? 'text' : 'password'} required minLength={8} value={passwordForm.confirmNewPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmNewPassword: event.target.value })} placeholder="Confirmar nova senha" className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-accent" />
          <Button type="submit" disabled={passwordMutation.isPending}>{passwordMutation.isPending ? 'Salvando...' : 'Alterar senha'}</Button>
        </form>
      </section>
    </div>
  );
};
