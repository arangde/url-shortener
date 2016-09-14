# Task 1.1 Url shortener

- Application should have form with field where user can put valid url (validation should be done by direct call of the provided url and check HTTP response code). 
- Application should generate short url. Example: http://domain.com/cedwdsff. It should be possible to enter desired short url (another field). 
- Application should validate if requested short url is not in use yet. 
- Application should store original and short url pair in DB. User then can share short url with other users and once they try to access short url they should be redirected to original url. 


## Install

    $ meteor update
    
    $ meteor npm install



## Run

    $ npm start


## Config

  It will be run on http://localhost:3000/.
  
  You can manually change domain baseUrl in settings.json at application root path