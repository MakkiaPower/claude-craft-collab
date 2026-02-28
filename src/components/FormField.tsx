interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error: boolean;
  errorMessage: string;
  hint?: string;
  onChange: (value: string) => void;
}

const FormField = ({ label, type, placeholder, value, error, errorMessage, hint, onChange }: FormFieldProps) => (
  <div className="mb-3.5 text-left">
    <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error}
      aria-describedby={error ? `${label}-error` : undefined}
      className={`w-full rounded bg-transparent border px-[18px] py-4 text-[0.95rem] font-medium text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal outline-none transition-colors duration-200 ${
        error ? "border-destructive" : "border-input focus:border-primary"
      }`}
    />
    {hint && !error && (
      <p className="mt-1.5 text-[0.7rem] text-muted-foreground">{hint}</p>
    )}
    {error && (
      <p id={`${label}-error`} className="mt-1.5 text-[0.72rem] font-medium text-destructive" role="alert">
        {errorMessage}
      </p>
    )}
  </div>
);

export default FormField;
