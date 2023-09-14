import { CourseStepDefinition } from '@binding'
import { Button as ChakraButton } from '@chakra-ui/button'
import { Box, Center, HStack, VStack } from '@chakra-ui/react'
import { Header } from '@components'
import { CourseStepStatus } from '@core/types'
import { UserActivityService } from '@core/user-activity-service'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface CourseInstructionsStepProps {
  definition: CourseStepDefinition
  status: CourseStepStatus
  onSubmit: (defId: string) => any
}

export function CourseInstructionsStep({ definition, status, onSubmit }: CourseInstructionsStepProps) {
  const [loading, setLoading] = useState(false)

  const onClickInstructionsButton = async () => {
    setLoading(true)
    const { buttonEventType } = definition.config

    // console.log('definition :>> ', definition)
    // console.log('buttonEventType :>> ', buttonEventType)
    if (buttonEventType && typeof buttonEventType === 'string') {
      const service = UserActivityService.getInstance()
      await service.create(buttonEventType)
    }

    if (definition.config.buttonUrl) {
      window.open(definition.config.buttonUrl as any)
    }

    setLoading(false)
  }

  return (
    <Box boxShadow="base" bgColor="whiteAlpha.900">
      <Header className="mx-2" title={(definition.config.title as string) || definition.name} />
      <VStack className="px-6 pb-4">
        <div className="flex-1">
          {definition.config.imageUrl && (
            <Center className="flex-1 p-2">
              <img className="max-h-96" src={definition.config.imageUrl as string} />
            </Center>
          )}

          <ReactMarkdown
            className="py-2"
            components={{
              a: ({ node, ...props }) => <a target='_blank' className="underline" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-inside" {...props} />,
              li: ({ node, children, ...props }) => (
                <li className="list-decimal" {...props}>
                  <span className="ml-2">{children}</span>
                </li>
              ),
            }}
          >
            {definition.config.description?.toString() || definition.description || ''}
          </ReactMarkdown>

          {definition.config.buttonText && (
            <div className="my-8">
              {/* Wrap the Button below with another onClick handler so that you can use the href/download combo there and still track that something happened */}
              <Box>
                <ChakraButton
                  as="a"
                  className="w-72 cursor-pointer"
                  isLoading={loading}
                  target="_new"
                  onClick={onClickInstructionsButton}
                >
                  {definition.config.buttonText as string}
                </ChakraButton>
              </Box>
            </div>
          )}
        </div>

        <HStack className="w-full" alignItems="flex-end" justifyContent="flex-end">
          <ChakraButton
            type="submit"
            width="120"
            colorScheme="orange"
            className="mt-6"
            onClick={() => {
              onSubmit(definition.id)
            }}
          >
            {definition.config.nextStepButtonText || 'Next Step'}
          </ChakraButton>
        </HStack>
      </VStack>
    </Box>
  )
}
