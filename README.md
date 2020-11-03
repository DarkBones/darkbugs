## Table of contents
* [General info](#general-info)
* [Demo](#demo)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This project is a feature / bug tracker. Live version:
[darkbugs.com](https://darkbugs.com) 

## Demo
[demo.darkbugs.com](https://demo.darkbugs.com) (No need to register)
	
## Technologies
Project is created with:
* Ruby version: 2.7.1
* Rails version: 6.0.3
* PostgresSQL version: 12.4
* Yarn version: 1.22.4
* Node version: 12.18.4
	
## Setup
Parts of this project rely on secrets. This is the format used in credentials.yaml:
```yaml
secret_key_base: [automatically generated]

postage_api_key: [get it from postageapp]

azure_storage:
  account_name: [azure account name]
  access_key: [azure access key]
  container: [upload container]

sentry_url: [get it from sentry]
```
It also relies on the following environment variables:
* APP_NAME: The title of the app
* DB_HOST: Host name of the database
* DB_USERNAME: Username of the database
* DB_PASSWORD: Password of the database
* DOMAIN: Domain of the website

To initialize the database:
`rails db:prepare`

To run the app:
`rails server`
