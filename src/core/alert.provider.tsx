/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { createContext, useState, useContext, ReactElement } from 'react'
import { Alert as ChakraAlert, AlertIcon, AlertStatus } from '@chakra-ui/react'

interface IAlert {
  isHide?: boolean
  type?: 'notification' | 'critical' | 'passive'
  error?: string
  className?: string
  message?: string | ReactElement
  timeout?: number
  status?: AlertStatus
}

const initialState: IAlert = {
  type: 'notification',
  isHide: true,
}

type IAlertContext = { alert: IAlert; setAlert: React.Dispatch<React.SetStateAction<IAlert>> }

const AlertContext = createContext<IAlertContext>({ alert: initialState, setAlert: () => null })

export const useAlert = () => {
  const alertContext: IAlertContext = useContext(AlertContext)

  if (alertContext === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }

  return alertContext
}

function RenderAlert() {
  const { alert, setAlert }: IAlertContext = useContext(AlertContext)

  if (alert?.isHide) {
    return null
  }

  setTimeout(() => {
    setAlert(initialState)
  }, alert?.timeout || 6000)

  if (alert.error) {
    console.error(alert['error'])
  }

  switch (alert.type) {
    case 'notification':
      return (
        <ChakraAlert status={alert.status}>
          <AlertIcon />
          {alert.message}
        </ChakraAlert>
      )
    case 'critical':
      window.alert(alert.message)
      return null
    case 'passive':
      return null // We've already logged the error so there is nothing to do.
    default:
      break
  }

  return null
}

const AlertProvider = ({ children }: any) => {
  const [alert, setAlert] = useState(initialState)

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {alert && <RenderAlert />}
      {children}
    </AlertContext.Provider>
  )
}

export default AlertProvider
