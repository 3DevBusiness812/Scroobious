import React from 'react'

interface FormHeaderProps {
  children: React.ReactNode
}

export function FormHeader({ children }: FormHeaderProps) {
  return <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">{children}</h2>
}
