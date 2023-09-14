import { CourseStepDefinition, CourseStepUpdateInput } from '@binding'
import { Box, Button as ChakraButton, HStack } from '@chakra-ui/react'
import { Header, InputCheckbox, InputField } from '@components'
import { processFormData } from '@core/form'
import { CourseStepStatus, JsonObject } from '@core/types'
import React from 'react'
import { useForm } from 'react-hook-form'

interface CourseFormStepProps {
  definition: CourseStepDefinition
  status: CourseStepStatus
  stepData?: JsonObject
  onSubmit: (defId: string, data: JsonObject) => any
}

// Config example:
// {
//   "title": "Checklist: Record your pitch!",
//   "description": "Please make sure to check the following before moving on.",
//   "formFields": [
//     {
//       "type": "boolean",
//       "title": "My sound is loud and clear"
//     },
//     {
//       "type": "boolean",
//       "title": "I filmed in front of a plain background"
//     }
//   ],
//   "buttonText": "Next Step"
// }

export function CourseFormStep({ definition, status, stepData, onSubmit }: CourseFormStepProps) {
  const { register, formState, setError, control, clearErrors, handleSubmit } = useForm()

  const onFormSubmit = async (data: any) => {
    // console.log('onFormSubmit :>> ', data)

    let processedData: JsonObject
    try {
      processedData = processFormData<CourseStepUpdateInput>(data) as JsonObject
    } catch (error) {
      console.error('ERROR', error)
      throw error
    }

    return onSubmit(definition.id, processedData)
  }

  return (
    <Box boxShadow="base" bgColor="whiteAlpha.900">
      <Header className="mx-2" title={(definition.config.title as string) || definition.name} />
      <Box className="px-6 pb-4">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {definition.config.description && <p className="mb-4">{definition.config.description}</p>}

          {definition.config.formFields &&
            (definition.config.formFields as any[]).map((fieldConfig: any) => {
              const fieldId = fieldConfig.id

              let defaultProp
              if (!stepData) {
                defaultProp = {}
              } else if (fieldConfig.type === 'checkbox') {
                defaultProp = { defaultChecked: stepData[fieldId] as boolean }
              } else {
                defaultProp = { defaultValue: stepData[fieldId] as any }
              }
              return fieldConfig.type === 'checkbox' ? (
                <InputCheckbox
                  key={fieldId}
                  label={fieldConfig.title}
                  fieldId={fieldId}
                  errors={formState.errors}
                  register={register}
                  registerOptions={{ required: 'Field is required' }}
                  isRequired
                  {...defaultProp}
                />
              ) : (
                <InputField
                  key={fieldId}
                  type={fieldConfig.type}
                  label={fieldConfig.title}
                  fieldId={fieldId}
                  errors={formState.errors}
                  register={register}
                  required
                  {...defaultProp}
                />
              )
            })}

          <HStack alignItems="flex-end" justifyContent="flex-end">
            <ChakraButton type="submit" width="120" colorScheme="orange" className="mt-6">
              {definition.config.buttonText || 'Submit'}
            </ChakraButton>
          </HStack>
        </form>
      </Box>
    </Box>
  )
}
