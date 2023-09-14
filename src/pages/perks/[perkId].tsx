import { gql } from '@apollo/client'
import { Perk } from '@binding'
import { AppNavigation, FormPanel } from '@components'
import { PerkForm } from '@components/modules/perks'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type PerkEditPageProps = {
  perk: Perk
  errors?: string
}

export default function PerkEditPage({ perk, errors }: PerkEditPageProps) {
  // console.log('PerkEditPage perk :>> ', perk)
  const router = useRouter()

  const onSuccess = (data: any) => {
    return router.push('/perks?action=updated')
  }

  return (
    <AppNavigation>
      <Head>
        <title>Perks</title>
      </Head>
      <div className="mx-auto mt-16">
        <FormPanel>
          <PerkForm perk={perk} onSuccess={onSuccess} />
        </FormPanel>
      </div>
    </AppNavigation>
  )
}

const FIND_ONE_QUERY = gql`
  query perk($where: PerkWhereUniqueInput!) {
    perk(where: $where) {
      id
      companyName
      companyBio
      description
      perkCategoryId
      perkCategory {
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

export type PerkQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect<PerkEditPageProps>(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    const client = initServerSideClient(context)

    // console.log('context.query :>> ', context.query)
    if (typeof context.query.perkId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const perkId = getSingleQueryParam(context.query, 'perkId')
    const variables = {
      where: {
        id: perkId,
      },
    }
    // console.log(`variables`, variables)

    let payload
    try {
      payload = await client.query<PerkQuery>({
        query: FIND_ONE_QUERY,
        variables,
      })
      // console.log('Done Querying')
    } catch (error) {
      // console.log('error!!!!!', error)
      throw error
    }

    const props = {
      perk: payload.data.perk,
    }
    // console.log(`props`, props)

    return { props }
  },
)
