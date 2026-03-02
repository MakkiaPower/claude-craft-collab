import { useState } from "react";

export interface PersonBirthData {
  nome: string;
  cognome: string;
  dataNascita: string;
  oraNascita: string;
  luogoNascita: string;
}

const emptyPerson = (): PersonBirthData => ({
  nome: "",
  cognome: "",
  dataNascita: "",
  oraNascita: "",
  luogoNascita: "",
});

interface BirthDataFormProps {
  type: "tema-natale" | "affinita";
  onComplete: (note: string) => void;
  isLoading: boolean;
}

const Field = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) => (
  <div>
    <label className="block text-[0.65rem] font-semibold uppercase tracking-[1px] text-muted-foreground mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded border px-3 py-2.5 text-sm font-medium bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors ${
        error ? "border-destructive" : "border-input focus:border-primary"
      }`}
    />
  </div>
);

const PersonFields = ({
  label,
  data,
  onChange,
  errors,
}: {
  label?: string;
  data: PersonBirthData;
  onChange: (d: PersonBirthData) => void;
  errors: Record<string, boolean>;
}) => (
  <div className="space-y-2.5">
    {label && (
      <p className="text-xs font-extrabold uppercase tracking-[1.5px] text-primary">{label}</p>
    )}
    <div className="grid grid-cols-2 gap-2">
      <Field label="Nome" placeholder="Mario" value={data.nome} onChange={(v) => onChange({ ...data, nome: v })} error={errors.nome} />
      <Field label="Cognome" placeholder="Rossi" value={data.cognome} onChange={(v) => onChange({ ...data, cognome: v })} error={errors.cognome} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Data di nascita" type="date" placeholder="" value={data.dataNascita} onChange={(v) => onChange({ ...data, dataNascita: v })} error={errors.dataNascita} />
      <Field label="Ora di nascita" type="time" placeholder="" value={data.oraNascita} onChange={(v) => onChange({ ...data, oraNascita: v })} error={errors.oraNascita} />
    </div>
    <Field label="Luogo di nascita" placeholder="Roma, Italia" value={data.luogoNascita} onChange={(v) => onChange({ ...data, luogoNascita: v })} error={errors.luogoNascita} />
  </div>
);

function validatePerson(p: PersonBirthData): Record<string, boolean> {
  return {
    nome: !p.nome.trim(),
    cognome: !p.cognome.trim(),
    dataNascita: !p.dataNascita,
    oraNascita: !p.oraNascita,
    luogoNascita: !p.luogoNascita.trim(),
  };
}

function formatPersonNote(p: PersonBirthData, label?: string): string {
  const lines = [];
  if (label) lines.push(`--- ${label} ---`);
  lines.push(`Nome: ${p.nome.trim()} ${p.cognome.trim()}`);
  lines.push(`Data di nascita: ${p.dataNascita}`);
  lines.push(`Ora di nascita: ${p.oraNascita}`);
  lines.push(`Luogo di nascita: ${p.luogoNascita.trim()}`);
  return lines.join("\n");
}

const BirthDataForm = ({ type, onComplete, isLoading }: BirthDataFormProps) => {
  const isAffinita = type === "affinita";
  const [person1, setPerson1] = useState<PersonBirthData>(emptyPerson());
  const [person2, setPerson2] = useState<PersonBirthData>(emptyPerson());
  const [errors1, setErrors1] = useState<Record<string, boolean>>({});
  const [errors2, setErrors2] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const e1 = validatePerson(person1);
    setErrors1(e1);

    if (isAffinita) {
      const e2 = validatePerson(person2);
      setErrors2(e2);
      if (Object.values(e1).some(Boolean) || Object.values(e2).some(Boolean)) return;
      const note = [formatPersonNote(person1, "PERSONA 1"), formatPersonNote(person2, "PERSONA 2")].join("\n\n");
      onComplete(note);
    } else {
      if (Object.values(e1).some(Boolean)) return;
      onComplete(formatPersonNote(person1));
    }
  };

  return (
    <div className="space-y-4 border-t border-input pt-4">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[1.5px] text-foreground mb-1">
          {isAffinita ? "Dati di nascita delle due persone" : "Dati di nascita"}
        </p>
        <p className="text-[0.68rem] text-muted-foreground">
          {isAffinita
            ? "Servono per calcolare l'affinità astrologica tra voi due."
            : "Servono per calcolare il tuo tema natale. Sii preciso, bastardo."}
        </p>
      </div>

      <PersonFields
        label={isAffinita ? "Persona 1" : undefined}
        data={person1}
        onChange={setPerson1}
        errors={errors1}
      />

      {isAffinita && (
        <PersonFields
          label="Persona 2"
          data={person2}
          onChange={setPerson2}
          errors={errors2}
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full rounded bg-primary px-4 py-3.5 text-[0.82rem] font-extrabold uppercase tracking-[2px] text-primary-foreground transition-all hover:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Salvando..." : "Conferma e vai al checkout"}
      </button>
    </div>
  );
};

export default BirthDataForm;
