import { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="mb-12 text-center scroll-mt-24">
      <h2 className="colorful-heading font-display text-2xl font-bold tracking-wide sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">{subtitle}</p>
      )}
      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
    </div>
  );
}

export function NeonCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glow-border rounded-xl bg-[rgba(10,20,40,0.6)] p-6 backdrop-blur-sm transition-all hover:border-neon-cyan/60 hover:shadow-[0_0_30px_rgba(0,212,255,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

export function NeonButton({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`neon-gradient rounded-full px-8 py-3 font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function FormField({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-neon-cyan"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-lg border border-neon-cyan/25 bg-bg-dark/80 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50";
