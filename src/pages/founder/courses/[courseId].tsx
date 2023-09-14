import { gql, useMutation } from '@apollo/client'
import { Course, CourseStep, CourseStepDefinition } from '@binding'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AppNavigation, EmptyStateText, PermissionGate } from '@components'
import {
  CourseDownloadStep,
  CourseFormStep,
  CourseInstructionsStep,
  CourseMarkdownStep,
  CourseVideoStep,
} from '@components/modules/courses'
import { initServerSideClient } from '@core/apollo'
import { getSingleQueryParam } from '@core/querystring'
import { protect } from '@core/server'
import { CourseStepStatus, JsonObject, ScroobiousSession } from '@core/types'
import cn from 'classnames'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { BiCheckCircle, BiVideo } from 'react-icons/bi'
import { BsListTask } from 'react-icons/bs'
import {
  FaCheckCircle,
  FaCheckSquare,
  FaDownload,
  FaFileWord,
  FaRocket,
  FaUpload,
  FaVideo,
  FaWpforms,
} from 'react-icons/fa'
import { HiOutlinePresentationChartBar } from 'react-icons/hi'
import { RiFileEditLine } from 'react-icons/ri'

type Props = {
  course: Course
  errors?: string
}

type StepEntry = {
  entryType: 'STEP'
  definition: CourseStepDefinition
  status: CourseStepStatus
  data?: JsonObject
  sectionIndex: number
}
type SectionEntry = { entryType: 'SECTION'; name: string; sectionIndex: number; children: StepEntry[] }
type NavigationEntry = SectionEntry | StepEntry

type State = {
  course: Course
  steps: NavigationEntry[]
  currentStep?: StepEntry
  complete?: boolean
}

type ChangeStepAction = { type: 'CHANGE_STEP'; stepId: string }
type SubmitStepAction = { type: 'SUBMIT_STEP'; stepId: string; data?: JsonObject }
type Action = ChangeStepAction | SubmitStepAction

function reducer(state: State, action: Action): State {
  function findStepIndex(stepId: string) {
    return state.steps.findIndex((step) => {
      if (step.entryType !== 'STEP') {
        return false
      }

      return step.definition.id === stepId
    })
  }

  function findStep(stepId: string) {
    return state.steps.find((step) => {
      if (step.entryType !== 'STEP') {
        return false
      }

      return step.definition.id === stepId
    }) as StepEntry
  }

  function findNextStep(stepId: string) {
    const index = findNextStepIndex(stepId)

    if (!index) {
      return undefined
    }
    return findStep((state.steps[index] as StepEntry).definition.id)
  }

  // If this returns null, it means there are no more steps, i.e. the course is complete
  function findNextStepIndex(stepId: string) {
    const currentStepIndex = state.steps.findIndex((step) => {
      if (step.entryType !== 'STEP') {
        return false
      }

      return step.definition.id === stepId
    })

    // From here to the end of the do-while just grabs the index of the next "STEP" (not SECTION) type
    let nextStepIndex
    let index = currentStepIndex
    do {
      index++
      if (state.steps[index] && state.steps[index].entryType === 'STEP') {
        nextStepIndex = index
      }
    } while (!nextStepIndex && index < state.steps.length)

    return nextStepIndex
  }

  switch (action.type) {
    case 'CHANGE_STEP':
      return { ...state, currentStep: findStep(action.stepId) }
    case 'SUBMIT_STEP': {
      const steps = [...state.steps]
      const currentStepIndex = findStepIndex(action.stepId)
      const currentStep = steps[currentStepIndex] as StepEntry

      currentStep.status = 'COMPLETE'
      currentStep.data = action.data
      const nextStep = findNextStep(action.stepId)
      const complete = !nextStep

      return { course: state.course, steps, currentStep: nextStep, complete }
    }
    default:
      return { ...state }
  }
}

// Take the CourseDefinition to create a structure for the course sections and containing steps
// Mix in the current status from the CourseStep table, which will be the system of record for status
function getInitialState(course: Course, currentStepId?: string): State {
  // console.log('course :>> ', course)

  if (!course) {
    throw new Error("Uh oh, we didn't get a course passed into the page")
  }

  const stepDefs = course?.courseDefinition?.courseStepDefinitions
  if (!stepDefs || !stepDefs.length) {
    throw new Error('Course does not contain sections')
  }

  const sortedStepDefs = stepDefs.sort((a: CourseStepDefinition, b: CourseStepDefinition) => {
    return a.sequenceNum - b.sequenceNum
  })

  const stepDefEntries: Array<NavigationEntry> = []
  let sectionIndex = -1 // First section should be 0, so start at -1
  let currentSection: SectionEntry

  // Loops through sorted steps and creates "Section" entries so that we can display them in the UI
  sortedStepDefs.forEach((stepDef, index) => {
    if (index === 0 || stepDef.section !== sortedStepDefs[index - 1].section) {
      sectionIndex += 1
      currentSection = { entryType: 'SECTION', name: stepDef.section, sectionIndex, children: [] }
      stepDefEntries.push(currentSection)
    }

    const courseStep = course.courseSteps!.find((cs: CourseStep) => {
      return cs.courseStepDefinitionId === stepDef.id
    })

    const status: CourseStepStatus = courseStep ? courseStep.status : 'NEW'

    const stepEntry = { entryType: 'STEP' as any, definition: stepDef, status, data: courseStep?.data, sectionIndex }
    currentSection.children.push(stepEntry)
    stepDefEntries.push(stepEntry)
  })

  let currentStep
  // If this is passed in, we're likely deep linking by specifying stepId in query string
  if (currentStepId) {
    currentStep = stepDefEntries.find((stepDefEntry) => {
      // console.log('stepDefEntry :>> ', stepDefEntry)
      return stepDefEntry.entryType === 'STEP' && stepDefEntry.definition.id === currentStepId
    }) as StepEntry
  }
  if (!currentStep && course.currentStep) {
    currentStep = stepDefEntries.find((stepDefEntry) => {
      // console.log('stepDefEntry :>> ', stepDefEntry)
      return stepDefEntry.entryType === 'STEP' && stepDefEntry.definition.id === course.currentStep
    }) as StepEntry
  }
  if (!currentStep) {
    currentStep = stepDefEntries.find((step) => step.entryType === 'STEP') as StepEntry
  }

  return {
    complete: false,
    course,
    steps: stepDefEntries,
    currentStep,
  }
}

export const SUBMIT_COURSE_STEP = gql`
  mutation submitCourseStep($data: CourseStepUpdateInput!, $where: CourseStepWhereInput!) {
    submitCourseStep(data: $data, where: $where) {
      data {
        id
        status
        courseId
        courseStepDefinitionId
        data
      }
      action
    }
  }
`

function getTitleFromStepDef(stepDefinition?: CourseStepDefinition) {
  if (!stepDefinition) {
    return 'Pitch it Plan'
  }
  return `PiP ${stepDefinition.section} - ${stepDefinition.name}`
}

export default function CoursePage({ course, errors }: Props) {
  const [submitCourseStep] = useMutation<{ submitCourseStep: CourseStep }>(SUBMIT_COURSE_STEP)

  const router = useRouter()

  // TODO: why is getInitialState getting called repeatedly?
  const [state, dispatch] = useReducer(reducer, undefined, () => getInitialState(course, router.query.stepId as string))
  const [title, setTitle] = useState<String>(getTitleFromStepDef(state.currentStep?.definition))
  const [feedbackClicked, setFeedbackClicked] = useState(false)

  // Whenever currentStep changes, update the query string
  useEffect(() => {
    setTitle(getTitleFromStepDef(state.currentStep?.definition))
    // setBreadcrumbTitle(state.currentStep?.definition.section)
    if (state.complete) {
      router.push({
        pathname: '/founder/pitches',
      })
      return
    }

    // console.log('updateStepQueryParam :>> ', state.currentStep?.definition.id!)
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          stepId: state.currentStep?.definition.id!,
        },
      },

      undefined,

      { shallow: true }, // Don't reload page data
    )
  }, [state.currentStep])

  const onChange = useCallback((stepDefinition: CourseStepDefinition) => {
    setTitle(`PiP ${stepDefinition.section} - ${stepDefinition.name}`)
    // setBreadcrumbTitle(stepDefinition.section)

    // console.log('onChange :>> ', stepId)
    dispatch({ type: 'CHANGE_STEP', stepId: stepDefinition.id })
  }, [])

  function getIconFromType(type: any, classes: any) {
    switch (type.toLowerCase()) {
      case 'download':
        return <FaDownload className={classes} />
      case 'video':
        return <FaVideo className={classes} />
      case 'form':
        return <FaCheckSquare className={classes} />
      case 'instructions':
        return <FaWpforms className={classes} />
      case 'completion':
        return <FaRocket className={classes} />
      case 'markdown':
        return <FaFileWord className={classes} />
      case 'complete':
        return <FaCheckCircle className="text-green-400" />
      case 'incomplete':
        return <></>
      default:
        return <FaUpload />
    }
  }

  function getIconFromTitle(name: any) {
    const classes = 'float-left mr-3 mt-1'
    switch (name.toLowerCase()) {
      case 'overview':
        return <AiOutlineInfoCircle className={classes} />
      case 'basics':
        return <BsListTask className={classes} />
      case 'pitch deck creation':
        return <RiFileEditLine className={classes} />
      case 'pitch presentation':
        return <HiOutlinePresentationChartBar className={classes} />
      case 'film video':
        return <BiVideo className={classes} />
      case 'complete and list!':
        return <BiCheckCircle className={classes} />

      default:
        return <HiOutlinePresentationChartBar className={classes} />
    }
  }

  const onSubmitStep = useCallback(async (stepId: string, data: JsonObject = {}) => {
    // console.log('onSubmitStep :>> ', stepId, course, data)

    try {
      await submitCourseStep({
        variables: {
          data: {
            courseId: course.id,
            courseStepDefinitionId: stepId,
            data,
          },
          where: {
            courseId_eq: course.id,
            courseStepDefinitionId_eq: stepId,
          },
        },
      })

      // TODO: pull the course out here and check to see if the status is "COMPLETE".  If so, get outta here
      // console.log('result :>> ', result)

      dispatch({ type: 'SUBMIT_STEP', stepId, data })
    } catch (error) {
      // TODO: need to add error handling with update to UI
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])
  // console.log(state.steps)

  if (errors) {
    return <div>Errors: {JSON.stringify(errors)}</div>
  }

  if (!course) {
    return <div>Course Not Found</div>
  }

  if (!state.steps) {
    return <div>State not initialized</div>
  }

  return (
    <AppNavigation>
      <Head>
        <title>{title}</title>
      </Head>
      <VStack flex={1} width="100%" justifyContent="flex-start" px={4}>
        <HStack className="mx-4 pt-3 pb-1" width="100%" justifyContent="flex-start">
          <Spacer />
          <PermissionGate p="pitch_written_feedback:request">
            <Button
              isLoading={feedbackClicked}
              colorScheme="orange"
              onClick={() => {
                setFeedbackClicked(true)
                router.push('/founder/pitches/pitch-deck-feedback')
              }}
              position="fixed"
              right={50}
              top={68}
              zIndex={5000}
              boxShadow="0 0 10px gray"
            >
              Get Feedback
            </Button>
          </PermissionGate>
        </HStack>
        <HStack flexGrow={1} justifyContent="flex-start" alignItems="flex-start" width="100%">
          <Box boxShadow="base" bgColor="white" height="100%">
            <VStack spacing={4} justifyContent="space-evenly">
              <Box width="300px">
                <Accordion index={state.currentStep?.sectionIndex} defaultIndex={state.currentStep?.sectionIndex}>
                  {state.steps
                    .filter((step) => step.entryType === 'SECTION')
                    .map((sectionEntry) => {
                      const section = sectionEntry as SectionEntry
                      return (
                        <AccordionItem key={section.name}>
                          <AccordionButton
                            bgColor="gray.600"
                            className="text-white"
                            _expanded={{ bgColor: 'orange.500' }}
                            _hover={{ bgColor: 'orange.500' }}
                            aria-expanded={section.sectionIndex === state.currentStep?.sectionIndex}
                            onClick={() => {
                              // When we click the accordion, change the step to the first step in that section
                              onChange(section.children[0].definition)
                            }}
                          >
                            <Box key={section.name} flex="1" textAlign="left">
                              {getIconFromTitle(section.name)}
                              {section.name}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel>
                            {(section as SectionEntry).children.map((stepEntry: StepEntry) => {
                              const isCurrentStep = state.currentStep?.definition.id === stepEntry.definition.id
                              const textColor = isCurrentStep ? 'green.400' : 'black'
                              const classes = isCurrentStep ? 'text-green-400' : 'text-gray-400'
                              return (
                                <Box
                                  p={1}
                                  color={textColor}
                                  className={cn('my-1', { 'bg-gray-100': isCurrentStep })}
                                  key={stepEntry.definition.id}
                                >
                                  <HStack
                                    className="cursor-pointer"
                                    onClick={() => {
                                      onChange(stepEntry.definition)
                                    }}
                                  >
                                    <Box flexShrink={1}>{getIconFromType(stepEntry.definition.type, classes)}</Box>
                                    <Text flexGrow={1}>{stepEntry.definition.name}</Text>
                                    <Box flexShrink={1}>
                                      {getIconFromType(
                                        stepEntry.status === 'COMPLETE' ? stepEntry.status : 'incomplete',
                                        classes,
                                      )}
                                    </Box>
                                  </HStack>
                                </Box>
                              )
                            })}
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })}
                </Accordion>
              </Box>
            </VStack>
          </Box>

          <Box width="100%" height="100%">
            {state.complete && <EmptyStateText>Completing PiP...</EmptyStateText>}

            {state.currentStep && (
              <Box>
                {
                  {
                    DOWNLOAD: (
                      <CourseDownloadStep
                        definition={state.currentStep?.definition}
                        courseId={course.id}
                        status={state.currentStep?.status}
                        onSubmit={onSubmitStep}
                      />
                    ),
                    FORM: (
                      <CourseFormStep
                        definition={state.currentStep?.definition}
                        status={state.currentStep?.status}
                        stepData={state.currentStep?.data}
                        onSubmit={onSubmitStep}
                      />
                    ),
                    INSTRUCTIONS: (
                      <CourseInstructionsStep
                        definition={state.currentStep?.definition}
                        status={state.currentStep?.status}
                        onSubmit={onSubmitStep}
                      />
                    ),
                    MARKDOWN: (
                      <CourseMarkdownStep
                        definition={state.currentStep?.definition}
                        status={state.currentStep?.status}
                        onSubmit={onSubmitStep}
                      />
                    ),
                    VIDEO: (
                      <CourseVideoStep
                        definition={state.currentStep?.definition}
                        status={state.currentStep?.status}
                        onSubmit={onSubmitStep}
                      />
                    ),
                  }[state.currentStep?.definition.type || 'VIDEO']
                }
              </Box>
            )}
          </Box>
        </HStack>
      </VStack>
    </AppNavigation>
  )
}

const COURSE_DETAIL_QUERY = gql`
  query CourseDetailQuery($where: CourseWhereUniqueInput!) {
    course(where: $where) {
      id
      status
      currentStep
      updatedAt
      pitchId
      pitch {
        id
        views
        bookmarks
        listStatus
        createdAt
      }
      courseProducts {
        id
        courseId
        productId
        status
        objectId
        product {
          id
          name
        }
      }
      courseDefinition {
        id
        name
        description
        courseStepDefinitions {
          id
          name
          section
          description
          type
          sequenceNum
          config
        }
      }
      courseSteps {
        id
        status
        data
        updatedAt
        courseStepDefinitionId
      }
    }
  }
`

export type CourseDetailQuery = any // TODO: codegen

export const getServerSideProps: GetServerSideProps = protect(
  async (context: GetServerSidePropsContext, session: ScroobiousSession) => {
    // console.log(`context?.req?.headers`, context?.req?.headers)
    const client = initServerSideClient(context)

    if (typeof context.query.courseId === 'undefined') {
      // TODO: need a way to throw a standard error that the UI knows how to pick up and handle
      throw 'NO ID'
    }

    const courseId = getSingleQueryParam(context.query, 'courseId')

    // console.log('Querying')
    let payload
    // eslint-disable-next-line no-useless-catch
    try {
      payload = await client.query<CourseDetailQuery>({
        query: COURSE_DETAIL_QUERY,
        variables: {
          where: {
            id: courseId,
          },
        },
      })
      // console.log('Done Querying')
    } catch (error) {
      // console.log('error!!!!!', error)
      throw error
    }

    const props = {
      course: JSON.parse(JSON.stringify(payload.data.course)),
    }
    // console.log(`props`, props)

    return { props }
  },
)
