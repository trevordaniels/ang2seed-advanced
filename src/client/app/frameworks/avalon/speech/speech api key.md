# Speech API


**Apikey:** ``faee996b1c3f4e85aca06fbfcd32864b``

Check keys [here](https://www.microsoft.com/cognitive-services/en-us/subscriptions)

Full API doc [here](https://www.microsoft.com/cognitive-services/en-us/speech-api/documentation/api-reference-rest/bingvoicerecognition)

[Web Audio Media Recorder API](https://w3c.github.io/mediacapture-record/MediaRecorder.html#methods)

[Google chrome dev media recorder doco](https://developers.google.com/web/updates/2016/01/mediarecorder?hl=en)

[Another good sample with talk on reducing file size, uploading via xhr](http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/)
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