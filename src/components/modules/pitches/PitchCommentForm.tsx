import { gql, useMutation } from '@apollo/client'
import { PitchComment } from '@binding'
import { Button, FormControl, FormLabel, HStack, Box, Switch, Textarea } from '@chakra-ui/react'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface PitchCommentFormProps {
  pitchId: string
  onCommentCreate: (newComment: PitchComment) => any
}

const MUTATION = gql`
  mutation createPitchComment($data: PitchCommentCreateInput!) {
    createPitchComment(data: $data) {
      id
      pitchId
      body
      visibility
      createdById
    }
  }
`

export function PitchCommentForm({ pitchId, onCommentCreate }: PitchCommentFormProps) {
  const [state, setState] = useState('editing')
  const [createPitchComment, { loading }] = useMutation<{ createPitchComment: PitchComment }>(MUTATION)
  const {
    register,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)

    const message = await createPitchComment({
      variables: {
        data: {
          body: data.body,
          visibility: !data.visibility ? 'VISIBLE' : 'ANONYMOUS',
          pitchId,
        },
      },
    })
    setValue('body', '')
    setState('success')
    setTimeout(() => {
      setState('editing')
    }, 6000)

    return onCommentCreate && message.data && onCommentCreate(message.data.createPitchComment)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="flex-1 mb-4">
        {state === 'editing' && (
          <Textarea
            id="body"
            height="100%"
            {...register('body', { required: true })}
            placeholder="Write a message"
            disabled={loading}
          />
        )}

        {state === 'success' && (
          <div className="text-center">
            <CheckCircleIcon className="w-20 mb-6 text-green-400 mx-auto" />
            <div>Thanks for the feedback!</div>
          </div>
        )}
      </div>
      <HStack className="justify-end">
        <div className="flex">
          <FormControl display="flex">
            <Switch id="visibility" size="lg" colorScheme="orange" {...register('visibility')} />
            <FormLabel htmlFor="visibility" className="mt-1 pl-5" style={{ fontSize: 'var(--chakra-fontSizes-sm)' }}>
              Remain Anonymous
            </FormLabel>
          </FormControl>
        </div>
        <Box w="150px" />
        <div>
          <Button type="submit" size="sm" colorScheme="orange" isLoading={loading} disabled={state === 'success'}>
            Send
          </Button>
        </div>
      </HStack>
    </form>
  )
}
