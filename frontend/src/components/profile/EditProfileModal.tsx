import { useState, useEffect, type FormEvent } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe } from '../../lib/api/users';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setProfileForm({
        name: profile.name ?? '',
        bio: profile.bio ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      });
      setMessage(null);
    }
  }, [isOpen, profile]);

  const updateProfileMutation = useMutation({ mutationFn: updateMe });

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