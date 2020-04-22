# node-js-tasks-app
Tasks taking app with MongoDB.

#### Features 
- Heroku hostest API 
- Uses MongoDB compass for DB client
- Uses aws hosted `mongodb` as the backend database hosted via Atlas
- Uses `moongoose` framework for entity modeling & validation
- Uses pre save hooks to hash passwords using `bcryptjs`
- Uses JWT token for authentication 
- Pagination/Sorting  
- File upload + Convert via Sharp
- Send emails via SendGrid
- External environment variables 

#### Docs
http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html

https://mongoosejs.com/docs/

https://www.mongodb.com/products/compass 

## Application Stack

Stack  | version |
--- | --- |  
*nodeJS* | v12.16.1
*npm* | 6.13.4
*Build Tool* | n/a
*CI* | n/a
*Code Coverage* | n/a
*Build env* | Hereku

## NPM Modules (Local)
> npm install chalk

> npm install mongodb

> npm install mongoose

> npm install validator

> npm install password-validator

> npm install express

> npm install nodemon

> npm install jsonwebtoken

> npm intsall sharp

> npm install @sendgrid/mail

> npm i env-cmd --save-dev

## Application Run

cd node-js-tasks-manager-app

Set-ExecutionPolicy -Scope Process RemoteSigned

npm run dev

## Application URL

[[ Local ]]

http://localhost:3000 


[[ Heroku ]]

https://node-js-task-manager-app-v1-0.herokuapp.com

https://git.heroku.com/node-js-task-manager-app-v1-0.git

## Application Heroku

> heroku create node-js-task-manager-app-v1.0

> heroku config:set JWT_SECRET=2TgHgZZkwBU

> heroku config:set SENDGIRD_API_KEY=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

> heroku config:set MONGODB_URL="mongodb+srv://taskmanageradmin:ciNHBEdazQ4hw@cluster0-lkosj.mongodb.net/task-manager?retryWrites=true"

git push heroku master

## Further enhancements 