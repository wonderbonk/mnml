import clsx from 'clsx'
import './Input.scss'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  error?: string
  label?: string
  className?: string
}

export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  label,
  className,
}: InputProps) => {
  return (
    <div className={clsx('retro-input-container', className)}>
      {label && <label className="retro-input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx('retro-input', error && 'retro-input-error')}
      />
      {error && <span className="retro-input-error-text">{error}</span>}
    </div>
  )
}

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  rows?: number
  className?: string
}

export const TextArea = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  label,
  rows = 4,
  className,
}: TextAreaProps) => {
  return (
    <div className={clsx('retro-input-container', className)}>
      {label && <label className="retro-input-label">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={clsx('retro-input', 'retro-textarea', error && 'retro-input-error')}
      />
      {error && <span className="retro-input-error-text">{error}</span>}
    </div>
  )
}
