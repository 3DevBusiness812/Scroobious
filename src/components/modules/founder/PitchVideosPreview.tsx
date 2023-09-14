import { Pitch } from '@binding'
import { Box, Center, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import ReactPlayer from 'react-player'

interface VideoPreviewProps {
  video: any
  uploadVideoUrl?: string
  extended?: boolean
  investorView?: boolean
}

function VideoPreview({ video, uploadVideoUrl, extended = false, investorView = true }: VideoPreviewProps) {
  return (
    <Center width="100%" className="flex-col">
      {video?.wistiaUrl && (
        <div className="row w-full items-center">
          <ReactPlayer height="290px" width="100%" controls url={video?.wistiaUrl} />
        </div>
      )}
      {!video?.wistiaUrl && (
        <Center height="300" alignItems="center">
          <Box>
            {investorView ? (
              <>Pitch video is not available</>
            ) : (
              <>
                You haven&apos;t uploaded your pitch video yet!{' '}
                {uploadVideoUrl ? (
                  <>
                    Click{' '}
                    <a href={uploadVideoUrl} className="text-base underline">
                      here
                    </a>{' '}
                    to upload your {extended ? '5 Min' : 'intro'} video and then it will show up here.
                  </>
                ) : (
                  <>Go to PiP → Film Video → Upload your video and then it will show up here.</>
                )}
              </>
            )}
          </Box>
        </Center>
      )}
    </Center>
  )
}

interface PitchVideosPreviewProps {
  pitch: Pitch
  uploadShortVideoUrl?: string
  uploadExtendedVideoUrl?: string
  investorView?: boolean
}

export function PitchVideosPreview({
  pitch,
  uploadShortVideoUrl,
  uploadExtendedVideoUrl,
  investorView = true,
}: PitchVideosPreviewProps) {
  return (
    <Tabs variant="unstyled" defaultIndex={pitch.activePitchVideo?.video?.wistiaUrl ? 0 : 1} colorScheme="whiteAlpha">
      <TabPanels>
        <TabPanel className=''>
          <VideoPreview
            video={pitch.activePitchVideo?.video}
            uploadVideoUrl={uploadShortVideoUrl}
            extended={false}
            investorView={investorView}
          />
        </TabPanel>
        {pitch.extendedPitchVideo?.video && (
          <TabPanel>
            <VideoPreview
              video={pitch.extendedPitchVideo?.video}
              uploadVideoUrl={uploadExtendedVideoUrl}
              extended
              investorView={investorView}
            />
          </TabPanel>
        )}
      </TabPanels>
      <Center>
        <TabList className="w-full">
          <Tab
            className="border border-gray-400/25 w-1/2 w-1/2 text-sm "
            _selected={{ borderColor: 'orange.400', borderWidth: '1px', boxShadow: 'none' }}
          >
            Intro Video
          </Tab>
          {pitch.extendedPitchVideo?.video && (
            <Tab
              className="border border-gray-400/25 w-1/2 text-sm font-medium"
              _selected={{ borderColor: 'orange.400', borderWidth: '1px', boxShadow: 'none' }}
            >
              5 min Video
            </Tab>
          )}
        </TabList>
      </Center>
    </Tabs>
  )
}
