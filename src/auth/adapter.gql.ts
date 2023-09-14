import { gql } from '@apollo/client'

export const nextAuthCreateUserMutation = gql`
  mutation nextAuthCreateUserMutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
      email
      profilePictureFile {
        id
        url
      }
      status
    }
  }
`

export const nextAuthUserByIdQuery = gql`
  query nextAuthUserByIdQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      email
      profilePictureFile {
        id
        url
      }
      status
    }
  }
`

export const nextAuthUserByEmailQuery = gql`
  query nextAuthUserByEmailQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      email
      profilePictureFile {
        id
        url
      }
      status
    }
  }
`

export const nextAuthUpdateUserMutation = gql`
  mutation nextAuthUpdateUserMutation($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
    }
  }
`

export const nextAuthDeleteUserMutation = gql`
  query nextAuthDeleteUserMutation($where: UserWhereUniqueInput) {
    deleteUser(where: $where) {
      id
    }
  }
`

export const nextAuthUserByProviderAuthAccountIdQuery = gql`
  query nextAuthUserByProviderAuthAccountIdQuery($where: AuthAccountWhereInput!) {
    authAccounts(where: $where) {
      id
      user {
        id
        name
        email
        emailVerified
        profilePictureFile {
          id
          url
        }
        status
      }
    }
  }
`

export const nextAuthCreateAuthAccountMutation = gql`
  mutation nextAuthCreateAuthAccountMutation($data: AuthAccountCreateInput!) {
    createAuthAccount(data: $data) {
      id
    }
  }
`

export const nextAuthDeleteAuthAccountMutation = gql`
  mutation nextAuthDeleteAuthAccountMutation($where: AuthAccountWhereUniqueInput!) {
    deleteAuthAccount(where: $where) {
      id
    }
  }
`

export const nextAuthCreateSessionMutation = gql`
  mutation nextAuthCreateSessionMutation($data: SessionCreateInput!) {
    createSession(data: $data) {
      id
    }
  }
`

export const nextAuthGetSessionQuery = gql`
  query nextAuthGetSessionQuery($where: SessionWhereUniqueInput!) {
    session(where: $where) {
      id
      userId
      expires
    }
  }
`

export const nextAuthUpdateSessionMutation = gql`
  mutation nextAuthUpdateSessionMutation($where: SessionWhereUniqueInput!, $data: SessionUpdateInput!) {
    updateSession(data: $data, where: $where) {
      id
    }
  }
`

export const nextAuthDeleteSessionMutation = gql`
  mutation nextAuthDeleteSessionMutation($where: SessionWhereUniqueInput!) {
    deleteSession(where: $where) {
      id
    }
  }
`
export const nextAuthCreateVerificationRequestMutation = gql`
  mutation nextAuthCreateVerificationRequestMutation($data: VerificationRequestCreateInput!) {
    createVerificationRequest(data: $data) {
      id
    }
  }
`

export const nextAuthGetVerificationRequestQuery = gql`
  query nextAuthGetVerificationRequestQuery($where: VerificationRequestWhereInput) {
    verificationRequests(where: $where) {
      id
    }
  }
`

export const nextAuthDeleteVerificationRequestQuery = gql`
  mutation nextAuthDeleteVerificationRequestQuery($where: VerificationRequestWhereUniqueInput) {
    deleteVerificationRequest(where: $where) {
      id
    }
  }
`
