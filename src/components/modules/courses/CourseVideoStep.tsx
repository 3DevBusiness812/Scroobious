import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { CourseStepDefinition } from '@binding'
import { Button as ChakraButton } from '@chakra-ui/button'
import { Box, HStack, VStack } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Header } from '@components'
import { CourseStepStatus } from '@core/types'

interface CourseVideoStepProps {
  definition: CourseStepDefinition
  status: CourseStepStatus
  onSubmit: (defId: string) => any
}

export function CourseVideoStep({ definition, status, onSubmit }: CourseVideoStepProps) {
  const [buttonStyle, setButtonStyle] = useState({
    text: 'Watch to Complete',
    loading: false,
    done: false,
    color: 'orange',
  })

  const handleVideoStatus = (newStatus: String) => {
    if (newStatus === 'COMPLETE') {
      setButtonStyle({
        done: true,
        text: 'Completed',
        loading: false,
        color: 'green',
      })
    }
    if (newStatus === 'NEW') {
      setButtonStyle({
        done: false,
        text: 'Watch to Complete',
        loading: false,
        color: 'orange',
      })
    }
  }
  const handleCompleteVideo = () => {
    if (status === 'COMPLETE') {
      setButtonStyle({
        done: true,
        text: 'Completed',
        loading: false,
        color: 'green',
      })
    } else {
      setButtonStyle({
        done: true,
        text: 'Click to Complete Video',
        loading: false,
        color: 'green',
      })
    }
  }

  useEffect(() => {
    handleVideoStatus(status)
  }, [status])

  return (
    <Box boxShadow="base" bgColor="whiteAlpha.900">
      <Header className="mx-2" title={`Video: ${definition.name}`} />
      <VStack className="px-6 pb-4">
        <p>{definition.config.description || definition.description}</p>
        {definition.config.url && (
          <ReactPlayer
            onEnded={handleCompleteVideo}
            width="100%"
            height={450}
            url={definition.config.url as string}
            controls
          />
        )}
        <HStack className="w-full" alignItems="flex-end" justifyContent="flex-end">
          <ChakraButton
            type="submit"
            disabled={!buttonStyle?.done}
            rightIcon={buttonStyle?.done && status === 'COMPLETE' ? <CheckCircleIcon /> : <div />}
            width="120"
            colorScheme={buttonStyle?.color}
            className="mt-6"
            isLoading={buttonStyle?.loading}
            loadingText={buttonStyle?.text}
            onClick={() => {
              onSubmit(definition.id)
              handleVideoStatus(status)
            }}
          >
            {definition.config.buttonText || buttonStyle?.text}
          </ChakraButton>
        </HStack>
      </VStack>
    </Box>
  )
}
