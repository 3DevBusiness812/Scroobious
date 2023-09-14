import { Box, Button, VStack } from '@chakra-ui/react'
import { Logo } from '@components'
import { ScroobiousSession } from '@core/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { TemplateSplashContent } from '../../templates/TemplateSplashContent'

interface QuickLoginPageProps {
  csrfToken: string
  userId?: string
}

export default function QuickLoginPage({ csrfToken, userId }: QuickLoginPageProps) {
  const refSubmitButtom = useRef<HTMLButtonElement>(null)
  const { setError, setValue, register, handleSubmit } = useForm()
  const router = useRouter()

  useEffect(() => {
    async function logOut() {
      if (userId) {
        await signOut()
        router.reload()
      }
    }

    if (userId) {
      logOut()
    }
  }, [])

  const onSubmit = async (data: any) => {
    let result
    try {
      result = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (result?.error) {
        return setError('email', { message: 'Invalid email/password.' })
      }

      // Push them to "/" and that route will figure out what to do next
      if (typeof window !== 'undefined') {
        // In order for Apollo to refresh with the user's new token, we redirect outside of Next
        // The performance is worse, but we're guaranteed to have things work
        window.location.href = '/'
      }
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  const submit = async (emailString: string) => {
    setValue('email', emailString)
    refSubmitButtom?.current?.click()
  }

  return (
    <TemplateSplashContent>
      <Head>
        <title>Scroobious Login </title>
      </Head>
      <VStack spacing={6}>
        <Box pt="6">
          <Logo />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input type="hidden" defaultValue="asdfasdf" {...register('password')} />
          <input type="hidden" {...register('email')} />
          <VStack>
            <Button onClick={() => submit('founder-lite@scroobious.com')}>Founder Lite</Button>
            <Button onClick={() => submit('founder-medium@scroobious.com')}>Founder Medium</Button>
            <Button onClick={() => submit('founder-full@scroobious.com')}>Founder Full</Button>
            <Button onClick={() => submit('investor@scroobious.com')}>Investor</Button>
            <Button onClick={() => submit('reviewer@scroobious.com')}>Reviewer</Button>
            <Button onClick={() => submit('admin@scroobious.com')}>Admin</Button>
          </VStack>
          <button hidden ref={refSubmitButtom} type="submit" />
        </form>
      </VStack>
    </TemplateSplashContent>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  if (process.env.DEPLOY_ENV === 'production') {
    // console.log('quick-login not available in Production')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let session

  try {
    session = (await getSession({ req: context.req })) as ScroobiousSession
  } catch (error) {
    // unauthenticated
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      userId: (session && session.user && session.user.id) || '',
    },
  }
}
