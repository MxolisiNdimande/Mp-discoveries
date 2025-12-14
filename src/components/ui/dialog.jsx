import React from 'react'

export function Dialog({ open, onOpenChange, ...props }) {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      {props.children}
    </div>
  )
}

export function DialogTrigger({ asChild = false, ...props }) {
  return <div {...props} />
}

export function DialogContent({ className = "", children, ...props }) {
  return (
    <div
      className={`
        fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
  )
}

export function DialogTitle({ className = "", ...props }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
  )
}

export function DialogDescription({ className = "", ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  )
}