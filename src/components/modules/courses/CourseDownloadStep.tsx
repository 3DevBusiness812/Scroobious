import { gql, useMutation } from '@apollo/client'
import type { CourseStepDefinition } from '@binding'
import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import { handleApolloMutation } from '@core/request'
import { CourseStepStatus, JsonObject } from '@core/types'
import React, { useRef } from 'react'
import { FiDownloadCloud } from 'react-icons/fi'

interface CourseDownloadStepProps {
  definition: CourseStepDefinition
  status: CourseStepStatus
  courseId: string
  onSubmit: (defId: string, data: JsonObject) => any
}

const MUTATION = gql`
  mutation downloadCourseStep($data: CourseStepUpdateInput!, $where: CourseStepWhereInput!) {
    downloadCourseStep(data: $data, where: $where) {
      data {
        id
        status
        courseId
        courseStepDefinitionId
        data
      }
      action
    }
  }
`

export function CourseDownloadStep({ definition, courseId, status, onSubmit }: CourseDownloadStepProps) {
  const [mutate, { data, loading, error }] = useMutation<{ downloadCourseStep: boolean }>(MUTATION)

  const hiddenDownloadButton = useRef<any>(null)

  const handleDownloadClick = async () => {
    const result = await handleApolloMutation(
      mutate({
        variables: {
          data: {
            courseId,
            courseStepDefinitionId: definition.id,
            data,
          },
          where: {
            courseId_eq: courseId,
            courseStepDefinitionId_eq: definition.id,
          },
        },
      }),
    )

    // console.log('result :>> ', result)

    hiddenDownloadButton.current.click()
  }

  return (
    <>
      <Box boxShadow="base" bgColor="whiteAlpha.900" className="py-4 px-4 ">
        <Box bgColor="cyan.500" className="w-full py-8 px-4 text-white">
          <div className="my-4 mx-auto">
            <h1 className="text-xl font-bold leading-tight text-white inline-block ">
              {(definition.config.title as string) || definition.name}
            </h1>
          </div>
          <p>{definition.config.description || definition.description}</p>
        </Box>
        <div className="my-8">
          {/* Wrap the Button below with another onClick handler so that you can use the href/download combo there and still track that something happened */}
        </div>

        <Box className="w-5/6 text-white">
          <Flex>
            <Box>
              <Button isLoading={loading} onClick={handleDownloadClick} colorScheme="orange">
                <FiDownloadCloud size={20} className="mr-2" />
                {(definition.config.buttonText as string) || 'Download File'}
              </Button>

              <a ref={hiddenDownloadButton} download href={definition.config.url as string} hidden>
                &nbsp;
              </a>
            </Box>
            <Spacer />
          </Flex>
        </Box>
      </Box>

      <Box className="mt-8">
        <Button
          colorScheme="orange"
          className="w-40 float-right"
          onClick={() => {
            onSubmit(definition.id, {})
          }}
        >
          Next Step
        </Button>
      </Box>
    </>
  )
}
