'use client'

import React from 'react'
import { toast as sonnerToast } from 'sonner'

interface ToastProps {
  id: string | number
  title: string
  description: string
  variant?: 'default' | 'error' | 'success' | 'info'
  action?: {
    label: string
    onClick: () => void
  }
}

export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      variant={toast.variant || 'default'}
      action={toast.action}
    />
  ))
}

function Toast(props: ToastProps) {
  const { title, description, action, id, variant = 'default' } = props

  const variantStyles = {
    default: 'border-l-primary',
    error: 'border-l-destructive',
    success: 'border-l-green-500',
    info: 'border-l-blue-500',
  }

  return (
    <div
      className={`flex w-full border border-border bg-background shadow-md rounded-md overflow-hidden border-l-4 ${variantStyles[variant]}`}
    >
      <div className="flex-1 p-4">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {action && (
        <div className="flex items-center pr-4">
          <button
            className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            onClick={() => {
              action.onClick()
              sonnerToast.dismiss(id)
            }}
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  )
}
