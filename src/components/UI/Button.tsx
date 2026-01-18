import { motion } from 'framer-motion'
import clsx from 'clsx'
import './Button.scss'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}: ButtonProps) => {
  return (
    <motion.button
      className={clsx('retro-button', `retro-button-${variant}`, `retro-button-${size}`, className)}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="button-content">{children}</span>
      <span className="button-glow" />
    </motion.button>
  )
}
