import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { ButtonSubmit, Header, Logo } from '@components'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { TemplateSplashContent } from '@src/templates/TemplateSplashContent'
import { useRouter } from 'next/router'
import React from 'react'

interface ResetSuccessProps {}

export default function PasswordResetSuccess({}: ResetSuccessProps) {
  const router = useRouter()

  return (
    <TemplateSplashContent>
      <Center>
        <VStack spacing={4}>
          <Box pt="6">
            <Logo />
          </Box>

          <Header title="Password Reset" />
          <div className="space-y-6">
            <HStack>
              <BadgeCheckIcon className="w-6" color="#8ad9b2" />
              <Text fontSize="sm">Your password has beeen successfully reset</Text>
            </HStack>
            <ButtonSubmit
              label="Login"
              onClick={() => {
                router.push('/auth/login')
              }}
            />
          </div>
        </VStack>
      </Center>
    </TemplateSplashContent>
  )
}
