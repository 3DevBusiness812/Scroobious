import { gql, useMutation } from '@apollo/client'
import { PitchUpdate } from '@binding'
import { Button, Textarea } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

interface PitchUpdateFormProps {
  pitchId: string
  onCreate: (newUpdate: PitchUpdate) => any
}

const MUTATION = gql`
  mutation createPitchUpdate($data: PitchUpdateCreateInput!) {
    createPitchUpdate(data: $data) {
      id
      body
      createdAt
      createdBy {
        id
        name
        profilePictureFile {
          id
          url
        }
      }
    }
  }
`

export function PitchUpdateForm({ pitchId, onCreate }: PitchUpdateFormProps) {
  const [createPitchUpdate, { data, loading, error }] = useMutation<{ createPitchUpdate: PitchUpdate }>(MUTATION)
  const {
    register,
    formState: { errors },
    setValue,
    control,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)

    const message = await createPitchUpdate({
      variables: {
        data: {
          body: data.body,
          pitchId,
        },
      },
    })
    setValue('body', '')

    return onCreate && message.data && onCreate(message.data.createPitchUpdate)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row ">
      <div className="flex-1 mr-2">
        <Textarea
          id="body"
          height="100%"
          {...register('body', { required: true })}
          placeholder="Add new update for investors to see"
          disabled={loading}
        />
      </div>
      <div className="flex">
        <Button type="submit" size="sm" colorScheme="orange" isLoading={loading} disabled={loading}>
          Send
        </Button>
      </div>
    </form>
  )
}
