import { gql, useMutation } from '@apollo/client'
import { handleApolloMutation } from '@core/request'
import { User, Product, CourseProduct, PitchMeetingFeedback, PitchWrittenFeedback, Pitch } from '@binding'
import { Box, Spacer, HStack } from '@chakra-ui/react'
import { AddButton, AppNavigation, FilterColumn, Card, MainContent, PermissionGate } from '@components'
import { FilterBar, FilterBarConfig } from '@components/FilterBar'
import { UserTable } from '@components/modules/users'
import { initServerSideClient, processApolloError } from '@core/apollo'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ScroobiousSession } from '@core/types'

type UserListProps = {
  users?: User[]
  products?: Product[]
  errors?: string
}

const filterBarConfig: FilterBarConfig = [
  {
    code: 'name',
    label: 'Name',
    filter: 'name_contains',
    type: 'SEARCH',
  },
  {
    code: 'email',
    label: 'Email',
    filter: 'email_eq',
    type: 'SEARCH',
  },
  {
    label: 'Status',
    code: 'status',
    filter: 'status_eq',
    type: 'SELECT',
    options: [
      {
        label: 'Onboarding',
        value: 'ONBOARDING',
      },
      {
        label: 'Active',
        value: 'ACTIVE',
      },
      {
        label: 'Inactive',
        value: 'INACTIVE',
      },
    ],
  },
]

const CREATE_COURSE_PRODUCT_MUTATION = gql`
  mutation createCourseProduct($data: CourseProductCreateInput!) {
    createCourseProduct(data: $data) {
      id
    }
  }
`

const DELETE_MEETING_FEEDBACK_MUTATION = gql`
  mutation deletePitchMeetingFeedback($where: PitchMeetingFeedbackWhereUniqueInput!) {
    deletePitchMeetingFeedback(where: $where) {
      id
    }
  }
`

const DELETE_WRITTEN_FEEDBACK_MUTATION = gql`
  mutation deletePitchWrittenFeedback($where: PitchWrittenFeedbackWhereUniqueInput!) {
    deletePitchWrittenFeedback(where: $where) {
      id
    }
  }
`

const RESET_COURSE_PRODUCT = gql`
  mutation updateCourseProduct($data: CourseProductUpdateInput!, $where: CourseProductWhereUniqueInput!) {
    updateCourseProduct(data: $data, where: $where) {
      id
    }
  }
`

export default function UserList({ users, products, errors }: UserListProps) {
  const [createCourseProductMutate] =
    useMutation<{ createCourseProduct: CourseProduct }>(CREATE_COURSE_PRODUCT_MUTATION)
  const [deleteWrittenFeedbackMutate] = useMutation<{ deleteWrittenFeedback: PitchWrittenFeedback }>(
    DELETE_WRITTEN_FEEDBACK_MUTATION,
  )
  const [deleteMeetingFeedbackMutate] = useMutation<{ deleteMeetingFeedback: PitchMeetingFeedback }>(
    DELETE_MEETING_FEEDBACK_MUTATION,
  )
  const [resetCourseProductMutate] = useMutation<{ resetCourseProduct: CourseProduct }>(RESET_COURSE_PRODUCT)

  const [loading, setLoading] = useState(true)
  const [grantReviewLoading, setGrantReviewLoading] = useState(false)
  const [resetReviewLoading, setResetReviewLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    loaderTimeout()
  }, [])

  if (errors) {
    return <div>Errors: {JSON.stringify(errors)}</div>
  }

  if (!users) {
    return <div>empty payload: {JSON.stringify(users)}</div>
  }
  const loaderTimeout = () => {
    setTimeout(() => {
      setLoading(false)
    }, 250)
  }

  const handleGrantReview = async (user: User, name: string): Promise<boolean> => {
    const product = (products || []).find((product: Product) => product.name === name)

    if (!product) {
      alert(`Product ${name} to grant is not found`)
      return false
    }

    const course = user?.pitches && user?.pitches?.length > 0 ? user?.pitches[0].course : null

    if (!course) {
      alert("User doesn't have active courses")
      return false
    }

    setGrantReviewLoading(true)
    const { data } = await handleApolloMutation(
      createCourseProductMutate({
        variables: {
          data: {
            courseId: course.id,
            productId: product.id,
          },
        },
      }),
    )

    if (data?.createCourseProduct?.id) {
      await router.replace(router.asPath)
      setGrantReviewLoading(false)
      return true
    }

    setGrantReviewLoading(false)
    alert("Can't grant new course product")
    return false
  }

  const handleResetReview = async (courseProduct: CourseProduct): Promise<boolean> => {
    setResetReviewLoading(true)

    const deleteFeedbackVariables = {
      variables: {
        where: {
          id: courseProduct.objectId,
        },
      },
    }

    let deleteResponse

    switch (courseProduct?.product?.name) {
      case 'Written Pitch Feedback':
        deleteResponse = await handleApolloMutation(deleteWrittenFeedbackMutate(deleteFeedbackVariables))
        break

      case '1:1 Pitch Review':
        deleteResponse = await handleApolloMutation(deleteMeetingFeedbackMutate(deleteFeedbackVariables))
        break

      default:
    }

    const { data } = await handleApolloMutation(
      resetCourseProductMutate({
        variables: {
          data: {
            status: 'AVAILABLE',
            objectId: null,
          },
          where: {
            id: courseProduct.id,
          },
        },
      }),
    )

    if (data?.updateCourseProduct?.id) {
      await router.replace(router.asPath)
      setResetReviewLoading(false)
      return true
    }

    setResetReviewLoading(false)
    alert("Can't reset course product")
    return false
  }

  return (
    <AppNavigation isLoading={loading}>
      <FilterColumn>
        <FilterBar items={filterBarConfig} />
      </FilterColumn>

      <MainContent className="w-full ml-4 mt-4">
        <HStack className="mb-4">
          <Box>
            <b>Manage Users</b>
          </Box>
          <Spacer />
          <Box type="flex" alignContent="right">
            <PermissionGate p="user:create">
              <AddButton href="/admin/user-invites/new">Invite Internal User</AddButton>
            </PermissionGate>
          </Box>
        </HStack>
        <Card>
          <UserTable
            users={users}
            onGrantWrittenReview={(user) => {
              handleGrantReview(user, 'Written Pitch Feedback')
            }}
            onGrantVideoReview={(user) => {
              handleGrantReview(user, '1:1 Pitch Review')
            }}
            grantReviewLoading={grantReviewLoading}
            onResetReview={(courseProduct) => {
              setResetReviewLoading(true)
              handleResetReview(courseProduct)
            }}
            resetReviewLoading={resetReviewLoading}
          />
        </Card>
      </MainContent>
    </AppNavigation>
  )
}

const USER_LIST_QUERY = gql`
  query userListQuery($where: UserWhereInput, $limit: Int, $orderBy: UserOrderByInput) {
    users(where: $where, limit: $limit, orderBy: $orderBy) {
      id
      status
      name
      capabilities
      email
      emailVerified
      stripeUserId
      profilePictureFile {
        id
        url
      }
      lastLoginAt
      pitches {
        id
        createdAt
        bookmarks
        listStatus
        course {
          id
          courseProducts {
            id
            courseId
            objectId
            productId
            status
            product {
              id
              name
            }
          }
        }
      }
    }
  }
`

const PRODUCT_LIST_QUERY = gql`
  query productListQuery($where: ProductWhereInput, $limit: Int, $orderBy: ProductOrderByInput) {
    products(where: $where, limit: $limit, orderBy: $orderBy) {
      id
      name
    }
  }
`

const PITCH_WRITTEN_FEEDBACK_LIST_QUERY = gql`
  query PitchWrittenFeedbackQuery($where: PitchWrittenFeedbackWhereInput, $limit: Int) {
    pitchWrittenFeedbacks(where: $where, limit: $limit) {
      id
      status
      ownerId
      originalPitchDeckId
      courseProductId
      reviewer {
        id
        name
      }
    }
  }
`

export const getServerSideProps: GetServerSideProps = protect(async (context: GetServerSidePropsContext) => {
  const client = initializeApollo({ headers: context?.req?.headers })
  // console.log(`context.query`, context.query)

  // Build where filter from query string.  Use white list and remove items that are empty
  const where = { ...context.query }
  Object.keys(where).forEach((key: string) => {
    if (['status_eq', 'name_contains', 'email_eq'].indexOf(key) < 0 || !where[key]) {
      delete where[key]
    }
    // Lowercase email for nav filter
    if (key === 'email_eq' && where[key] && typeof where[key] === 'string') {
      // @ts-ignore
      where[key] = where[key].toLowerCase()
    }
  })

  try {
    const userPayload = await client.query({
      query: USER_LIST_QUERY,
      variables: {
        limit: 20,
        orderBy: 'lastLoginAt_DESC',
        where,
      },
    })

    const productPayload = await client.query({
      query: PRODUCT_LIST_QUERY,
    })

    // Get list of courseProduct IDs
    const courseProductId = (userPayload?.data?.users || []).reduce(
      (courseProductIds: string[], user: User) => [
        ...courseProductIds,
        ...(user?.pitches
          ? (user.pitches[0]?.course?.courseProducts || []).map((courseProduct: CourseProduct) => courseProduct.id)
          : []),
      ],
      [],
    )

    const pitchWrittenFeedbackVariables = {
      pitchWrittenFeedbackWhere: {
        courseProductId,
      },
    }

    const pitchWrittenFeedbackPayload = await client.query({
      query: PITCH_WRITTEN_FEEDBACK_LIST_QUERY,
      variables: pitchWrittenFeedbackVariables,
    })

    const users = userPayload.data.users.map((user: User) => ({
      ...user,
      pitches: (user.pitches || []).map((pitch: Pitch) =>
        pitch.course
          ? {
              ...pitch,
              course: {
                ...pitch.course,
                courseProducts: pitch.course?.courseProducts
                  ? (pitch.course?.courseProducts || []).map((courseProduct: CourseProduct) => ({
                      ...courseProduct,
                      pitchWrittenFeedback:
                        pitchWrittenFeedbackPayload.data.pitchWrittenFeedbacks.find(
                          (pitchWrittenFeedback: PitchWrittenFeedback) =>
                            pitchWrittenFeedback.courseProductId === courseProduct.id,
                        ) || null,
                    }))
                  : null,
              },
            }
          : pitch,
      ),
    }))

    const props = {
      users: JSON.parse(JSON.stringify(users)) as User[],
      ...productPayload.data,
    }

    return { props }
  } catch (error) {
    console.error('error :>> ', error)
    // console.log('ERROR ON USER INDEX PAGE')
    const errors = processApolloError(error)
    return { props: { errors: JSON.stringify(errors) } }
  }
})
