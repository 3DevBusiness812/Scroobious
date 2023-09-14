import { Pitch } from '@binding'
import {
  Box,
  Button as ChakraButton,
  Center,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { EmptyStateText, PDFViewer, Button } from '@components'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'

interface PitchVideoDeckTabsProps {
  iframes?: any
  pitch: Pitch
  shareVideo?: boolean
  uploadVideoOnClick?: Function
  uploadDeckOnClick?: Function
  showLatestPitchDeck?: boolean
}

export function PitchVideoDeckTabs({
  iframes,
  pitch,
  shareVideo,
  uploadVideoOnClick,
  uploadDeckOnClick,
  showLatestPitchDeck = false,
}: PitchVideoDeckTabsProps) {
  const [iframeControl, setIframeControl] = useState<number>(0)

  const handleIframe = (action: string) => {
    if (action === 'next') {
      if (iframeControl === iframes.length - 1) {
        setIframeControl(iframes.length - 1)
      } else {
        setIframeControl(iframeControl + 1)
      }
    }

    if (action === 'prev') {
      if (iframeControl === 0) {
        setIframeControl(0)
      } else {
        setIframeControl(iframeControl - 1)
      }
    }
  }

  const pitchDeck = showLatestPitchDeck ? pitch.latestPitchDeck : pitch.activePitchDeck

  return (
    <Tabs variant="unstyled" defaultIndex={pitch.activePitchVideo?.video?.wistiaUrl ? 0 : 1} colorScheme="whiteAlpha">
      <TabPanels>
        <TabPanel>
          <Center width="100%" className="px-3 flex-col">
            {pitch.activePitchVideo?.video?.wistiaUrl && (
              <>
                <div className="row w-full items-center">
                  <ReactPlayer height="400px" width="100%" controls url={pitch.activePitchVideo?.video?.wistiaUrl} />
                  {iframes.length > 0 && iframes[0].url !== '' ? (
                    <>
                      <div className="row">
                        <Box mb={2} mt={2} textAlign="center">
                          <p>Video portion viewed per session</p>
                        </Box>
                        <iframe
                          src={iframes[iframeControl].url}
                          title={iframes[iframeControl].url}
                          width="515px"
                          height="60px"
                          style={{
                            marginBottom: '10px',
                          }}
                        />
                      </div>
                      <div className="flex justify-between">
                        {iframeControl > 0 ? (
                          <div>
                            <ChakraButton onClick={() => handleIframe('prev')} colorScheme="orange">
                              Previous
                            </ChakraButton>
                          </div>
                        ) : (
                          <div>
                            <ChakraButton disabled onClick={() => handleIframe('prev')} colorScheme="orange">
                              Previous
                            </ChakraButton>
                          </div>
                        )}
                        {iframeControl === iframes.length - 1 ? (
                          <div>
                            <ChakraButton disabled onClick={() => handleIframe('next')} colorScheme="orange">
                              Next
                            </ChakraButton>
                          </div>
                        ) : (
                          <div>
                            <ChakraButton onClick={() => handleIframe('next')} colorScheme="orange">
                              Next
                            </ChakraButton>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
                {shareVideo && (
                  <div>
                    <Link target="_blank" href={pitch.activePitchVideo?.video?.wistiaUrl}>
                      <span className="underline text-blue-800 hover:text-gray-800">Link to your pitch video</span>
                    </Link>
                  </div>
                )}
              </>
            )}
            {!pitch.activePitchVideo?.video?.wistiaUrl && (
              <EmptyStateText>
                You haven&apos;t uploaded your pitch video yet!{' '}
                {uploadVideoOnClick ? (
                  <>
                    Click
                    <Button variant="link" onClick={() => uploadVideoOnClick()} className="text-base">
                      here
                    </Button>
                    to upload your video and then it will show up here.
                  </>
                ) : (
                  <>Go to PiP → Film Video → Upload your video and then it will show up here.</>
                )}
              </EmptyStateText>
            )}
          </Center>
        </TabPanel>
        <TabPanel>
          <Center minHeight={400} width="100%">
            {pitchDeck && <PDFViewer height={350} url={pitchDeck.file.url} controls download />}
            {!pitchDeck && (
              <Center width="100%">
                <EmptyStateText>
                  You haven&apos;t uploaded your pitch deck yet!{' '}
                  {uploadDeckOnClick ? (
                    <>
                      Once you
                      <Button variant="link" onClick={() => uploadDeckOnClick()} className="text-base">
                        Upload your deck
                      </Button>
                      deck and then it will show up here.
                    </>
                  ) : (
                    <>Go to PiP → Pitch Deck Creation → Submit Pitch Deck and then it will show up here.</>
                  )}
                </EmptyStateText>
              </Center>
            )}
          </Center>
        </TabPanel>
      </TabPanels>
      <Center>
        <TabList>
          <Tab
            _selected={{ color: 'white', borderColor: 'blue.400', borderWidth: '1px' }}
            disabled={!pitch.activePitchVideo?.id}
          >
            <Image src="/v1-pitches-video.png" />
          </Tab>

          <Tab
            _selected={{ color: 'white', borderColor: 'blue.400', borderWidth: '1px' }}
            disabled={!pitchDeck?.id}
          >
            <Image src="/v1-pitches-deck.png" />
          </Tab>
        </TabList>
      </Center>
    </Tabs>
  )
}
