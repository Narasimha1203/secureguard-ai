import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Password field with show/hide and clear controls.
 * The value lives only in the parent's React state. It is never stored or logged.
 */
export function PasswordInput({ id, label, value, onChange, onClear }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const handleClear = () => {
    setVisible(false); // Always return to hidden after clearing.
    onClear();
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name="sg-password-test-field"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
          aria-describedby={`${id}-hint`}
          placeholder="Type or paste a password"
          className="w-full rounded-xl border border-white/10 bg-navy-950/70 py-3 pl-4 pr-14 font-mono text-base text-white placeholder:font-sans placeholder:text-slate-500 focus:border-neon-cyan/60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <p id={`${id}-hint`} className="mt-2 text-xs text-slate-500">
        Analysis happens in your browser. The password is not saved, logged or put in the page address.
      </p>
      <div className="mt-3">
        <Button variant="ghost" icon={<Trash2 className="h-4 w-4" aria-hidden="true" />} onClick={handleClear} disabled={value.length === 0}>
          Clear password
        </Button>
      </div>
    </div>
  );
}
