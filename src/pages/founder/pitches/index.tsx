import { ApolloError, gql } from '@apollo/client'
import { Pitch } from '@binding'
import { AppNavigation } from '@components'
import { initializeApollo } from '@core/apollo-client'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useEffect, useState} from 'react'
import { processApolloError } from '../../../core/apollo'

type PitchListProps = {
  pitches: Pitch[]
  errors?: any
}

export default function PitchList({ pitches, errors }: PitchListProps) {
  const [loading, setLoading] = useState(true)

  if (errors) {
    return <div>Error: {errors}</div>
  }

  if (!pitches.length) {
    return <div>empty payload: {pitches}</div>
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
        <title>Founder Pitches</title>
      </Head>
      <div className="mx-auto max-w-7xl">
        <div className="md:flex">Loading...</div>
      </div>
    </AppNavigation>
  )
}

const PITCH_LIST_QUERY = gql`
  query PitchListQuery($where: PitchQueryInput, $limit: Int) {
    pitches(where: $where, limit: $limit) {
      id
    }
  }
`
export type PitchListQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initializeApollo({ headers: context?.req?.headers })

    try {
      const payload = await client.query<PitchListQuery>({
        query: PITCH_LIST_QUERY,
        variables: {
          limit: 20,
        },
      })
      // console.log('payload :>> ', payload)

      if (!payload.data.pitches.length) {
        return {
          redirect: {
            destination: '/founder/pitches/new',
            permanent: false,
          },
        }
      }

      if (payload.data.pitches[0]) {
        return {
          redirect: {
            destination: `/founder/pitches/upload-pitch-deck`,
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
  },
)
