import { AppNavigation } from '@components'
import React, {useEffect, useState} from 'react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  
  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false);
    },250)
  }

  useEffect(() => {
    loaderTimeout();
  }, [])
  return (
    <>
      <AppNavigation isLoading={loading}>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-gray-200 border-dashed rounded-lg h-96" />
            </div>
            {/* /End replace */}
          </div>
        </main>
      </AppNavigation>
    </>
  )
}
