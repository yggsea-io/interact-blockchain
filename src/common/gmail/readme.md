Get refesh token and access token. Please follow these steps:
    - step 1: Enable gmail api at : https://console.cloud.google.com/marketplace/product/google/gmail.googleapis.com?q=search&referrer=search&project=atomic-lens-363304

    - step 2: 'Create credentials'/'Oauth client id' at https://console.cloud.google.com/apis/credentials?project=atomic-lens-363304 and set Authorized redirect URIs: is https://developers.google.com/oauthplayground
    
    - step 3: At https://developers.google.com/oauthplayground, setting OAuth Client ID, OAuth Client secret and enter api at 'input your own scopes' is https://mail.google.com. Then click 'Authorize Api'. Then click 'Exchange authorization code for token' 