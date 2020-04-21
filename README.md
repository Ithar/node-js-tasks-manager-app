# node-js-tasks-app
Tasks taking app with MongoDB.

#### Features 
- Uses `mongodb` as the backend database
- Uses `moongoose` framework for entity modeling & validation
- Uses pre save hooks to hash passwords using `bcryptjs`
- Uses JWT token for authentication 
- Pagination/Sorting  

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

## Application Run

cd node-js-tasks-manager-app

Set-ExecutionPolicy -Scope Process RemoteSigned

npm run dev

## Application URL

[[ Local ]]

http://localhost:3000 

## Application GIT

heroku create node-js-tasks-app-v01

git push heroku master

## Further enhancements 