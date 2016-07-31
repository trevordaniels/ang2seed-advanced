# Speech API


**Apikey:** ``faee996b1c3f4e85aca06fbfcd32864b``

Check keys [here](https://www.microsoft.com/cognitive-services/en-us/subscriptions)

Full API doc [here](https://www.microsoft.com/cognitive-services/en-us/speech-api/documentation/api-reference-rest/bingvoicerecognition)

## How to use

### Obtain token

```json
POST https://oxford-speech.cloudapp.net/token/issueToken
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=<Your subscription key>&
client_secret=<Your subscription key>&scope=https%3A%2F%2Fspeech.platform.bing.com

// returns

{
   "access_token":`<Base64-access_token>`,
   "token_type":"jwt",
   "expires_in":"600",
   "scope":"https://speech.platform.bing.com"
}
```

## Request

Call endpoint [https://speech.platform.bing.com/recognize](https://speech.platform.bing.com/recognize)

with HTTP header
```
Authorization: Bearer [Base64 access_token]
```