type AuthV2AndRedirectProps = {
  appV2BaseUrl: string
  token: string
  redirectSlug: string
}

type TCreateAndSubmitForm = {
  method?: 'POST' | 'GET'
  action: string
  formData: Record<string, any>
}

const createAndSubmitForm = ({ method = 'POST', action, formData }: TCreateAndSubmitForm) => {
  const form = document.createElement('form')
  form.method = method
  form.action = action
  Object.keys(formData).forEach((key) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = formData[key]
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}

export function authV2AndRedirect({ appV2BaseUrl, token, redirectSlug }: AuthV2AndRedirectProps) {
  createAndSubmitForm({
    action: `${appV2BaseUrl}/api/auth/v1?returnTo=${appV2BaseUrl}${redirectSlug}`,
    formData: {
      token,
    },
  })
}
