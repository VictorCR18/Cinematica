import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <Film size={40} className="text-accent" />
    <h1 className="mt-4 font-display text-4xl font-semibold text-paper">Corta!</h1>
    <p className="mt-2 text-muted">Esta cena não existe. Página não encontrada.</p>
    <Link to="/" className="mt-6 text-accent hover:text-accent-hover">
      Voltar para o início
    </Link>
  </div>
);
