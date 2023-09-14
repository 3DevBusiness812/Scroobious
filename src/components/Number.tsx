import React from 'react'

interface NumberProps {
  value: number
}

export function Number({ value }: NumberProps) {
  return <span>{value && value.toLocaleString()}</span>
}
