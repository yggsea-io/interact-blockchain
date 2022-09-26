-To get credentials.json. Please click 'Create Credentials' and then click 'Oauth client ID' at https://console.cloud.google.com/apis/credentials?project=atomic-lens-363304

- To get refesh token. please do the following steps:
    1: ennable Gmail API at https://console.cloud.google.com/marketplace/product/google/gmail.googleapis.com?q=search&referrer=search&project=atomic-lens-363304
    2: Run getCode() function at common/gmail/auth.js then access link at terminal. And then 
then two-step authentication. code will appear at link is accessed. PLease decode html with code is getted
    3: Run getRefreshToken() function at common/gmail/auth.js with param is code getted at step 2: