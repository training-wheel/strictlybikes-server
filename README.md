# strictlybikes-server
Server-side code for Strictly Bikes

Strictly Bikes stores user data for the purposes of keeping track of goals and past routes of customers. In addition, we keep track of the geolocation of markers put on our maps, such as warnings of traffic, accidents, or other road hazards within our server's PostgreSQL database.

# Setting up the database

Install PostgreSQL

Create the database
`createdb strictly-bikes`
Set environmental variables to include the database name, host, password and user
`DB_NAME="strictly-bikes"`
`DB_PASSWORD="password"`
`DB_HOST="hostname`_
`DB_USER="me"`

Starting the server will create the proper tables in the database.

# To run the server, you can start one of two ways:

  Be sure to use `npm install` before running the server to ensure all dependencies are up to date.

  > Major dependencies

1) Host the server via ngrok. 
```ngrok http localhost:3000```
  In doing so, you must ensure that the temporary urls you receive back from ngrok are referenced in specific places in your client files so that the Google AuthO2
  and app routing will function properly.
  Place the HTTPS address given back into a `.env` file in the client workspace root labeled as "WEB_CALLBACK_URL" and an endpoint of "/auth/google/callback".



2) Use npm run on the index.js file. This allows for only local connections and isn't as practical as the first option outside of testing that the server can run.