import React from 'react'
import { Box, Center, Image, Flex, Text, Button, Heading, VStack } from '@chakra-ui/react'
import { BsCheck } from 'react-icons/bs'
import { themeColors } from '@core/theme-colors'

interface ConfirmationProps {
  title: string
  message: string
  button: string
  action: () => any
}

export function Confirmation({ title, message, button, action }: ConfirmationProps) {
  return (
    <Center mt="40">
      <VStack borderWidth="1px" spacing={6} w="70%" maxW="700px">
        <Box backgroundImage="/confirmation_payment_bg.png" w="100%" h="131px">
          <Flex justifyContent="center" alignItems="center" paddingTop="5">
            <Center w="92px" h="92px">
              <Box as="span" fontWeight="bold" fontSize="lg">
                <Image src="/like.png" />
              </Box>
            </Center>
          </Flex>
        </Box>
        <Flex alignItems="center" justifyContent="center" flexDirection="column">
          <Heading color={themeColors.brand[600]} as="h2" size="3xl" isTruncated>
            {title}
          </Heading>
          <Text mt={2} display="flex" fontSize="l" textAlign="center" fontWeight="regular" lineHeight="short">
            <Box as="span" backgroundColor={themeColors.brand[600]} borderRadius="13" padding="1" marginX="3">
              <BsCheck size={18} color={themeColors.primary[50]} />
            </Box>
            {message}
          </Text>
          <Button onClick={action} colorScheme="orange" marginTop="9" marginBottom="50" variant="solid">
            {button}
          </Button>
        </Flex>
      </VStack>
    </Center>
  )
}
