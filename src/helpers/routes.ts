export const hubPrefix = "hub"

const routes: { [key: string]: Function } = {
  userLogin: () => "/u/login",
  userLogout: () => "/u/logout",
  userRegister: () => "/u/register",
  userAccount: () => "/u/account",
  hubCreate: () => `/hub/create`,
  hubView: (params: { hubId: number; slug: string }) =>
    `/${hubPrefix}/${params.slug}-${params.hubId}`,
  hubLeave: (params: { hubId: number; slug: string }) =>
    `/${hubPrefix}/${params.slug}-${params.hubId}/leave`,
  hubRSS: (params: { hubId: number; slug: string }) =>
    `/${hubPrefix}/${params.slug}-${params.hubId}/rss`,
  hubMembers: (params: { hubId: number; slug: string }) =>
    `/${hubPrefix}/${params.slug}-${params.hubId}/members`,
  topicCreate: (params: { hubId: number; slug: string }) =>
    `/${hubPrefix}/${params.slug}-${params.hubId}/new`,
  topicView: (params: {
    hubId: number
    hubSlug: string
    topicId: number
    topicSlug: string
  }) =>
    `/${hubPrefix}/${params.hubSlug}-${params.hubId}/${params.topicSlug}-${params.topicId}`,
}

export default routes
