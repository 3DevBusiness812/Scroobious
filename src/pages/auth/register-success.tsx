import { Box, Center, Image, Text, VStack } from '@chakra-ui/react'
import { ButtonSubmit, Logo } from '@components'
import { TemplateSplashContent } from '@src/templates/TemplateSplashContent'
import React from 'react'

export default function RegisterSuccess() {
  return (
    <TemplateSplashContent>
      <Center>
        <VStack spacing={4}>
          <Box pt="6">
            <Logo />
          </Box>

          <Image src="/Iconchecked.svg" alt="success image" />
          <Text color="green.500" fontSize="md" fontWeight="bold">
            Thanks for registering!
          </Text>

          <ButtonSubmit label="Sign In" />
        </VStack>
      </Center>
    </TemplateSplashContent>
  )
}
