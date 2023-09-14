import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    permissions: <T = Array<Permission>>(args: { offset?: Int | null, limit?: Int | null, where?: PermissionWhereInput | null, orderBy?: PermissionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    permissionsForUser: <T = Array<String>>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    permission: <T = Permission>(args: { where: PermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    rolePermissions: <T = Array<RolePermission>>(args: { offset?: Int | null, limit?: Int | null, where?: RolePermissionWhereInput | null, orderBy?: RolePermissionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    rolePermission: <T = RolePermission>(args: { where: RolePermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    roles: <T = Array<Role>>(args: { offset?: Int | null, limit?: Int | null, where?: RoleWhereInput | null, orderBy?: RoleOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    role: <T = Role>(args: { where: RoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    userRoles: <T = Array<UserRole>>(args: { offset?: Int | null, limit?: Int | null, where?: UserRoleWhereInput | null, orderBy?: UserRoleOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    userRole: <T = UserRole>(args: { where: UserRoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    conversations: <T = Array<Conversation>>(args: { offset?: Int | null, limit?: Int | null, where?: ConversationWhereInput | null, orderBy?: ConversationOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    conversation: <T = Conversation>(args: { where: ConversationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    findExistingConversation: <T = Conversation | null>(args: { userId2: String, userId1: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    cities: <T = Array<City>>(args: { offset?: Int | null, limit?: Int | null, where?: CityWhereInput | null, orderBy?: CityOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    city: <T = City | null>(args: { where: CityWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    lists: <T = Array<List>>(args: { where: ListWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    generateReport: <T = ReportResult>(args: { type: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    slacks: <T = SlackCommunityChannelHistoryResponse>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseDefinitionProducts: <T = Array<CourseDefinitionProduct>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseDefinitionProductWhereInput | null, orderBy?: CourseDefinitionProductOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseDefinitions: <T = Array<CourseDefinition>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseDefinitionWhereInput | null, orderBy?: CourseDefinitionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseProducts: <T = Array<CourseProduct>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseProductWhereInput | null, orderBy?: CourseProductOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseStepDefinitions: <T = Array<CourseStepDefinition>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseStepDefinitionWhereInput | null, orderBy?: CourseStepDefinitionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseStepDefinition: <T = CourseStepDefinition>(args: { where: CourseStepDefinitionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseSteps: <T = Array<CourseStep>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseStepWhereInput | null, orderBy?: CourseStepOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courseStep: <T = CourseStep>(args: { where: CourseStepWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    courses: <T = Array<Course>>(args: { offset?: Int | null, limit?: Int | null, where?: CourseWhereInput | null, orderBy?: CourseOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    course: <T = Course>(args: { where: CourseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    startup: <T = Startup>(args: { where: StartupWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    authAccounts: <T = Array<AuthAccount>>(args: { offset?: Int | null, limit?: Int | null, where?: AuthAccountWhereInput | null, orderBy?: AuthAccountOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    organizations: <T = Array<Organization>>(args: { offset?: Int | null, limit?: Int | null, where?: OrganizationWhereInput | null, orderBy?: OrganizationOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    organization: <T = Organization>(args: { where: OrganizationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    sessions: <T = Array<Session>>(args: { offset?: Int | null, limit?: Int | null, where?: SessionWhereInput | null, orderBy?: SessionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    session: <T = Session | null>(args: { where: SessionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    userInvites: <T = Array<UserInvite>>(args: { offset?: Int | null, limit?: Int | null, where?: UserInviteWhereInput | null, orderBy?: UserInviteOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    me: <T = User>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    users: <T = Array<User>>(args: { offset?: Int | null, limit?: Int | null, where?: UserWhereInput | null, orderBy?: UserOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    verificationRequests: <T = Array<VerificationRequest>>(args: { offset?: Int | null, limit?: Int | null, where?: VerificationRequestWhereInput | null, orderBy?: VerificationRequestOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    verificationRequest: <T = VerificationRequest>(args: { where: VerificationRequestWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    investorProfile: <T = InvestorProfile>(args: { where: InvestorProfileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    perks: <T = Array<Perk>>(args: { offset?: Int | null, limit?: Int | null, where?: PerkWhereInput | null, orderBy?: PerkOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    perk: <T = Perk>(args: { where: PerkWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchDecks: <T = Array<PitchDeck>>(args: { offset?: Int | null, limit?: Int | null, where?: PitchDeckWhereInput | null, orderBy?: PitchDeckOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchMeetingFeedbacks: <T = Array<PitchMeetingFeedback>>(args: { offset?: Int | null, limit?: Int | null, where?: PitchMeetingFeedbackWhereInput | null, orderBy?: PitchMeetingFeedbackOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchMeetingFeedback: <T = PitchMeetingFeedback>(args: { where: PitchMeetingFeedbackWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchUserStatus: <T = PitchUserStatus | null>(args: { where: PitchUserStatusWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    pitchVideos: <T = Array<PitchVideo>>(args: { offset?: Int | null, limit?: Int | null, where?: PitchVideoWhereInput | null, orderBy?: PitchVideoOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchWrittenFeedbacks: <T = Array<PitchWrittenFeedback>>(args: { offset?: Int | null, limit?: Int | null, where?: PitchWrittenFeedbackWhereInput | null, orderBy?: PitchWrittenFeedbackOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchWrittenFeedback: <T = PitchWrittenFeedback>(args: { where: PitchWrittenFeedbackWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitches: <T = Array<Pitch>>(args: { offset?: Int | null, limit?: Int | null, where?: PitchQueryInput | null, orderBy?: PitchOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitch: <T = Pitch>(args: { where: PitchWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchVideoStats: <T = WistiaStats>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    pitchVideoIframes: <T = Array<WistiaIframe>>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    products: <T = Array<Product>>(args: { offset?: Int | null, limit?: Int | null, where?: ProductWhereInput | null, orderBy?: ProductOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    manageStripeSubscription: <T = ManageStripeSubscriptionResponse>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    eventTypes: <T = Array<EventType>>(args: { offset?: Int | null, limit?: Int | null, where?: EventTypeWhereInput | null, orderBy?: EventTypeOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    eventType: <T = EventType>(args: { where: EventTypeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    events: <T = Array<Event>>(args: { offset?: Int | null, limit?: Int | null, where?: EventWhereInput | null, orderBy?: EventOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    event: <T = Event>(args: { where: EventWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    subscriptions: <T = Array<Subscription>>(args: { offset?: Int | null, limit?: Int | null, where?: SubscriptionWhereInput | null, orderBy?: SubscriptionOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    subscription: <T = Subscription>(args: { where: SubscriptionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    suggestedResources: <T = Array<SuggestedResource>>(args: { offset?: Int | null, limit?: Int | null, where?: SuggestedResourceWhereInput | null, orderBy?: SuggestedResourceOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    suggestedResource: <T = SuggestedResource>(args: { where: SuggestedResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createPermission: <T = Permission>(args: { data: PermissionCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyPermissions: <T = Array<Permission>>(args: { data: Array<PermissionCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePermission: <T = Permission>(args: { data: PermissionUpdateInput, where: PermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deletePermission: <T = StandardDeleteResponse>(args: { where: PermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createRolePermission: <T = RolePermission>(args: { data: RolePermissionCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyRolePermissions: <T = Array<RolePermission>>(args: { data: Array<RolePermissionCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateRolePermission: <T = RolePermission>(args: { data: RolePermissionUpdateInput, where: RolePermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteRolePermission: <T = StandardDeleteResponse>(args: { where: RolePermissionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createRole: <T = Role>(args: { data: RoleCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyRoles: <T = Array<Role>>(args: { data: Array<RoleCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateRole: <T = Role>(args: { data: RoleUpdateInput, where: RoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteRole: <T = StandardDeleteResponse>(args: { where: RoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUserRole: <T = UserRole>(args: { data: UserRoleCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyUserRoles: <T = Array<UserRole>>(args: { data: Array<UserRoleCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUserRole: <T = UserRole>(args: { data: UserRoleUpdateInput, where: UserRoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUserRole: <T = StandardDeleteResponse>(args: { where: UserRoleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCalendlyWebhookEvent: <T = CalendlyWebhookEvent>(args: { data: CalendlyWebhookEventCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createConversationMessage: <T = ConversationMessage>(args: { data: ConversationMessageCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUploadSignedUrl: <T = FileSignedURLResponse>(args: { data: FileCreateSignedURLInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createConversation: <T = Conversation>(args: { data: ConversationCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    startConversation: <T = Conversation>(args: { participantIds: Array<String>, messageBody: String, conversationData: ConversationCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyConversations: <T = Array<Conversation>>(args: { data: Array<ConversationCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateConversation: <T = Conversation>(args: { data: ConversationUpdateInput, where: ConversationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteConversation: <T = StandardDeleteResponse>(args: { where: ConversationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCheckoutRequest: <T = CheckoutRequestCreateResponse>(args: { data: CheckoutRequestCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCheckoutResponse: <T = CheckoutResponseCreateResponse>(args: { data: CheckoutResponseCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUserActivity: <T = UserActivity>(args: { data: UserActivityCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCourseProduct: <T = CourseProduct>(args: { data: CourseProductCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateCourseProduct: <T = CourseProduct>(args: { data: CourseProductUpdateInput, where: CourseProductWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCourseStepDefinition: <T = CourseStepDefinition>(args: { data: CourseStepDefinitionCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyCourseStepDefinitions: <T = Array<CourseStepDefinition>>(args: { data: Array<CourseStepDefinitionCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateCourseStepDefinition: <T = CourseStepDefinition>(args: { data: CourseStepDefinitionUpdateInput, where: CourseStepDefinitionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteCourseStepDefinition: <T = StandardDeleteResponse>(args: { where: CourseStepDefinitionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    submitCourseStep: <T = CourseStepSubmitResult>(args: { data: CourseStepUpdateInput, where: CourseStepWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    downloadCourseStep: <T = CourseStepSubmitResult>(args: { data: CourseStepUpdateInput, where: CourseStepWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createCourse: <T = Course>(args: { data: CourseCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    completeCourse: <T = Course>(args: { where: CourseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateCourse: <T = Course>(args: { data: CourseUpdateInput, where: CourseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteCourse: <T = StandardDeleteResponse>(args: { where: CourseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFounderProfile: <T = FounderProfile>(args: { data: FounderProfileCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFounderProfile: <T = FounderProfile>(args: { data: FounderProfileUpdateInput, where: FounderProfileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createStartup: <T = Startup>(args: { data: StartupCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateStartup: <T = Startup>(args: { data: StartupUpdateInput, where: StartupWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createAuthAccount: <T = AuthAccount>(args: { data: AuthAccountCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteAuthAccount: <T = StandardDeleteResponse>(args: { where: AuthAccountWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createOrganization: <T = Organization>(args: { data: OrganizationCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateOrganization: <T = Organization>(args: { data: OrganizationUpdateInput, where: OrganizationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteOrganization: <T = StandardDeleteResponse>(args: { where: OrganizationWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    requestPasswordReset: <T = Boolean>(args: { data: PasswordResetCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    executePasswordReset: <T = Boolean>(args: { data: ExecutePasswordResetInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createSession: <T = Session>(args: { data: SessionCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateSession: <T = Session>(args: { data: SessionUpdateInput, where: SessionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteSession: <T = StandardDeleteResponse>(args: { where: SessionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUserInvite: <T = UserInvite>(args: { data: UserInviteCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUserPlanRegistration: <T = UserPlanRegistration>(args: { data: UserPlanRegistrationCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    register: <T = User>(args: { data: UserRegisterInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    login: <T = UserLoginResponse>(args: { data: UserLoginInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUser: <T = User>(args: { data: UserCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUser: <T = User>(args: { data: UserUpdateInput, where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUserStatus: <T = User>(args: { action: String, userId: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUser: <T = StandardDeleteResponse>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createVerificationRequest: <T = VerificationRequest>(args: { data: VerificationRequestCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteVerificationRequest: <T = StandardDeleteResponse>(args: { where: VerificationRequestWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createInvestorProfile: <T = InvestorProfile>(args: { data: InvestorProfileCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateInvestorProfile: <T = InvestorProfile>(args: { data: InvestorProfileUpdateInput, where: InvestorProfileWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPerk: <T = Perk>(args: { data: PerkCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePerk: <T = Perk>(args: { data: PerkUpdateInput, where: PerkWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPitchComment: <T = PitchComment>(args: { data: PitchCommentCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPitchDeck: <T = PitchDeck>(args: { data: PitchDeckCreateExtendedInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePitchDeck: <T = PitchDeck>(args: { data: PitchDeckUpdateInput, where: PitchDeckWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    requestPitchMeetingFeedback: <T = PitchMeetingFeedback>(args: { data: PitchMeetingFeedbackRequestInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    assignPitchMeetingFeedback: <T = PitchMeetingFeedback>(args: { where: PitchMeetingFeedbackWhereUniqueInput, data: PitchMeetingFeedbackAssignInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    completePitchMeetingFeedback: <T = PitchMeetingFeedback>(args: { where: PitchMeetingFeedbackWhereUniqueInput, data: PitchMeetingFeedbackCompleteInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deletePitchMeetingFeedback: <T = StandardDeleteResponse>(args: { where: PitchMeetingFeedbackWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPitchUpdate: <T = PitchUpdate>(args: { data: PitchUpdateCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertPitchUserStatus: <T = PitchUserStatusUpsertResult>(args: { data: PitchUserStatusUpdateInput, where: PitchUserStatusWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPitchVideo: <T = PitchVideo>(args: { data: PitchVideoCreateExtendedInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePitchVideo: <T = PitchVideo>(args: { data: PitchVideoUpdateInput, where: PitchVideoWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    requestPitchWrittenFeedback: <T = PitchWrittenFeedback>(args: { data: PitchWrittenFeedbackRequestInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    requestPitchWrittenFeedbackRetainDeck: <T = PitchWrittenFeedback>(args: { data: PitchWrittenFeedbackRequestRetainDeckInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    assignPitchWrittenFeedback: <T = PitchWrittenFeedback>(args: { where: PitchWrittenFeedbackWhereUniqueInput, data: PitchWrittenFeedbackAssignInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    completePitchWrittenFeedback: <T = PitchWrittenFeedback>(args: { where: PitchWrittenFeedbackWhereUniqueInput, data: PitchWrittenFeedbackCompleteInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deletePitchWrittenFeedback: <T = StandardDeleteResponse>(args: { where: PitchWrittenFeedbackWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPitch: <T = Pitch>(args: { data: PitchCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    publishPitch: <T = Pitch>(args: { where: PitchWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    unpublishPitch: <T = Pitch>(args: { where: PitchWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePitch: <T = Pitch>(args: { data: PitchUpdateInput, where: PitchWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createPlan: <T = Plan>(args: { data: PlanCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createStripeWebhookEvent: <T = StripeWebhookEvent>(args: { data: StripeWebhookEventCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createEventType: <T = EventType>(args: { data: EventTypeCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyEventTypes: <T = Array<EventType>>(args: { data: Array<EventTypeCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateEventType: <T = EventType>(args: { data: EventTypeUpdateInput, where: EventTypeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteEventType: <T = StandardDeleteResponse>(args: { where: EventTypeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createEvent: <T = Event>(args: { data: EventCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyEvents: <T = Array<Event>>(args: { data: Array<EventCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateEvent: <T = Event>(args: { data: EventUpdateInput, where: EventWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteEvent: <T = StandardDeleteResponse>(args: { where: EventWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createSubscription: <T = Subscription>(args: { data: SubscriptionCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManySubscriptions: <T = Array<Subscription>>(args: { data: Array<SubscriptionCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateSubscription: <T = Subscription>(args: { data: SubscriptionUpdateInput, where: SubscriptionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteSubscription: <T = StandardDeleteResponse>(args: { where: SubscriptionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createSuggestedResource: <T = SuggestedResource>(args: { data: SuggestedResourceCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateSuggestedResource: <T = SuggestedResource>(args: { data: SuggestedResourceUpdateInput, where: SuggestedResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    id: <T = ID_Output>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    createdAt: <T = DateTime>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    createdById: <T = ID_Output>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    updatedAt: <T = DateTime | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    updatedById: <T = ID_Output | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    deletedAt: <T = DateTime | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    deletedById: <T = ID_Output | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    version: <T = Int>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    ownerId: <T = ID_Output>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    eventTypeId: <T = String>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    type: <T = SubscriptionType>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    url: <T = String | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    jobId: <T = String | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    active: <T = Boolean | null>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> 
  }

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type AuthAccountOrderByInput =   'id_ASC' |
  'id_DESC'

export type CalendlyWebhookEventStatus =   'NEW' |
  'PROCESSED' |
  'SKIPPED'

export type CityOrderByInput =   'id_ASC' |
  'id_DESC'

export type ConversationOrderByInput =   'updatedAt_ASC' |
  'updatedAt_DESC'

export type CourseDefinitionOrderByInput =   'id_ASC' |
  'id_DESC'

export type CourseDefinitionProductOrderByInput =   'id_ASC' |
  'id_DESC'

export type CourseOrderByInput =   'id_ASC' |
  'id_DESC'

export type CourseProductOrderByInput =   'id_ASC' |
  'id_DESC'

export type CourseProductStatus =   'AVAILABLE' |
  'COMPLETE' |
  'COMPLETE_MIGRATED'

export type CourseStatus =   'ACTIVE' |
  'COMPLETE' |
  'CANCELLED'

export type CourseStepDefinitionOrderByInput =   'sequenceNum_ASC' |
  'sequenceNum_DESC'

export type CourseStepDefinitionType =   'VIDEO' |
  'DOWNLOAD' |
  'FORM' |
  'MARKDOWN' |
  'INSTRUCTIONS'

export type CourseStepOrderByInput =   'id_ASC' |
  'id_DESC'

export type CourseStepStatus =   'COMPLETE' |
  'NEW'

export type EventOrderByInput =   'id_ASC' |
  'id_DESC'

export type EventStatus =   'NEW' |
  'PROCESSED' |
  'SKIPPED' |
  'FAILED'

export type EventTypeOrderByInput =   'id_ASC' |
  'id_DESC'

export type ExternalSystemType =   'STRIPE'

export type OrganizationOrderByInput =   'id_ASC' |
  'id_DESC'

export type PasswordResetStatus =   'OPEN' |
  'COMPLETE'

export type PaymentStatus =   'SUCCEEDED' |
  'REQUIRES_ACTION' |
  'REQUIRES_PAYMENT_METHOD' |
  'PROCESSING' |
  'AMOUNT_CAPTURABLE_UPDATED' |
  'PAYMENT_FAILED'

export type PerkOrderByInput =   'updatedAt_ASC' |
  'updatedAt_DESC'

export type PermissionOrderByInput =   'id_ASC' |
  'id_DESC'

export type PitchCommentVisibility =   'ANONYMOUS' |
  'VISIBLE'

export type PitchDeckOrderByInput =   'id_ASC' |
  'id_DESC'

export type PitchDeckStatus =   'ACTIVE' |
  'INACTIVE'

export type PitchListStatus =   'DEFAULT' |
  'BOOKMARK' |
  'IGNORE'

export type PitchMeetingFeedbackOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC'

export type PitchMeetingFeedbackStatus =   'REQUESTED' |
  'ASSIGNED' |
  'COMPLETE'

export type PitchOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'views_ASC' |
  'views_DESC' |
  'bookmarks_ASC' |
  'bookmarks_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC'

export type PitchStatus =   'DRAFT' |
  'ACTIVE' |
  'PUBLISHED'

export type PitchVideoOrderByInput =   'id_ASC' |
  'id_DESC'

export type PitchVideoStatus =   'ACTIVE' |
  'INACTIVE'

export type PitchWatchStatus =   'UNWATCHED' |
  'WATCHED' |
  'UNWATCHED_MANUAL'

export type PitchWrittenFeedbackOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC'

export type PitchWrittenFeedbackStatus =   'DRAFT' |
  'REQUESTED' |
  'ASSIGNED' |
  'COMPLETE' |
  'AWAITING_QA'

export type ProductOrderByInput =   'id_ASC' |
  'id_DESC'

export type RoleOrderByInput =   'id_ASC' |
  'id_DESC'

export type RolePermissionOrderByInput =   'id_ASC' |
  'id_DESC'

export type SessionOrderByInput =   'id_ASC' |
  'id_DESC'

export type StripeWebhookEventStatus =   'NEW' |
  'PROCESSED' |
  'SKIPPED'

export type SubscriptionOrderByInput =   'id_ASC' |
  'id_DESC'

export type SubscriptionType =   'WEBHOOK' |
  'JOB'

export type SuggestedResourceOrderByInput =   'id_ASC' |
  'id_DESC'

export type UpsertAction =   'CREATE' |
  'UPDATE'

export type UserInviteOrderByInput =   'id_ASC' |
  'id_DESC'

export type UserInviteStatus =   'OPEN' |
  'ACCEPTED'

export type UserOrderByInput =   'lastLoginAt_ASC' |
  'lastLoginAt_DESC'

export type UserPlanRegistrationStatus =   'INPROGRESS' |
  'COMPLETED' |
  'FAILED'

export type UserRoleOrderByInput =   'id_ASC' |
  'id_DESC'

export type UserStatus =   'VERIFICATION' |
  'ONBOARDING' |
  'ONBOARDING_STARTUP' |
  'ACTIVE' |
  'INACTIVE'

export type VerificationRequestOrderByInput =   'id_ASC' |
  'id_DESC'

export interface AccreditationStatusCreateInput {
  description: String
  archived: Boolean
}

export interface AccreditationStatusUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface AccreditationStatusWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface AccreditationStatusWhereUniqueInput {
  id: ID_Output
}

export interface AuthAccountCreateInput {
  userId: ID_Output
  providerType: String
  providerId: String
  providerAccountId: String
  refreshToken?: String | null
  accessToken?: String | null
  accessTokenExpires?: DateTime | null
}

export interface AuthAccountUpdateInput {
  userId?: ID_Input | null
  providerType?: String | null
  providerId?: String | null
  providerAccountId?: String | null
  refreshToken?: String | null
  accessToken?: String | null
  accessTokenExpires?: DateTime | null
}

export interface AuthAccountWhereInput {
  providerId_eq?: String | null
  providerAccountId_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface AuthAccountWhereUniqueInput {
  id?: ID_Input | null
}

export interface CalendlyWebhookEventCreateInput {
  type: String
  raw: JSONObject
}

export interface CalendlyWebhookEventUpdateInput {
  type?: String | null
  raw?: JSONObject | null
}

export interface CalendlyWebhookEventWhereInput {
  status_eq?: CalendlyWebhookEventStatus | null
  raw_json?: JSONObject | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CalendlyWebhookEventWhereUniqueInput {
  id: ID_Output
}

export interface CheckoutRequestCreateInput {
  stripePlanId: String
  successUrl: String
  cancelUrl: String
}

export interface CheckoutRequestUpdateInput {
  stripePlanId?: String | null
  successUrl?: String | null
  cancelUrl?: String | null
}

export interface CheckoutRequestWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CheckoutRequestWhereUniqueInput {
  id: ID_Output
}

export interface CheckoutResponseCreateInput {
  stripeSessionId: String
}

export interface CheckoutResponseUpdateInput {
  stripeSessionId?: String | null
}

export interface CheckoutResponseWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CheckoutResponseWhereUniqueInput {
  id: ID_Output
}

export interface CityCreateInput {
  lat?: Float | null
  lon?: Float | null
  population?: Float | null
  stateProvinceId: ID_Output
  description: String
  archived: Boolean
}

export interface CityUpdateInput {
  lat?: Float | null
  lon?: Float | null
  population?: Float | null
  stateProvinceId?: ID_Input | null
  description?: String | null
  archived?: Boolean | null
}

export interface CityWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CityWhereUniqueInput {
  id: ID_Output
}

export interface CompanyRoleCreateInput {
  description: String
  archived: Boolean
}

export interface CompanyRoleUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface CompanyRoleWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CompanyRoleWhereUniqueInput {
  id: ID_Output
}

export interface CompanyStageCreateInput {
  description: String
  archived: Boolean
}

export interface CompanyStageUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface CompanyStageWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CompanyStageWhereUniqueInput {
  id: ID_Output
}

export interface ConversationCreateInput {
  friendlyName?: String | null
}

export interface ConversationMessageCreateInput {
  conversationId: ID_Output
  body: String
  readAt?: DateTime | null
}

export interface ConversationMessageUpdateInput {
  conversationId?: ID_Input | null
  body?: String | null
  readAt?: DateTime | null
}

export interface ConversationMessageWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface ConversationMessageWhereUniqueInput {
  id: ID_Output
}

export interface ConversationParticipantCreateInput {
  conversationId: ID_Output
  userId: ID_Output
  lastReadAt?: DateTime | null
}

export interface ConversationParticipantUpdateInput {
  conversationId?: ID_Input | null
  userId?: ID_Input | null
  lastReadAt?: DateTime | null
}

export interface ConversationParticipantWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface ConversationParticipantWhereUniqueInput {
  id: ID_Output
}

export interface ConversationUpdateInput {
  friendlyName?: String | null
}

export interface ConversationWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface ConversationWhereUniqueInput {
  id: ID_Output
}

export interface CorporateStructureCreateInput {
  description: String
  archived: Boolean
}

export interface CorporateStructureUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface CorporateStructureWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CorporateStructureWhereUniqueInput {
  id: ID_Output
}

export interface CountryCreateInput {
  description: String
  archived: Boolean
}

export interface CountryUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface CountryWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CountryWhereUniqueInput {
  id: ID_Output
}

export interface CourseCreateInput {
  courseDefinitionId: ID_Output
}

export interface CourseDefinitionCreateInput {
  name: String
  description: String
}

export interface CourseDefinitionProductCreateInput {
  name: String
  description: String
  courseDefinitionId: ID_Output
  productId: ID_Output
}

export interface CourseDefinitionProductUpdateInput {
  name?: String | null
  description?: String | null
  courseDefinitionId?: ID_Input | null
  productId?: ID_Input | null
}

export interface CourseDefinitionProductWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseDefinitionProductWhereUniqueInput {
  id: ID_Output
}

export interface CourseDefinitionUpdateInput {
  name?: String | null
  description?: String | null
}

export interface CourseDefinitionWhereInput {
  name_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseDefinitionWhereUniqueInput {
  id: ID_Output
}

export interface CourseProductCreateInput {
  courseId: ID_Output
  productId: ID_Output
  objectId?: ID_Input | null
}

export interface CourseProductUpdateInput {
  courseId?: ID_Input | null
  productId?: ID_Input | null
  objectId?: ID_Input | null
}

export interface CourseProductWhereInput {
  courseId_eq?: ID_Input | null
  status_eq?: CourseProductStatus | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseProductWhereUniqueInput {
  id: ID_Output
}

export interface CourseStepCreateInput {
  courseId: ID_Output
  courseStepDefinitionId: ID_Output
  data: JSONObject
}

export interface CourseStepDefinitionCreateInput {
  name: String
  section: String
  sequenceNum: Float
  description: String
  eventType?: String | null
  type: CourseStepDefinitionType
  config: JSONObject
  courseDefinitionId: ID_Output
}

export interface CourseStepDefinitionUpdateInput {
  name?: String | null
  section?: String | null
  sequenceNum?: Float | null
  description?: String | null
  eventType?: String | null
  type?: CourseStepDefinitionType | null
  config?: JSONObject | null
  courseDefinitionId?: ID_Input | null
}

export interface CourseStepDefinitionWhereInput {
  sequenceNum_gt?: Int | null
  config_json?: JSONObject | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseStepDefinitionWhereUniqueInput {
  id: ID_Output
}

export interface CourseStepUpdateInput {
  courseId?: ID_Input | null
  courseStepDefinitionId?: ID_Input | null
  data?: JSONObject | null
}

export interface CourseStepWhereInput {
  status_eq?: CourseStepStatus | null
  courseId_eq?: ID_Input | null
  courseStepDefinitionId_eq?: ID_Input | null
  data_json?: JSONObject | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseStepWhereUniqueInput {
  id: ID_Output
}

export interface CourseUpdateInput {
  courseDefinitionId?: ID_Input | null
}

export interface CourseWhereInput {
  status_eq?: CourseStatus | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface CourseWhereUniqueInput {
  id: ID_Output
}

export interface CriteriaCreateInput {
  description: String
  archived: Boolean
}

export interface CriteriaUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface CriteriaWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface CriteriaWhereUniqueInput {
  id: ID_Output
}

export interface DisabilityCreateInput {
  description: String
  archived: Boolean
}

export interface DisabilityUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface DisabilityWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface DisabilityWhereUniqueInput {
  id: ID_Output
}

export interface EthnicityCreateInput {
  description: String
  archived: Boolean
}

export interface EthnicityUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface EthnicityWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface EthnicityWhereUniqueInput {
  id: ID_Output
}

export interface EventCreateInput {
  type: String
  status: EventStatus
  statusMessage?: String | null
  objectType: String
  objectId: ID_Output
  ownerId: String
  payload?: JSONObject | null
}

export interface EventTypeCreateInput {
  name: String
  template?: String | null
  allowSubscription: Boolean
}

export interface EventTypeUpdateInput {
  name?: String | null
  template?: String | null
  allowSubscription?: Boolean | null
}

export interface EventTypeWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface EventTypeWhereUniqueInput {
  name?: String | null
  id?: ID_Input | null
}

export interface EventUpdateInput {
  type?: String | null
  status?: EventStatus | null
  statusMessage?: String | null
  objectType?: String | null
  objectId?: ID_Input | null
  ownerId?: String | null
  payload?: JSONObject | null
}

export interface EventWhereInput {
  status_eq?: EventStatus | null
  payload_json?: JSONObject | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface EventWhereUniqueInput {
  id: ID_Output
}

export interface ExecutePasswordResetInput {
  token: String
  password: String
  confirmPassword: String
}

export interface ExternalSystemIdCreateInput {
  externalSystemId: String
  externalSystemName: ExternalSystemType
}

export interface ExternalSystemIdUpdateInput {
  externalSystemId?: String | null
  externalSystemName?: ExternalSystemType | null
}

export interface ExternalSystemIdWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface ExternalSystemIdWhereUniqueInput {
  id: ID_Output
}

export interface FileCreateInput {
  url: String
}

export interface FileCreateSignedURLInput {
  fileName: String
}

export interface FileUpdateInput {
  url?: String | null
}

export interface FileWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface FileWhereUniqueInput {
  id: ID_Output
}

export interface FounderProfileCreateInput {
  stateProvince: String
  twitterUrl?: String | null
  linkedinUrl?: String | null
  ethnicities?: String[] | String | null
  gender?: String | null
  sexualOrientation?: String | null
  companyStage?: String | null
  fundingStatus?: String | null
  industry?: String[] | String | null
  presentationStatus?: String | null
  transgender?: String | null
  disability?: String | null
  companyRoles?: String[] | String | null
  workingStatus?: String | null
  pronouns?: String | null
  source?: String | null
  bubbleLocation?: String | null
}

export interface FounderProfileUpdateInput {
  stateProvince?: String | null
  twitterUrl?: String | null
  linkedinUrl?: String | null
  ethnicities?: String[] | String | null
  gender?: String | null
  sexualOrientation?: String | null
  companyStage?: String | null
  fundingStatus?: String | null
  industry?: String[] | String | null
  presentationStatus?: String | null
  transgender?: String | null
  disability?: String | null
  companyRoles?: String[] | String | null
  workingStatus?: String | null
  pronouns?: String | null
  source?: String | null
  bubbleLocation?: String | null
}

export interface FounderProfileWhereInput {
  ethnicities_containsAll?: String[] | String | null
  ethnicities_containsNone?: String[] | String | null
  ethnicities_containsAny?: String[] | String | null
  industry_containsAll?: String[] | String | null
  industry_containsNone?: String[] | String | null
  industry_containsAny?: String[] | String | null
  companyRoles_containsAll?: String[] | String | null
  companyRoles_containsNone?: String[] | String | null
  companyRoles_containsAny?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface FounderProfileWhereUniqueInput {
  userId?: String | null
  id?: ID_Input | null
}

export interface FundingStatusCreateInput {
  description: String
  archived: Boolean
}

export interface FundingStatusUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface FundingStatusWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface FundingStatusWhereUniqueInput {
  id: ID_Output
}

export interface GenderCreateInput {
  description: String
  archived: Boolean
}

export interface GenderUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface GenderWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface GenderWhereUniqueInput {
  id: ID_Output
}

export interface IndustryCreateInput {
  description: String
  archived: Boolean
}

export interface IndustryUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface IndustryWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface IndustryWhereUniqueInput {
  id: ID_Output
}

export interface InvestorProfileCreateInput {
  accreditationStatuses: Array<String>
  linkedinUrl?: String | null
  investorTypes: Array<String>
  thesis?: String | null
  criteria?: String[] | String | null
  ethnicities?: String[] | String | null
  gender?: String | null
  pronouns?: String | null
  industries?: String[] | String | null
  demographics?: String[] | String | null
  stateProvince?: String | null
  companyStages?: String[] | String | null
  fundingStatuses?: String[] | String | null
  revenues?: String[] | String | null
  source?: String | null
}

export interface InvestorProfileUpdateInput {
  accreditationStatuses?: String[] | String | null
  linkedinUrl?: String | null
  investorTypes?: String[] | String | null
  thesis?: String | null
  criteria?: String[] | String | null
  ethnicities?: String[] | String | null
  gender?: String | null
  pronouns?: String | null
  industries?: String[] | String | null
  demographics?: String[] | String | null
  stateProvince?: String | null
  companyStages?: String[] | String | null
  fundingStatuses?: String[] | String | null
  revenues?: String[] | String | null
  source?: String | null
}

export interface InvestorProfileWhereInput {
  userId_eq?: String | null
  accreditationStatuses_containsAll?: String[] | String | null
  accreditationStatuses_containsNone?: String[] | String | null
  accreditationStatuses_containsAny?: String[] | String | null
  investorTypes_containsAll?: String[] | String | null
  investorTypes_containsNone?: String[] | String | null
  investorTypes_containsAny?: String[] | String | null
  criteria_containsAll?: String[] | String | null
  criteria_containsNone?: String[] | String | null
  criteria_containsAny?: String[] | String | null
  ethnicities_containsAll?: String[] | String | null
  ethnicities_containsNone?: String[] | String | null
  ethnicities_containsAny?: String[] | String | null
  industries_containsAll?: String[] | String | null
  industries_containsNone?: String[] | String | null
  industries_containsAny?: String[] | String | null
  demographics_containsAll?: String[] | String | null
  demographics_containsNone?: String[] | String | null
  demographics_containsAny?: String[] | String | null
  companyStages_containsAll?: String[] | String | null
  companyStages_containsNone?: String[] | String | null
  companyStages_containsAny?: String[] | String | null
  fundingStatuses_containsAll?: String[] | String | null
  fundingStatuses_containsNone?: String[] | String | null
  fundingStatuses_containsAny?: String[] | String | null
  revenues_containsAll?: String[] | String | null
  revenues_containsNone?: String[] | String | null
  revenues_containsAny?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface InvestorProfileWhereUniqueInput {
  userId?: String | null
  id?: ID_Input | null
}

export interface InvestorTypeCreateInput {
  description: String
  archived: Boolean
}

export interface InvestorTypeUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface InvestorTypeWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface InvestorTypeWhereUniqueInput {
  id: ID_Output
}

export interface ListWhereInput {
  listName_in: Array<String>
}

export interface OrganizationCreateInput {
  userId: ID_Output
  name: String
  website: String
}

export interface OrganizationUpdateInput {
  userId?: ID_Input | null
  name?: String | null
  website?: String | null
}

export interface OrganizationWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface OrganizationWhereUniqueInput {
  id: ID_Output
}

export interface PasswordResetCreateInput {
  email: String
}

export interface PasswordResetUpdateInput {
  email?: String | null
}

export interface PasswordResetWhereInput {
  status_eq?: PasswordResetStatus | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PasswordResetWhereUniqueInput {
  token?: String | null
  id?: ID_Input | null
}

export interface PerkCategoryCreateInput {
  description: String
  archived: Boolean
}

export interface PerkCategoryUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface PerkCategoryWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface PerkCategoryWhereUniqueInput {
  id: ID_Output
}

export interface PerkCreateInput {
  companyName: String
  companyBio: String
  description: String
  perkCategoryId: ID_Output
  url: String
  logoFileId: ID_Output
}

export interface PerkUpdateInput {
  companyName?: String | null
  companyBio?: String | null
  description?: String | null
  perkCategoryId?: ID_Input | null
  url?: String | null
  logoFileId?: ID_Input | null
}

export interface PerkWhereInput {
  perkCategoryId_eq?: ID_Input | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PerkWhereUniqueInput {
  id: ID_Output
}

export interface PermissionCreateInput {
  code: String
  description?: String | null
}

export interface PermissionUpdateInput {
  code?: String | null
  description?: String | null
}

export interface PermissionWhereInput {
  code_eq?: String | null
  code_in?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PermissionWhereUniqueInput {
  code?: String | null
  id?: ID_Input | null
}

export interface PitchCommentCreateInput {
  body: String
  pitchId: ID_Output
  visibility: PitchCommentVisibility
}

export interface PitchCommentUpdateInput {
  body?: String | null
  pitchId?: ID_Input | null
  visibility?: PitchCommentVisibility | null
}

export interface PitchCommentWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchCommentWhereUniqueInput {
  id: ID_Output
}

export interface PitchCreateInput {
  shortDescription?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Float | null
  presentationComfortLevel?: Float | null
  challenges?: String | null
  listStatus?: String | null
}

export interface PitchDeckCreateExtendedInput {
  pitchId: String
  file: FileCreateInput
  draft?: Boolean | null
}

export interface PitchDeckCreateInput {
  draft: Boolean
  isCategorized: Boolean
  numPages: Float
  pitchId: ID_Output
}

export interface PitchDeckUpdateInput {
  draft?: Boolean | null
  isCategorized?: Boolean | null
  numPages?: Float | null
  pitchId?: ID_Input | null
}

export interface PitchDeckWhereInput {
  status_eq?: PitchDeckStatus | null
  draft_eq?: Boolean | null
  isCategorized_eq?: Boolean | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchDeckWhereUniqueInput {
  id: ID_Output
}

export interface PitchMeetingFeedbackAssignInput {
  reviewerId: String
}

export interface PitchMeetingFeedbackCompleteInput {
  file: FileCreateInput
  reviewerNotes?: String | null
}

export interface PitchMeetingFeedbackCreateInput {
  pitchId: ID_Output
  reviewerNotes?: String | null
  courseProductId: String
  reviewerId?: ID_Input | null
}

export interface PitchMeetingFeedbackRequestInput {
  pitchId: String
  courseProductId: String
  ownerId: String
}

export interface PitchMeetingFeedbackUpdateInput {
  pitchId?: ID_Input | null
  reviewerNotes?: String | null
  courseProductId?: String | null
  reviewerId?: ID_Input | null
}

export interface PitchMeetingFeedbackWhereInput {
  status_eq?: PitchMeetingFeedbackStatus | null
  courseProductId_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchMeetingFeedbackWhereUniqueInput {
  id: ID_Output
}

export interface PitchQueryInput {
  status_eq?: PitchStatus | null
  userId_eq?: ID_Input | null
  userId_in?: ID_Output[] | ID_Output | null
  organizationId_eq?: ID_Input | null
  organizationId_in?: ID_Output[] | ID_Output | null
  ownerId_eq?: ID_Input | null
  ownerId_in?: ID_Output[] | ID_Output | null
  female_eq?: Boolean | null
  female_in?: Boolean[] | Boolean | null
  minority_eq?: Boolean | null
  minority_in?: Boolean[] | Boolean | null
  listStatus_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
  watchStatus_eq?: String | null
  femaleLeader_eq?: String | null
  minorityLeader_eq?: String | null
  industry_eq?: String | null
  stateProvince_eq?: String | null
  fundingStatus_eq?: String | null
  companyStage_eq?: String | null
  revenue_eq?: String | null
}

export interface PitchUpdateCreateInput {
  body: String
  pitchId: ID_Output
}

export interface PitchUpdateInput {
  shortDescription?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Float | null
  presentationComfortLevel?: Float | null
  challenges?: String | null
  listStatus?: String | null
}

export interface PitchUpdateUpdateInput {
  body?: String | null
  pitchId?: ID_Input | null
}

export interface PitchUpdateWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchUpdateWhereUniqueInput {
  id: ID_Output
}

export interface PitchUserStatusCreateInput {
  pitchId: ID_Output
  watchStatus: PitchWatchStatus
  listStatus: PitchListStatus
}

export interface PitchUserStatusUpdateInput {
  pitchId?: ID_Input | null
  watchStatus?: PitchWatchStatus | null
  listStatus?: PitchListStatus | null
  notified?: Boolean | null
}

export interface PitchUserStatusWhereInput {
  userId_eq?: ID_Input | null
  pitchId_eq?: ID_Input | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchUserStatusWhereUniqueInput {
  userId?: ID_Input | null
  pitchId?: ID_Input | null
  id?: ID_Input | null
}

export interface PitchVideoCreateExtendedInput {
  pitchId: String
  video: VideoCreateInput
  extendedVideo?: Boolean | null
}

export interface PitchVideoCreateInput {
  extendedVideo: Boolean
  pitchId: ID_Output
}

export interface PitchVideoUpdateInput {
  extendedVideo?: Boolean | null
  pitchId?: ID_Input | null
}

export interface PitchVideoWhereInput {
  status_eq?: PitchVideoStatus | null
  extendedVideo_eq?: Boolean | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchVideoWhereUniqueInput {
  id: ID_Output
}

export interface PitchWhereInput {
  status_eq?: PitchStatus | null
  userId_eq?: ID_Input | null
  userId_in?: ID_Output[] | ID_Output | null
  organizationId_eq?: ID_Input | null
  organizationId_in?: ID_Output[] | ID_Output | null
  ownerId_eq?: ID_Input | null
  ownerId_in?: ID_Output[] | ID_Output | null
  female_eq?: Boolean | null
  female_in?: Boolean[] | Boolean | null
  minority_eq?: Boolean | null
  minority_in?: Boolean[] | Boolean | null
  listStatus_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchWhereUniqueInput {
  id: ID_Output
}

export interface PitchWrittenFeedbackAssignInput {
  reviewerId: String
}

export interface PitchWrittenFeedbackCompleteInput {
  pitchDeck: PitchDeckCreateExtendedInput
  reviewerNotes?: String | null
}

export interface PitchWrittenFeedbackCreateInput {
  pitchId: ID_Output
  reviewerNotes?: String | null
  courseProductId: String
}

export interface PitchWrittenFeedbackRequestInput {
  pitchId: String
  pitchDeck: PitchDeckCreateExtendedInput
  courseProductId: String
}

export interface PitchWrittenFeedbackRequestRetainDeckInput {
  pitchId: String
  pitchDeck: PitchDeckWhereUniqueInput
  courseProductId: String
}

export interface PitchWrittenFeedbackUpdateInput {
  pitchId?: ID_Input | null
  reviewerNotes?: String | null
  courseProductId?: String | null
}

export interface PitchWrittenFeedbackWhereInput {
  status_eq?: PitchWrittenFeedbackStatus | null
  courseProductId_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PitchWrittenFeedbackWhereUniqueInput {
  id: ID_Output
}

export interface PlanCreateInput {
  stripePlanId: String
  stripePlanName: String
  stripePlanDescription: String
  stripePlanCurrency: String
  stripePlanPrice: Float
  stripePlanPeriod: String
  stripePlanSubscriptionId: String
  status?: PaymentStatus | null
  userId: ID_Output
}

export interface PlanUpdateInput {
  stripePlanId?: String | null
  stripePlanName?: String | null
  stripePlanDescription?: String | null
  stripePlanCurrency?: String | null
  stripePlanPrice?: Float | null
  stripePlanPeriod?: String | null
  stripePlanSubscriptionId?: String | null
  status?: PaymentStatus | null
  userId?: ID_Input | null
}

export interface PlanWhereInput {
  status_eq?: PaymentStatus | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface PlanWhereUniqueInput {
  id: ID_Output
}

export interface PresentationStatusCreateInput {
  description: String
  archived: Boolean
}

export interface PresentationStatusUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface PresentationStatusWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface PresentationStatusWhereUniqueInput {
  id: ID_Output
}

export interface ProductCreateInput {
  name: String
  description: String
}

export interface ProductUpdateInput {
  name?: String | null
  description?: String | null
}

export interface ProductWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface ProductWhereUniqueInput {
  id: ID_Output
}

export interface PronounCreateInput {
  description: String
  archived: Boolean
}

export interface PronounUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface PronounWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface PronounWhereUniqueInput {
  id: ID_Output
}

export interface RevenueCreateInput {
  description: String
  archived: Boolean
}

export interface RevenueUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface RevenueWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface RevenueWhereUniqueInput {
  id: ID_Output
}

export interface RoleCreateInput {
  name: String
  code: String
}

export interface RolePermissionCreateInput {
  permissionId: ID_Output
  roleId: ID_Output
}

export interface RolePermissionUpdateInput {
  permissionId?: ID_Input | null
  roleId?: ID_Input | null
}

export interface RolePermissionWhereInput {
  permissionId_eq?: ID_Input | null
  roleId_eq?: ID_Input | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface RolePermissionWhereUniqueInput {
  permissionId?: ID_Input | null
  roleId?: ID_Input | null
  id?: ID_Input | null
}

export interface RoleUpdateInput {
  name?: String | null
  code?: String | null
}

export interface RoleWhereInput {
  name_eq?: String | null
  code_eq?: String | null
  code_in?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface RoleWhereUniqueInput {
  code?: String | null
  id?: ID_Input | null
}

export interface SessionCreateInput {
  userId: ID_Output
  expires: DateTime
  sessionToken: String
  accessToken: String
}

export interface SessionUpdateInput {
  userId?: ID_Input | null
  expires?: DateTime | null
  sessionToken?: String | null
  accessToken?: String | null
}

export interface SessionWhereInput {
  sessionToken_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface SessionWhereUniqueInput {
  sessionToken?: String | null
  accessToken?: String | null
  id?: ID_Input | null
}

export interface SexualOrientationCreateInput {
  description: String
  archived: Boolean
}

export interface SexualOrientationUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface SexualOrientationWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface SexualOrientationWhereUniqueInput {
  id: ID_Output
}

export interface StartupCreateInput {
  name?: String | null
  website?: String | null
  corporateStructure?: String | null
  country?: String | null
  stateProvince?: String | null
  fundraiseStatus?: String | null
  companyStage?: String | null
  revenue?: String | null
  industries: Array<String>
  shortDescription?: String | null
  originStory?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Float | null
  presentationComfortLevel?: Float | null
  businessChallenge?: String | null
  desiredSupport?: String | null
  anythingElse?: String | null
  additionalTeamMembers?: Boolean | null
}

export interface StartupUpdateInput {
  name?: String | null
  website?: String | null
  corporateStructure?: String | null
  country?: String | null
  stateProvince?: String | null
  fundraiseStatus?: String | null
  companyStage?: String | null
  revenue?: String | null
  industries?: String[] | String | null
  shortDescription?: String | null
  tinyDescription?: String | null
  originStory?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Float | null
  presentationComfortLevel?: Float | null
  businessChallenge?: String | null
  desiredSupport?: String | null
  anythingElse?: String | null
  additionalTeamMembers?: Boolean | null
}

export interface StartupWhereInput {
  industries_containsAll?: String[] | String | null
  industries_containsNone?: String[] | String | null
  industries_containsAny?: String[] | String | null
  organizationId_eq?: String | null
  organizationId_in?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface StartupWhereUniqueInput {
  id: ID_Output
}

export interface StateProvinceCreateInput {
  description: String
  archived: Boolean
}

export interface StateProvinceUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface StateProvinceWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface StateProvinceWhereUniqueInput {
  id: ID_Output
}

export interface StripeWebhookEventCreateInput {
  type: String
  raw: JSONObject
}

export interface StripeWebhookEventUpdateInput {
  type?: String | null
  raw?: JSONObject | null
}

export interface StripeWebhookEventWhereInput {
  status_eq?: StripeWebhookEventStatus | null
  raw_json?: JSONObject | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface StripeWebhookEventWhereUniqueInput {
  id: ID_Output
}

export interface SubscriptionCreateInput {
  eventTypeId: String
  type: SubscriptionType
  url?: String | null
  jobId?: String | null
  active?: Boolean | null
}

export interface SubscriptionUpdateInput {
  eventTypeId?: String | null
  type?: SubscriptionType | null
  url?: String | null
  jobId?: String | null
  active?: Boolean | null
}

export interface SubscriptionWhereInput {
  url_eq?: String | null
  jobId_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface SubscriptionWhereUniqueInput {
  id: ID_Output
}

export interface SuggestedResourceCategoryCreateInput {
  description: String
  archived: Boolean
}

export interface SuggestedResourceCategoryUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface SuggestedResourceCategoryWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface SuggestedResourceCategoryWhereUniqueInput {
  id: ID_Output
}

export interface SuggestedResourceCreateInput {
  companyName: String
  suggestedResourceCategoryId: ID_Output
  url: String
  description?: String | null
  logoFileId: ID_Output
}

export interface SuggestedResourceUpdateInput {
  companyName?: String | null
  suggestedResourceCategoryId?: ID_Input | null
  url?: String | null
  description?: String | null
  logoFileId?: ID_Input | null
}

export interface SuggestedResourceWhereInput {
  suggestedResourceCategoryId_eq?: ID_Input | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface SuggestedResourceWhereUniqueInput {
  id: ID_Output
}

export interface TransgenderCreateInput {
  description: String
  archived: Boolean
}

export interface TransgenderUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface TransgenderWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface TransgenderWhereUniqueInput {
  id: ID_Output
}

export interface UserActivityCreateInput {
  eventType: String
}

export interface UserActivityUpdateInput {
  eventType?: String | null
}

export interface UserActivityWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserActivityWhereUniqueInput {
  id: ID_Output
}

export interface UserCreateInput {
  name: String
  email: String
  profilePictureFileId: ID_Output
  stripeUserId?: String | null
  isAccredited?: Boolean | null
  migratedFromBubble?: Boolean | null
  password?: String | null
}

export interface UserInviteCreateInput {
  email: String
  userType: String
}

export interface UserInviteUpdateInput {
  email?: String | null
  userType?: String | null
}

export interface UserInviteWhereInput {
  status_eq?: UserInviteStatus | null
  email_eq?: String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserInviteWhereUniqueInput {
  id: ID_Output
}

export interface UserLoginInput {
  email: String
  password: String
}

export interface UserPlanRegistrationCreateInput {
  email: String
  fullName: String
  stripeSubscriptionId: String
  stripePlanId: String
  userType: String
  raw: JSONObject
}

export interface UserPlanRegistrationUpdateInput {
  email?: String | null
  fullName?: String | null
  stripeSubscriptionId?: String | null
  stripePlanId?: String | null
  userType?: String | null
  raw?: JSONObject | null
}

export interface UserPlanRegistrationWhereInput {
  raw_json?: JSONObject | null
  status_eq?: UserPlanRegistrationStatus | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserPlanRegistrationWhereUniqueInput {
  id: ID_Output
}

export interface UserRegisterInput {
  name: String
  email: String
  profilePictureFileId: ID_Output
  stripeUserId?: String | null
  isAccredited?: Boolean | null
  migratedFromBubble?: Boolean | null
  password?: String | null
  type: String
  confirmPassword: String
}

export interface UserRoleCreateInput {
  userId: ID_Output
  roleId: ID_Output
  organization?: String | null
}

export interface UserRoleUpdateInput {
  userId?: ID_Input | null
  roleId?: ID_Input | null
  organization?: String | null
}

export interface UserRoleWhereInput {
  userId_eq?: ID_Input | null
  roleId_eq?: ID_Input | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserRoleWhereUniqueInput {
  userId?: ID_Input | null
  roleId?: ID_Input | null
  id?: ID_Input | null
}

export interface UserTypeCreateInput {
  type: String
  defaultRoleId: ID_Output
  allowedAtRegistration: Boolean
}

export interface UserTypeUpdateInput {
  type?: String | null
  defaultRoleId?: ID_Input | null
  allowedAtRegistration?: Boolean | null
}

export interface UserTypeWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserTypeWhereUniqueInput {
  id: ID_Output
}

export interface UserUpdateInput {
  name?: String | null
  email?: String | null
  profilePictureFileId?: ID_Input | null
  stripeUserId?: String | null
  isAccredited?: Boolean | null
  migratedFromBubble?: Boolean | null
  password?: String | null
}

export interface UserWhereInput {
  status_eq?: UserStatus | null
  name_contains?: String | null
  email_eq?: String | null
  isAccredited_eq?: Boolean | null
  migratedFromBubble_eq?: Boolean | null
  capabilities_containsAll?: String[] | String | null
  capabilities_containsNone?: String[] | String | null
  capabilities_containsAny?: String[] | String | null
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserWhereUniqueInput {
  email?: String | null
  id?: ID_Input | null
}

export interface VerificationRequestCreateInput {
  identifier: String
  token: String
  expires: DateTime
}

export interface VerificationRequestUpdateInput {
  identifier?: String | null
  token?: String | null
  expires?: DateTime | null
}

export interface VerificationRequestWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface VerificationRequestWhereUniqueInput {
  token?: String | null
  id?: ID_Input | null
}

export interface VideoCreateExtendedInput {
  pitchId: String
  file: FileCreateInput
}

export interface VideoCreateInput {
  fileId: ID_Output
}

export interface VideoUpdateInput {
  fileId?: ID_Input | null
}

export interface VideoWhereInput {
  deletedAt_all?: Boolean | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface VideoWhereUniqueInput {
  id: ID_Output
}

export interface WorkingStatusCreateInput {
  description: String
  archived: Boolean
}

export interface WorkingStatusUpdateInput {
  description?: String | null
  archived?: Boolean | null
}

export interface WorkingStatusWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  archived_eq?: Boolean | null
}

export interface WorkingStatusWhereUniqueInput {
  id: ID_Output
}

export interface DeleteResponse {
  id: ID_Output
}

export interface AccreditationStatus {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface AuthAccount {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  userId: ID_Output
  providerType: String
  providerId: String
  providerAccountId: String
  refreshToken?: String | null
  accessToken?: String | null
  accessTokenExpires?: DateTime | null
  user: User
}

export interface CalendlyWebhookEvent {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: CalendlyWebhookEventStatus
  type: String
  raw: JSONObject
}

export interface CheckoutRequest {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  stripePlanId: String
}

export interface CheckoutRequestCreateResponse {
  sessionUrl: String
}

export interface CheckoutResponse {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  stripeSessionId: String
}

export interface CheckoutResponseCreateResponse {
  stripeCustomerId?: String | null
  stripeSubscriptionId?: String | null
  stripeCustomerName?: String | null
  stripeCustomerEmail?: String | null
  stripePlanId?: String | null
  stripePlanName?: String | null
  appliesTo?: String | null
}

export interface City {
  id: ID_Output
  lat?: Float | null
  lon?: Float | null
  population?: Int | null
  stateProvince: StateProvince
  stateProvinceId: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface CompanyRole {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface CompanyStage {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Conversation {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  friendlyName?: String | null
  conversationMessages: Array<ConversationMessage>
  conversationParticipants: Array<ConversationParticipant>
}

export interface ConversationMessage {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  conversationId: ID_Output
  body: String
  pitchDeckId?: ID_Output | null;
  readAt?: DateTime | null
  createdBy: UserSafe
}

export interface ConversationParticipant {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  conversation: Conversation
  conversationId: ID_Output
  user: User
  userId: ID_Output
  lastReadAt?: DateTime | null
  messageAnonymously: Boolean
}

export interface CorporateStructure {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Country {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Course {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: CourseStatus
  courseSteps: Array<CourseStep>
  courseDefinition: CourseDefinition
  courseDefinitionId: ID_Output
  pitch: Pitch
  pitchId: ID_Output
  currentStep: String
  courseProducts: Array<CourseProduct>
}

export interface CourseDefinition {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  description: String
  courseStepDefinitions: Array<CourseStepDefinition>
  courses: Array<Course>
  courseDefinitionProducts: Array<CourseDefinitionProduct>
}

export interface CourseDefinitionProduct {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  description: String
  courseDefinition: CourseDefinition
  courseDefinitionId: ID_Output
  product: Product
  productId: ID_Output
}

export interface CourseProduct {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  course: Course
  courseId: ID_Output
  product: Product
  productId: ID_Output
  objectId?: ID_Output | null
  status: CourseProductStatus
}

export interface CourseStep {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: CourseStepStatus
  course: Course
  courseId: ID_Output
  courseStepDefinition: CourseStepDefinition
  courseStepDefinitionId: ID_Output
  data: JSONObject
  createdBy: User
}

export interface CourseStepDefinition {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  section: String
  sequenceNum: Int
  description: String
  eventType?: String | null
  type: CourseStepDefinitionType
  config: JSONObject
  courseDefinition: CourseDefinition
  courseDefinitionId: ID_Output
}

export interface CourseStepDownloadResult {
  data: CourseStep
  action: UpsertAction
}

export interface CourseStepSubmitResult {
  data: CourseStep
  course: Course
  action: UpsertAction
}

export interface Criteria {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Disability {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Ethnicity {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Event {
  id: ID_Output
  type: String
  status: EventStatus
  statusMessage?: String | null
  objectType: String
  objectId: ID_Output
  ownerId: String
  payload?: JSONObject | null
  createdAt: DateTime
  createdById: ID_Output
}

export interface EventType {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  template?: String | null
  allowSubscription: Boolean
}

export interface ExternalSystemId {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  externalSystemId: String
  externalSystemName: ExternalSystemType
}

export interface File {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  url: String
}

export interface FileSignedURLResponse {
  signedUrl?: String | null
}

export interface FounderProfile {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  user: User
  userId: String
  stateProvince: String
  twitterUrl?: String | null
  linkedinUrl?: String | null
  ethnicities?: Array<String> | null
  gender?: String | null
  sexualOrientation?: String | null
  companyStage?: String | null
  fundingStatus?: String | null
  industry?: Array<String> | null
  presentationStatus?: String | null
  transgender?: String | null
  disability?: String | null
  companyRoles?: Array<String> | null
  workingStatus?: String | null
  pronouns?: String | null
  source?: String | null
  bubbleLocation?: String | null
}

export interface FundingStatus {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Gender {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Industry {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface InvestorProfile {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  userId: String
  accreditationStatuses: Array<String>
  linkedinUrl?: String | null
  investorTypes: Array<String>
  thesis?: String | null
  criteria?: Array<String> | null
  ethnicities?: Array<String> | null
  gender?: String | null
  pronouns?: String | null
  industries?: Array<String> | null
  demographics?: Array<String> | null
  stateProvince?: String | null
  companyStages?: Array<String> | null
  fundingStatuses?: Array<String> | null
  revenues?: Array<String> | null
  source?: String | null
}

export interface InvestorType {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface List {
  id: String
  name: String
  items: Array<ListItem>
}

export interface ListItem {
  id: String
  code: String
  description: String
  archived: Boolean
}

export interface ManageStripeSubscriptionResponse {
  url: String
}

export interface Organization {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  userId: ID_Output
  name: String
  website: String
  pitches: Array<Pitch>
  courses: Array<Course>
  startup: Startup
  user: User
}

export interface OrganizationSafe {
  id: String
  name: String
  website: String
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface PasswordReset {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PasswordResetStatus
  email: String
  token: String
  expiresAt: DateTime
}

export interface Perk {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  companyName: String
  companyBio: String
  description: String
  perkCategory: PerkCategory
  perkCategoryId: ID_Output
  url: String
  logoFile: File
  logoFileId: ID_Output
}

export interface PerkCategory {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  perks: Array<Perk>
}

export interface Permission {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  code: String
  description?: String | null
  rolePermissions: Array<RolePermission>
}

export interface Pitch {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PitchStatus
  user: User
  userId: ID_Output
  organization: Organization
  organizationId: ID_Output
  createdBy: User
  updatedBy: User
  shortDescription?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Int | null
  presentationComfortLevel?: Int | null
  challenges?: String | null
  pitchDecks: Array<PitchDeck>
  pitchVideos: Array<PitchVideo>
  pitchUserStatuses: Array<PitchUserStatus>
  updates: Array<PitchUpdate>
  comments: Array<PitchComment>
  course?: Course | null
  female: Boolean
  minority: Boolean
  views: Int
  bookmarks: Int
  watchStatus?: String | null
  listStatus?: String | null
  activePitchDeck?: PitchDeck | null
  latestPitchDeck?: PitchDeck | null
  activePitchVideo?: PitchVideo | null
  extendedPitchVideo?: PitchVideo | null
}

export interface PitchComment {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  body: String
  pitch: Pitch
  pitchId: ID_Output
  visibility: PitchCommentVisibility
  createdBy: User
}

export interface PitchDeck {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PitchDeckStatus
  draft: Boolean
  isCategorized: Boolean
  numPages: Int
  pitchId: ID_Output
  file: File
  fileId: ID_Output
  pitch: Pitch
}

export interface PitchMeetingFeedback {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PitchMeetingFeedbackStatus
  pitch: Pitch
  pitchId: ID_Output
  recordingFile?: File | null
  recordingFileId?: ID_Output | null
  reviewerNotes?: String | null
  courseProduct: CourseProduct
  courseProductId: String
  reviewer?: User | null
  reviewerId?: ID_Output | null
}

export interface PitchUpdate {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  body: String
  pitch: Pitch
  pitchId: ID_Output
  createdBy: User
}

export interface PitchUserStatus {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  user: User
  userId: ID_Output
  pitch: Pitch
  pitchId: ID_Output
  watchStatus: PitchWatchStatus
  listStatus: PitchListStatus
}

export interface PitchUserStatusUpsertResult {
  data: PitchUserStatus
  action: UpsertAction
}

export interface PitchVideo {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PitchVideoStatus
  extendedVideo: Boolean
  pitchId: ID_Output
  video: Video
  videoId: ID_Output
  pitch: Pitch
}

export interface PitchWrittenFeedback {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: PitchWrittenFeedbackStatus
  pitch: Pitch
  pitchId: ID_Output
  originalPitchDeck?: PitchDeck | null
  originalPitchDeckId?: ID_Output | null
  reviewedPitchDeck?: PitchDeck | null
  reviewedPitchDeckId?: ID_Output | null
  reviewerNotes?: String | null
  courseProduct: CourseProduct
  courseProductId: String
  reviewer?: User | null
  reviewerId?: ID_Output | null
}

export interface Plan {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  stripePlanId: String
  stripePlanName: String
  stripePlanDescription: String
  stripePlanCurrency: String
  stripePlanPrice: Float
  stripePlanPeriod: String
  stripePlanSubscriptionId: String
  status?: PaymentStatus | null
  user: User
  userId: ID_Output
}

export interface PresentationStatus {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Product {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  description: String
  courseDefinitionProducts?: Array<CourseDefinitionProduct> | null
  courseProducts: Array<CourseProduct>
}

export interface Pronoun {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface ReportResult {
  result: String
}

export interface Revenue {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface Role {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  name: String
  code: String
  rolePermissions: Role
}

export interface RolePermission {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  permission: Permission
  permissionId: ID_Output
  role: Role
  roleId: ID_Output
}

export interface Session {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  userId: ID_Output
  expires: DateTime
  sessionToken: String
  accessToken: String
}

export interface SexualOrientation {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface SlackCommunityChannelHistoryResponse {
  messages: Array<SlackMessage>
}

export interface SlackMessage {
  text: String
  html: String
  ts: String
}

export interface StandardDeleteResponse {
  id: ID_Output
}

export interface Startup {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  user: User
  userId: String
  name?: String | null
  website?: String | null
  corporateStructure?: String | null
  country?: String | null
  stateProvince?: String | null
  fundraiseStatus?: String | null
  companyStage?: String | null
  revenue?: String | null
  industries: Array<String>
  shortDescription?: String | null
  tinyDescription?: String | null
  originStory?: String | null
  presentationStatus?: String | null
  deckComfortLevel?: Int | null
  presentationComfortLevel?: Int | null
  businessChallenge?: String | null
  desiredSupport?: String | null
  anythingElse?: String | null
  additionalTeamMembers?: Boolean | null
  organization: Organization
  organizationId: String
}

export interface StateProvince {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface StripeWebhookEvent {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: StripeWebhookEventStatus
  type: String
  raw: JSONObject
}

export interface SuggestedResource {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  companyName: String
  suggestedResourceCategory: SuggestedResourceCategory
  suggestedResourceCategoryId: ID_Output
  url: String
  description?: String
  logoFile: File
  logoFileId: ID_Output
}

export interface SuggestedResourceCategory {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  suggestedResources: Array<SuggestedResource>
}

export interface Transgender {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

export interface User {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: UserStatus
  name: String
  email: String
  emailVerified?: DateTime | null
  profilePictureFile: File
  profilePictureFileId: ID_Output
  stripeUserId?: String | null
  isAccredited?: Boolean | null
  migratedFromBubble?: Boolean | null
  pitches?: Array<Pitch> | null
  capabilities: Array<String>
  investorProfile: InvestorProfile
  founderProfile: FounderProfile
  lastLoginAt?: DateTime | null
  firstName?: String | null
  organizations: Array<Organization>
  plans: Array<Plan>
}

export interface UserActivity {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  eventType: String
  createdBy: User
}

export interface UserInvite {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  status: UserInviteStatus
  email: String
  userType: String
  expiresAt?: DateTime | null
}

export interface UserLoginResponse {
  id: ID_Output
  token: String
}

export interface UserPlanRegistration {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  email: String
  fullName: String
  stripeSubscriptionId: String
  stripePlanId: String
  userType: String
  raw: JSONObject
  status: UserPlanRegistrationStatus
  user: User
  userId: ID_Output
}

export interface UserRole {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  userId: ID_Output
  role: Role
  roleId: ID_Output
  organization?: String | null
}

export interface UserSafe {
  id: String
  name: String
  firstName: String
  profilePictureFile: File
}

export interface UserType {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  type: String
  defaultRoleId: ID_Output
  allowedAtRegistration: Boolean
}

export interface VerificationRequest {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  identifier: String
  token: String
  expires: DateTime
}

export interface Video {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  file: File
  fileId: ID_Output
  wistiaId: String
  wistiaUrl: String
}

export interface WistiaIframe {
  url: String
}

export interface WistiaStats {
  load_count: Float
  play_count: Float
  play_rate: Float
  hours_watched: Float
  engagement: Float
  visitors: Float
}

export interface WorkingStatus {
  id: ID_Output
  description: String
  archived: Boolean
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
*/

    export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

    export type JsonPrimitive = string | number | boolean | null | {};
    
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface JsonArray extends Array<JsonValue> {}
    
    export type JsonObject = { [member: string]: JsonValue };

    export type JSONObject = JsonObject;
  

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string
