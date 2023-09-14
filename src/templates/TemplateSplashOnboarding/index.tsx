import { Grid, GridItem } from '@chakra-ui/react'
import { TemplateBase } from '../TemplateBase'

interface TemplateSplashOnboardingProps {
  children?: React.ReactNode
}

export function TemplateSplashOnboarding({ children }: TemplateSplashOnboardingProps) {
  return (
    <TemplateBase>
      <Grid style={{ height: '100vh' }} templateColumns="repeat(4, 1fr)" gap={6}>
        <GridItem
          colSpan={1}
          style={{
            backgroundImage: 'url(/onboarding_splash.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}
        >
          &nbsp;
        </GridItem>
        <GridItem colSpan={3}>{children}</GridItem>
      </Grid>
    </TemplateBase>
  )
}
