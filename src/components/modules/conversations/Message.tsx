import { ConversationMessage } from '@binding'
import { DateFormatter } from '@core/date'
import { Button } from '@chakra-ui/react'
import { FaRegClone } from 'react-icons/fa'
import cn from 'classnames'
import React from 'react'
import { AnonymousAvatar } from '@components/AnonymousAvatar'

interface MessageProps {
  message: ConversationMessage
  isMe: boolean
  className?: string
  onViewPitchDeck?: () => any
}

export function Message({ message, isMe, className, onViewPitchDeck }: MessageProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex items-end', { 'justify-end': isMe })}>
        <div
          className={cn('flex flex-col max-w-2xl mx-2', {
            'items-start order-2': !isMe, // Do I need this?
            'items-end order-1': isMe, // Do I need this?
          })}
        >
          <div>
            <div className="ml-4 text-xs">
              {/* https://day.js.org/docs/en/parse/string-format */}
              {DateFormatter.format(message.createdAt, 'MMM D h:mm A')}
            </div>

            <span
              className={cn('inline-block px-4 py-2 text-base rounded-lg', {
                'text-black bg-gray-200  rounded-bl-none': !isMe,
                'text-white bg-blue-400 rounded-br-none': isMe,
              })}
            >
              {message.body}
            </span>

            {message.pitchDeckId && (
              <div className="text-right">
                <Button
                  rightIcon={<FaRegClone />}
                  colorScheme="black"
                  variant="link"
                  fontWeight="normal"
                  size="sm"
                  onClick={onViewPitchDeck}
                >
                  View in Pitch Deck
                </Button>
              </div>
            )}
          </div>
        </div>
        {message?.createdBy?.profilePictureFile && message?.createdBy?.profilePictureFile ? (
          <img
            src={message?.createdBy?.profilePictureFile?.url}
            alt="My profile"
            className={cn('w-12 h-12 rounded-full', {
              'order-1': !isMe,
              'order-2': isMe,
            })}
          />
        ) : (
          <AnonymousAvatar />
        )}
      </div>
    </div>
  )
}
