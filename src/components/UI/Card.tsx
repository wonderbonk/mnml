import { motion } from 'framer-motion'
import clsx from 'clsx'
import './Card.scss'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  interactive?: boolean
  onClick?: () => void
}

export const Card = ({ children, className, glow = false, interactive = false, onClick }: CardProps) => {
  const Component = interactive ? motion.div : 'div'

  return (
    <Component
      className={clsx('retro-card', glow && 'retro-card-glow', interactive && 'retro-card-interactive', className)}
      onClick={onClick}
      {...(interactive && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      })}
    >
      {children}
    </Component>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return <div className={clsx('card-header', className)}>{children}</div>
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody = ({ children, className }: CardBodyProps) => {
  return <div className={clsx('card-body', className)}>{children}</div>
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter = ({ children, className }: CardFooterProps) => {
  return <div className={clsx('card-footer', className)}>{children}</div>
}
