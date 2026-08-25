import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Film } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { getApiErrorMessage } from "../lib/api-client";

type Field = "name" | "username" | "email" | "password";

const validators: Record<Field, (value: string) => string | null> = {
  name: (value) =>
    value.trim().length < 2 ? "Digite seu nome completo" : null,
  username: (value) => {
    if (value.length < 3) return "Use pelo menos 3 caracteres";
    if (!/^[a-z0-9_]+$/.test(value)) {
      return "Use apenas letras minúsculas, números e _ (sem espaços, acentos ou outros símbolos)";
    }
    return null;
  },
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Digite um e-mail válido",
  password: (value) =>
    value.length < 8 ? "A senha precisa ter pelo menos 8 caracteres" : null,
};

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<Field, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateField = (field: Field, value: string) => {
    const message = validators[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
    return message;
  };

  const handleChange =
    (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "username" ? e.target.value.toLowerCase() : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (touched[field]) validateField(field, value);
    };

  const handleBlur = (field: Field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field, form[field]);
  };

  const validateAll = () => {
    const fields: Field[] = ["name", "username", "email", "password"];
    const results = fields.map((field) => validateField(field, form[field]));
    setTouched({ name: true, username: true, email: true, password: true });
    return results.every((message) => message === null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAll()) return;

    try {
      await register.mutateAsync(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível criar sua conta"));
    }
  };

  const inputClasses = (field: Field) =>
    [
      "mt-1.5 w-full rounded-lg border bg-ink px-3 py-2.5 text-sm outline-none transition-colors",
      touched[field] && fieldErrors[field]
        ? "border-accent focus:border-accent"
        : "border-border-strong focus:border-accent",
    ].join(" ");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Film className="text-accent" size={32} />
          <h1 className="mt-3 font-display text-3xl font-semibold text-paper">
            Crie sua conta
          </h1>
          <p className="mt-1 text-sm text-muted">
            Comece a registrar os filmes que você assiste
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-card border border-border bg-panel p-6"
        >
          <div>
            <label className="text-xs text-muted" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              value={form.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              aria-invalid={Boolean(touched.name && fieldErrors.name)}
              aria-describedby="name-error"
              className={inputClasses("name")}
            />
            {touched.name && fieldErrors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-accent">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted" htmlFor="username">
              Nome de usuário
            </label>
            <input
              id="username"
              value={form.username}
              onChange={handleChange("username")}
              onBlur={handleBlur("username")}
              aria-invalid={Boolean(touched.username && fieldErrors.username)}
              aria-describedby="username-error"
              className={inputClasses("username")}
            />
            {touched.username && fieldErrors.username ? (
              <p id="username-error" className="mt-1.5 text-xs text-accent">
                {fieldErrors.username}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-muted">
                Apenas letras minúsculas, números e _
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              aria-invalid={Boolean(touched.email && fieldErrors.email)}
              aria-describedby="email-error"
              className={inputClasses("email")}
            />
            {touched.email && fieldErrors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-accent">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted" htmlFor="password">
              Senha
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                aria-invalid={Boolean(touched.password && fieldErrors.password)}
                aria-describedby="password-error"
                className={[
                  "w-full rounded-lg border bg-ink px-3 py-2.5 pr-10 text-sm outline-none transition-colors",
                  touched.password && fieldErrors.password
                    ? "border-accent focus:border-accent"
                    : "border-border-strong focus:border-accent",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition hover:text-paper"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && fieldErrors.password && (
              <p id="password-error" className="mt-1.5 text-xs text-accent">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending}
          >
            {register.isPending ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link to="/entrar" className="text-accent hover:text-accent-hover">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
