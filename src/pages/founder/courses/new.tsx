import { ApolloError, gql, useMutation } from '@apollo/client'
import { Course } from '@binding'
import { Button } from '@chakra-ui/button'
import { Center } from '@chakra-ui/react'
import { AppNavigation, Card, Header } from '@components'
import { ManageSubscriptionButton } from '@components/modules/auth'
import { useAlert } from '@core/alert.provider'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { usePermissions } from '@core/user.provider'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { processApolloError } from '../../../core/apollo'

type CourseNewPageProps = {
  courseDefinitionId?: string
}

export const CREATE_COURSE = gql`
  mutation createCourse($data: CourseCreateInput!) {
    createCourse(data: $data) {
      id
    }
  }
`

export default function CourseNewPage({ courseDefinitionId }: CourseNewPageProps) {
  // console.log('props :>> ', props)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [{ data: permissionData, loading: permissionsLoading, hasPermission }] = usePermissions()
  const [createCourse, { data, loading }] = useMutation<{ createCourse: Course }>(CREATE_COURSE)
  const router = useRouter()

  const { setAlert } = useAlert()

  if (permissionsLoading) {
    return <div />
  }

  const onSubmit = async (data: any) => {
    // console.log('data :>> ', data)
    // console.log('courseDefinitionId :>> ', courseDefinitionId)

    let result
    try {
      setAlert({ isHide: true })
      setIsLoading(true)
      setAlert({
        type: 'notification',
        message: 'Succesfully created PiP',
        status: 'success',
      })
      result = await createCourse({
        variables: {
          data: {
            courseDefinitionId,
          },
        },
      })

      return await router.push(`/founder/courses/${result.data?.createCourse.id}`)
    } catch (error) {
      // console.error(error)
      setAlert({
        type: 'notification',
        message: 'Unable to create PiP. Please notify support',
        status: 'error',
      })
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  function getEmptyStateContent() {
    if (hasPermission(permissionData.permissions, 'course:list')) {
      return (
        <div className="mx-auto">
          <Header center title="Welcome to the Pitch it Plan!" />
          <Center className="mb-8 mt-4">Click the button below to get started</Center>
          <Center>
            <Button className="mx-auto" onClick={onSubmit} isLoading={loading || !!data} disabled={loading || !!data}>
              Begin Pitch it Plan
            </Button>
          </Center>
        </div>
      )
    }

    return (
      <div className="mx-auto">
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center">
          Founders who subscribe to the Medium and Full plans have access to the Pitch it Plan (PiP). PiP contains a
          pre-seed/seed deck narrative framework and mini-lessons you can view on your own time covering everything
          about creating your pitch including how to best display information on a slide, what to put in each section
          and why certain information matters to investors, tips for how to present so you signal confidence, and much
          more.
        </p>
        <p className="w-3/4 mx-auto text-base text-gray-500 text-center mt-8">
          Upgrade your account to access this education and guidance!
        </p>
        <div className="text-center mt-8">
          <ManageSubscriptionButton />
        </div>
      </div>
    )
  }

  return (
    <AppNavigation isLoading={isLoading}>
      <div className="mx-auto max-w-7xl">
        <div className="md:flex mt-10">
          <Card className="w-144 mx-auto py-8">{getEmptyStateContent()}</Card>
        </div>
      </div>
    </AppNavigation>
  )
}

const COURSE_DEFINITION_QUERY = gql`
  query CourseDefinitionQuery($where: CourseDefinitionWhereInput!) {
    courseDefinitions(where: $where) {
      id
    }
  }
`

export type CourseDefinitionQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect<CourseNewPageProps>(
  async (context: GetServerSidePropsContext) => {
    const client = initializeApollo({ headers: context?.req?.headers })

    try {
      const payload = await client.query<CourseDefinitionQuery>({
        query: COURSE_DEFINITION_QUERY,
        variables: {
          where: {
            name_eq: 'Pitch it Plan',
          },
        },
      })
      // console.log('payload :>> ', payload)

      return {
        props: {
          courseDefinitionId: payload.data.courseDefinitions[0].id,
        },
      }
    } catch (error) {
      // console.log('Error on course index page')
      if (error instanceof Error || error instanceof ApolloError) {
        error = processApolloError(error)
      }
      return { props: { errors: JSON.stringify(error) } }
    }
  },
)
