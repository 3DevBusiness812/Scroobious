import { gql } from '@apollo/client'
import { SuggestedResource } from '@binding'
import { AppNavigation, FormPanel } from '@components'
import { SuggestedResourceForm } from '@components/modules/suggested-resources'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'

type SuggestedResourceEditPageProps = {
  suggestedResource: SuggestedResource
  errors?: string
}

export default function SuggestedResourceEditPage({ suggestedResource, errors }: SuggestedResourceEditPageProps) {
  const [loading, setLoading] = useState(true); 
  // console.log('SuggestedResourceEditPage suggestedResource :>> ', suggestedResource)
  const router = useRouter()

  const onSuccess = (data: any) => {
    return router.push('/resources?action=updated')
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
      <Head>
        <title>Resources</title>
      </Head>
      <div className="mx-auto mt-16">
        <FormPanel>
          <SuggestedResourceForm suggestedResource={suggestedResource} onSuccess={onSuccess} />
        </FormPanel>
      </div>
    </AppNavigation>
  )
}

const FIND_ONE_QUERY = gql`
  query suggestedResource($where: SuggestedResourceWhereUniqueInput!) {
    suggestedResource(where: $where) {
      id
      companyName
      description
      suggestedResourceCategoryId
      suggestedResourceCategory {
        id
        description
        archived
      }
      url
      logoFileId
      logoFile {
        url
      }
    }
  }
`

export type SuggestedResourceQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect<SuggestedResourceEditPageProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)

    // console.log('context.query :>> ', context.query)
    if (typeof context.query.suggestedResourceId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const suggestedResourceId = getSingleQueryParam(context.query, 'suggestedResourceId')
    const variables = {
      where: {
        id: suggestedResourceId,
      },
    }
    // console.log(`variables`, variables)

    let payload
    try {
      payload = await client.query<SuggestedResourceQuery>({
        query: FIND_ONE_QUERY,
        variables,
      })
      // console.log('Done Querying')
    } catch (error) {
      console.error('error!!!!!', error)
      throw error
    }

    const props = {
      suggestedResource: payload.data.suggestedResource,
    }
    // console.log(`props`, props)

    return { props }
  },
)
