/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Center, HStack, IconButton, Spacer, Text, VStack, Button } from '@chakra-ui/react'
import { Avatar, Flex, Logo, PermissionGate } from '@components'
import { themeColors } from '@core/theme-colors'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import cn from 'classnames'
import { signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { AiTwotoneBell } from 'react-icons/ai'
import { BiCubeAlt, BiDesktop, BiGridAlt, BiCalendarEvent, BiMessageRoundedDetail } from 'react-icons/bi'
import { BsListCheck } from 'react-icons/bs'
import { FiChevronDown } from 'react-icons/fi'
import { IoIosTrendingUp } from 'react-icons/io'
import Loader from '@components/Loader'
import { uploadedAvatar } from '@src/pages/account-settings'
import { StopImpersonationButton } from '@components/modules/users/StopImpersonationButton'
import { getUserFromSession } from '@src/auth/get-user'
import { User } from '@binding'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useUser } from '@core/user.provider'

interface AppNavigationProps {
  children: React.ReactNode
  isLoading?: boolean
  user?: User
}

// See https://headlessui.dev/react/menu#integrating-with-next-js
function MyLink(props: any) {
  const { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

const getUserType = (user: User) => {
  const userCapabilities = user?.capabilities

  const userType: 'FOUNDER_LITE' | 'FOUNDER_MEDIUM' | 'FOUNDER_FULL' | 'INVESTOR' | 'ADMIN' | 'REVIEWER' =
    (userCapabilities && userCapabilities[0]) as any

  return userType
}

export const AppNavigation = function AppNavigation({ children, isLoading, user }: AppNavigationProps) {
  const [session] = useSession()
  const router = useRouter()
  const [{ data: userData }] = useUser()

  const path = router.pathname
  const { query } = router
  const userType = getUserType(userData?.user)

  if (
    !session ||
    userType !== 'ADMIN' && (
      (path.startsWith('/investor/') && userType !== 'INVESTOR') ||
      (path.startsWith('/founder/') && !['FOUNDER_LITE', 'FOUNDER_MEDIUM', 'FOUNDER_FULL'].includes(userType)) ||
      (path.startsWith('/admin/written-feedback') && userType !== 'REVIEWER')
    )
  ) {
    return <div />
  }

  const getLogoLinkUrl = () => {
    let logoLinkUrl: string

    switch (userType) {
      case 'FOUNDER_LITE':
      case 'FOUNDER_MEDIUM':
      case 'FOUNDER_FULL':
        logoLinkUrl = '/founder/dashboard'
        break

      default:
        logoLinkUrl = '/'
    }

    return logoLinkUrl
  }

  const userNavigation = [
    {
      name: 'Account Settings',
      href: '/account-settings',
    },
    {
      name: 'spacer-1',
      type: 'spacer',
    },
    {
      name: 'Privacy',
      target: '_new',
      href: 'https://www.scroobious.com/privacy-policy',
    },
    {
      name: 'Terms',
      target: '_new',
      href: 'https://www.scroobious.com/termsofservice',
    },
    {
      name: 'Support',
      target: '_new',
      href: 'https://www.scroobious.com/support',
    },
    {
      name: 'spacer-2',
      type: 'spacer',
    },
    {
      name: 'Sign out',
      onClick: async () => {
        // console.log('Sign out')
        // console.log(`getAbsolutePath`, Url.getAbsolutePath('/'))
        await signOut({ redirect: false })
        // Don't use Next.js to route when logging out, this way we'll destroy the Apollo cache
        // router.push(Url.getAbsolutePath('/'))
        window.location.href = '/'
      },
    },
  ]

  const getTopNavLinks = () => {
    return [
      // { name: 'Dashboard', href: '/dashboard', current: path === '/dashboard' },
      // Investor Pitches
      {
        name: 'Discover Pitches',
        href: '/investor/pitches/recommended',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/investor/pitches/recommended'),
        permission: 'pitch:list',
      },
      // Admin Pitches
      {
        name: 'Pitches',
        href: '/admin/pitches',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/admin/pitches'),
        permission: 'pitch:admin',
      },
      {
        name: 'Learn PiP',
        href: '/founder/courses',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/founder/courses'),
        permission: ['course:list', 'course:fomo'],
      },
      // Founder Pitches
      {
        name: 'Craft Pitch',
        href: '/founder/pitches',
        icon: <BiDesktop size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/founder/pitches'),
        permission: ['pitch:read', 'pitch:fomo'],
      },
      {
        name: 'Publish Pitch',
        href: '/founder/publish-pitch',
        icon: <BiMessageRoundedDetail size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/founder/publish-pitch'),
        permission: ['pitch:read', 'pitch:fomo'],
      },
      {
        name: userType === 'INVESTOR' ? 'Messages' : 'Reach Investors',
        href: '/messages',
        icon: <BiMessageRoundedDetail size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/messages'),
        permission: ['conversation_message:list', 'conversation_message:fomo'],
      },
      // Investor Insights
      {
        name: 'Insights',
        href: '/investor/insights',
        icon: <IoIosTrendingUp size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/investor/insights'),
        permission: 'investor_insights:list',
      },
      {
        name: 'Events',
        href: '/resources?suggestedResourceCategoryId_eq=UPCOMING_EVENTS',
        icon: <BiCalendarEvent size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/resources') && query.suggestedResourceCategoryId_eq == 'UPCOMING_EVENTS',
        permission: ['suggested_resource:list'],
      },
      {
        name: 'Perks',
        href: '/perks',
        icon: <BiCubeAlt size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/perks'),
        permission: 'perk:list',
      },
      {
        name: 'Resources',
        href: '/resources',
        icon: <BiGridAlt size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/resources') && query.suggestedResourceCategoryId_eq != 'UPCOMING_EVENTS',
        permission: 'suggested_resource:list',
      },
      {
        name: 'Users',
        href: '/admin/users',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/admin/users'),
        permission: 'user:list',
      },
      {
        name: 'Written Feedback',
        href: '/admin/written-feedback',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/admin/written-feedback'),
        permission: 'pitch_written_feedback:admin',
      },
      {
        name: 'Zoom Feedback',
        href: '/admin/meeting-feedback',
        icon: <BsListCheck size={24} color={themeColors.secondary[500]} />,
        active: path.startsWith('/admin/meeting-feedback'),
        permission: 'pitch_meeting_feedback:admin',
      },
    ]
  }

  return (
    <>
      <Flex className="flex-1 flex-col min-h-screen bg-gray-100 ml-1 mr-2">
        <Flex className=" border-b border-gray-200 bg-white">
          <Disclosure
            as="div"
            className="flex flex-1 flex-row bg-white mx-auto max-w-7xl
        "
          >
            {({ open }) => (
              <>
                <Box className="mt-2" width={230}>
                  <Logo linkUrl={getLogoLinkUrl()} />
                </Box>
                <Spacer />
                <Box h="100%" flexGrow={1}>
                  <Center>
                    <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                      {getTopNavLinks().map((item) => (
                        <PermissionGate p={item.permission} key={item.href}>
                          <HStack
                            spacing={1}
                            borderBottomWidth={2}
                            borderBottomColor={item.active ? themeColors.primary[500] : 'transparent'}
                          >
                            {/* {item.icon} */}
                            <Link href={item.href} key={item.name}>
                              <a
                                className={cn('inline-flex items-center px-1 py-4 text-md font-medium')}
                                aria-current={item.active ? 'page' : undefined}
                              >
                                {item.name}
                              </a>
                            </Link>
                          </HStack>
                        </PermissionGate>
                      ))}
                    </HStack>
                  </Center>
                </Box>
                <Spacer />
                <Box flexShrink={1} display={{ base: 'none', md: 'flex' }}>
                  <HStack spacing={4}>
                    {/* 
                  Don't need the notification bell for now.
                  <IconButton
                    variant="ghost"
                    aria-label="Notifications"
                    icon={<AiTwotoneBell size={24} />}
                  ></IconButton> */}
                    <Avatar size="md" name={session.user.name} src={uploadedAvatar.value || session.user.image} />

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative z-10 ml-3">
                      {({ open }) => (
                        <>
                          <Box>
                            <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <span className="sr-only">Open user menu</span>
                              <FiChevronDown size={20} />
                            </Menu.Button>
                          </Box>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => {
                                if (item.type === 'spacer') {
                                  return <hr key={item.name} />
                                }

                                if (item.target === '_new' || item.onClick) {
                                  return (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <a
                                          href={item.href}
                                          target={item.target}
                                          className={cn(
                                            active ? 'bg-gray-100' : '',
                                            'cursor-pointer block px-4 py-2 text-sm text-gray-700',
                                          )}
                                          onClick={item.onClick}
                                        >
                                          {item.name}
                                        </a>
                                      )}
                                    </Menu.Item>
                                  )
                                }

                                if (item.href) {
                                  return (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <MyLink
                                          href={item.href}
                                          key={item.name}
                                          className={cn(
                                            active ? 'bg-gray-100' : '',
                                            'cursor-pointer block px-4 py-2 text-sm text-gray-700',
                                          )}
                                          onClick={item.onClick}
                                        >
                                          {item.name}
                                        </MyLink>
                                      )}
                                    </Menu.Item>
                                  )
                                }
                              })}
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </HStack>
                </Box>
                <Box alignItems="center" display={{ base: 'flex', md: 'none' }}>
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </Box>

                <Disclosure.Panel className="sm:hidden">
                  <Box pt={2} pb={2}>
                    {getTopNavLinks().map((item) => (
                      <PermissionGate p={item.permission} key={item.href}>
                        <a
                          key={item.name}
                          href={item.href}
                          className={cn('block pl-3 pr-4 py-2 border-l-4 text-base font-medium')}
                          style={{
                            borderLeftColor: item.active ? themeColors.primary[500] : 'transparent',
                            background: item.active ? themeColors.primary[50] : 'transparent',
                            color: item.active ? themeColors.primary[900] : 'black',
                          }}
                          aria-current={item.active ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      </PermissionGate>
                    ))}
                  </Box>
                  <Box borderTopColor="gray.200" borderTopWidth={1} pt={4} pb={4}>
                    <HStack flex={1} alignItems="center" justifyContent="space-between" px={4}>
                      <Box flexShrink={1}>
                        <img className="w-10 h-10 rounded-full" src={session.user.image} alt="" />
                      </Box>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text>{session.user.name}</Text>
                        <Text>{session.user.email}</Text>
                      </VStack>
                      <IconButton
                        flexShrink={1}
                        ml="auto"
                        variant="ghost"
                        aria-label="Notifications"
                        icon={<AiTwotoneBell size={24} />}
                      />
                    </HStack>
                    <Box mt={4} py={2}>
                      {userNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                          {item.name}
                        </a>
                      ))}
                    </Box>
                  </Box>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </Flex>
        <Flex id="content-outer" className="flex-1 flex-row justify-center">
          <Flex id="content-inner" className="flex flex-1 flex-row max-w-7xl z-0">
            {isLoading ? <Loader /> : children}
          </Flex>
        </Flex>
      </Flex>
      <StopImpersonationButton />
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await getUserFromSession(context)
  if (user?.status === 'INACTIVE') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  if (user) {
    return {
      props: {
        user,
      },
    }
  }
  return {
    props: {},
  }
}
