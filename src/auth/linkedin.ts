export const getLinkedInEmail = async (accessToken: string) => {
  try {
    const url = `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=${accessToken}`
    // console.log(`url`, url)

    return fetch(url)
      .then((res) => res.json())
      .then((response: any) => {
        // console.log(`getLinkedInEmail`, response)
        const email = response?.elements?.[0]?.['handle~']?.emailAddress
        // console.log(`email`, email)
        return email
      })
      .catch(() => null)
  } catch (e) {
    return null
  }
}

export const getLinkedInPhoto = async (accessToken: string) => {
  try {
    const url = `https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))&oauth2_access_token=${accessToken}`
    // console.log(`url`, url)

    return fetch(url)
      .then((res) => res.json())
      .then((response: any) => {
        // console.log(`getLinkedInPhoto`, response)
        const photo = response?.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier ?? ''
        // console.log(`photo`, photo)
        // const photo = response?.profilePicture?.['displayImage~'] ?? ''
        // console.log(`photo`, photo)
        return photo
      })
      .catch(() => null)
  } catch (e) {
    return null
  }
}
