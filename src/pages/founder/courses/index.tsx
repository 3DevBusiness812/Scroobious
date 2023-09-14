import { ApolloError, gql } from '@apollo/client'
import { Course } from '@binding'
import { AppNavigation } from '@components'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useEffect, useState} from 'react'
import { processApolloError } from '../../../core/apollo'

type CourseListProps = {
  courses: Course[]
}

export default function CourseList({ courses }: CourseListProps) {
  const [loading, setLoading] = useState(true)

  if (!courses.length) {
    return <div>empty payload: {courses}</div>
  }
  
  const loaderTimeout = () => {
    setTimeout(()=> {
      setLoading(false);
    },250)
  }

  useEffect(() => {
    loaderTimeout();
  }, [])

  return (
    <AppNavigation isLoading={loading}>
      <div className="mx-auto max-w-7xl">
        <div className="md:flex">Loading...</div>
      </div>
    </AppNavigation>
  )
}

const COURSE_LIST_QUERY = gql`
  query CourseListQuery($where: CourseWhereInput, $limit: Int) {
    courses(where: $where, limit: $limit) {
      id
      status
      currentStep
    }
  }
`
export type CourseListQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })

  try {
    const payload = await client.query<CourseListQuery>({
      query: COURSE_LIST_QUERY,
      variables: {
        limit: 20,
      },
    })

    if (!payload.data.courses.length) {
      return {
        redirect: {
          destination: '/founder/courses/new',
          permanent: false,
        },
      }
    }

    if (payload.data.courses[0]) {
      return {
        redirect: {
          destination: `/founder/courses/${payload.data.courses[0].id}`,
          permanent: false,
        },
      }
    }

    // console.log('payload.data :>> ', payload.data)
    const result = {
      props: {
        ...payload.data,
      },
    }
    // addApolloState(client, result)
    return result
  } catch (error) {
    // console.log('Error on course index page')
    if (error instanceof Error || error instanceof ApolloError) {
      error = processApolloError(error)
    }
    return { props: { errors: JSON.stringify(error) } }
  }
})
