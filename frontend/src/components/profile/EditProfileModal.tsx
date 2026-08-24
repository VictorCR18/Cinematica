import { useState, useEffect, type FormEvent } from 'react';
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe, changeMyPassword } from '../../lib/api/users';
import { useAuthStore } from '../../store/auth-store';
import { getApiErrorMessage } from '../../lib/api-client';
import { Button } from '../ui/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  viewer: any;
}

export const EditProfileModal = ({ isOpen, onClose, profile, viewer }: EditProfileModalProps) => {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((s) => s.setUser);

  const [profileForm, setProfileForm] = useState({ name: '', bio: '', avatarUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, next: false, confirm: false });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setProfileForm({
        name: profile.name ?? '',
        bio: profile.bio ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setMessage(null);
    }
  }, [isOpen, profile]);

  const updateProfileMutation = useMutation({ mutationFn: updateMe });
  const changePasswordMutation = useMutation({ mutationFn: changeMyPassword });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const updatedUser = await updateProfileMutation.mutateAsync({
        name: profileForm.name.trim(),
        bio: profileForm.bio.trim(),
        avatarUrl: profileForm.avatarUrl.trim(),
      });
      
      setAuthUser(viewer ? { ...viewer, ...updatedUser } : updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile', profile.username] });

      const isChangingPassword = passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmNewPassword;
      
      if (isChangingPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
          setMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
          setIsLoading(false);
          return;
        }
        await changePasswordMutation.mutateAsync(passwordForm);
      }

      setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' });
      
      setTimeout(() => onClose(), 1500);

    } catch (error) {
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Ocorreu um erro ao salvar as alterações.') });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-border bg-panel p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-paper transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl font-semibold text-paper mb-6">Editar perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-paper-dim uppercase tracking-wider">Informações Públicas</h3>
            
            <div>
              <label className="text-xs text-muted" htmlFor="profile-name">Nome</label>
              <input
                id="profile-name"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs text-muted" htmlFor="profile-avatar">URL do avatar</label>
              <input
                id="profile-avatar"
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-xs text-muted" htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-paper-dim uppercase tracking-wider">Alterar Senha <span className="text-muted text-xs normal-case font-normal">(opcional)</span></h3>
            
            <div>
              <label className="text-xs text-muted" htmlFor="current-password">Senha atual</label>
              <div className="relative mt-1">
                <input
                  id="current-password"
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition hover:text-paper"
                >
                  {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted" htmlFor="new-password">Nova senha</label>
                <div className="relative mt-1">
                  <input
                    id="new-password"
                    type={showPassword.next ? 'text' : 'password'}
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted" htmlFor="confirm-new-password">Confirmar senha</label>
                <div className="relative mt-1">
                  <input
                    id="confirm-new-password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    minLength={8}
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
                    className="w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle size={15} className="animate-spin" />}
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};