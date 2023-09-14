import { CourseStepDefinition } from '@binding'
import { Box } from '@chakra-ui/react'
import { Button, Header } from '@components'
import { CourseStepStatus } from '@core/types'
import React from 'react'

interface CourseMarkdownStepProps {
  definition: CourseStepDefinition
  status: CourseStepStatus
  onSubmit: (defId: string) => any
}

export function CourseMarkdownStep({ definition, status, onSubmit }: CourseMarkdownStepProps) {
  return (
    <Box className="mt-8">
      <Header className="mx-2" title={definition.name} />
      <Button
        className="w-40 float-right"
        onClick={() => {
          onSubmit(definition.id)
        }}
      >
        Next Step
      </Button>
    </Box>
  )
}
