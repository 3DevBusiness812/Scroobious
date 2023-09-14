import { Grid, GridItem } from '@chakra-ui/react'
import React from 'react'
import { TemplateBase } from '../TemplateBase'

interface TemplateSplashContentProps {
  children?: React.ReactNode
}

export function TemplateSplashContent({ children }: TemplateSplashContentProps) {
  return (
    <TemplateBase>
      <Grid style={{ height: '100vh' }} templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem
          style={{
            backgroundImage: 'url(/login_bg.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}
        />

        <GridItem>{children}</GridItem>
      </Grid>
    </TemplateBase>
  )
}
