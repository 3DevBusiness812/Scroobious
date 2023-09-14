import { CourseProduct, User } from '@binding'
import {
  Avatar,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { AddIcon, HamburgerIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { DateFormatter } from '@core'
import React, { useEffect, useState } from 'react'
import { PitchManualFeedbackModal } from '../pitches'
import { AdminImpersonateUserButton } from './AdminImpersonateUserButton'

interface UserTableProps {
  users: User[]
  onGrantWrittenReview: (user: User) => any
  onGrantVideoReview: (user: User) => any
  grantReviewLoading?: boolean
  onResetReview: (courseProduct: CourseProduct) => any
  resetReviewLoading?: boolean
}

export function UserTable({
  users,
  onGrantWrittenReview,
  onGrantVideoReview,
  onResetReview,
  grantReviewLoading = false,
  resetReviewLoading = false,
}: UserTableProps) {
  const [currentUser, setCurrentUser] = useState<any>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (currentUser) {
      const user = users.find((user) => user.id === currentUser.id)
      if (user) {
        handleUser(user)
      }
    }
  }, [users])

  if (!users || !users.length) {
    return <div>No users found</div>
  }

  const handleUser = (user: any) => {
    setCurrentUser(user)
    onOpen()
  }

  return (
    <>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>User</Th>
            {/* <Th>Name</Th> */}
            <Th>Plan</Th>
            <Th>Status</Th>
            <Th>Last Login</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => {
            return (
              <Tr key={user.id}>
                <Td>
                  <div className="float-left">
                    <Avatar src={user.profilePictureFile?.url} alt={user.name} />
                  </div>
                  <div className="float-left ml-4 mt-2">
                    <b>{user.name}</b>
                    <br />
                    {user.email}
                  </div>
                </Td>
                <Td><a target='_blank' href={"https://dashboard.stripe.com/customers/"+user.stripeUserId}>{user.capabilities}</a></Td>
                <Td>{user.status}</Td>
                <Td>{user.lastLoginAt && DateFormatter.format(String(user.lastLoginAt), 'MM/DD/YYYY hh:mmA')}</Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />

                    <MenuList>
                      <MenuItem>
                        <b>{user.name}</b>
                      </MenuItem>
                      <MenuItem icon={<AddIcon />} onClick={() => handleUser(user)}>
                        Manage Feedback
                      </MenuItem>
                      <MenuItem as={Link} icon={<ExternalLinkIcon />} href={"https://dashboard.stripe.com/customers/"+user.stripeUserId} isExternal>
                        Stripe Customer Profile
                      </MenuItem>
                      <AdminImpersonateUserButton user={user} />
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <PitchManualFeedbackModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        user={currentUser}
        onGrantWrittenReview={() => onGrantWrittenReview(currentUser)}
        onGrantVideoReview={() => onGrantVideoReview(currentUser)}
        grantReviewLoading={grantReviewLoading}
        onResetReview={onResetReview}
        resetReviewLoading={resetReviewLoading}
      />
    </>
  )
}
