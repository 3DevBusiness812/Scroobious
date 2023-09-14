import React from 'react'

interface TemplateBaseProps {
  children: React.ReactNode
}

export function TemplateBase({ children }: TemplateBaseProps) {
  return <>{children}</>
}
