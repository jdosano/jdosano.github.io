import { UnifiedConsentByOsanoSDK, Subject, ActionType  } from '@unifiedconsentbyosano/cmp-javascript-sdk'

const accessToken = await UnifiedConsentByOsanoSDK.getToken(
  {
    /** URL of authorization services provider */
    issuer: 'https://auth.example.com/oauth2',
    /** The  config Id */
    configId: '3959b4a3-c790-4770-8fcb-49b9e4593e1f',
    /** The Client Id */
    customerId: 'AzqNP2SmsdJWV8LFR'
  },
)



const client = UnifiedConsentByOsanoSDK.createClient({
  token: accessToken,
  apiUrl: 'https://uc.api.osano.com',
})

// Example with anonymous Subject
await client.createConsent({
  tags: ['marvel', 'movies'],
  actions: [{ target: 'navigation-system', vendor: 'general-vendor', action: ActionType.Accept }]
  attributes: [{platform: 'Linux x86_64'}],
  subject: Subject.verified('a-unique-id-of-this-subject')
})
