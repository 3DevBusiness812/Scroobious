// The Chakra Avatar component produces a flash between Next.js routes, so we need to roll our own
// See: https://github.com/chakra-ui/chakra-ui/issues/149
// ...and thanks to @mshwery on Github
import { AvatarProps, chakra, ChakraComponent, Flex, Img, Text } from '@chakra-ui/react'
import React from 'react'

function getInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0)
}

const DefaultIcon: ChakraComponent<'svg'> = (props: any) => (
  <chakra.svg viewBox="0 0 128 128" color="#fff" width="100%" height="100%" className="chakra-avatar__svg" {...props}>
    <path
      fill="currentColor"
      d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
    />
    <path
      fill="currentColor"
      d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
    />
  </chakra.svg>
)

const getSize = (size: string) => {
  return size === 'md' ? '12' : '14'
}

export const Avatar = React.forwardRef((props: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { name, size = 'md', src, ...boxProps } = props

  // console.log('src :>> ', src)
  // console.log('typeof src :>> ', typeof src)
  const [imageUnavailable, setImageUnavailable] = React.useState(typeof src === 'undefined')

  // console.log('imageUnavailable :>> ', imageUnavailable)
  //   usePreloadedImage(src)

  const initials = React.useMemo(() => (name ? getInitials(name) : ''), [name])
  //   const hash = React.useMemo(() => hashCode(name), [name])
  //   const theme = useTheme()

  //   const bgColorKeys = Object.keys(theme.colors).filter((key) => {
  //     return !['black', 'transparent', 'current', 'white', 'whiteAlpha', 'blackAlpha'].includes(key)
  //   })

  //   const backgroundColor = name ? theme.colors[bgColorKeys[hash % bgColorKeys.length]]['100'] : theme.colors.gray['300']

  // const color = readableColor(backgroundColor) === '#000' ? 'gray.900' : 'white'
  const backgroundColor = 'blue.600'
  const color = 'gray.100'

  const resolvedSize = getSize(size)

  if (!initials) {
    return <DefaultIcon />
  }

  return (
    <Flex
      ref={ref}
      flex="none"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxSize={resolvedSize}
      borderRadius="100%"
      color={color}
      backgroundColor={backgroundColor}
      {...boxProps}
    >
      {imageUnavailable && (
        <Text
          color="inherit"
          opacity={0.9}
          fontSize={Math.floor(parseInt(resolvedSize as string, 10) * 1.4)}
          fontWeight="500"
        >
          {initials}
        </Text>
      )}
      {!imageUnavailable && (
        <Img
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="100%"
          overflow="hidden"
          src={src}
          onError={() => setImageUnavailable(true)}
        />
      )}
    </Flex>
  )
})
