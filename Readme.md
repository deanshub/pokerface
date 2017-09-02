# TeachShares

The ultimate social experience for learning, teaching and talking about card games.

## create dev environment
1) create a directory with the name ```pokerface```

2) clone both client and server repos into it:
```
git clone https://gitlab.com/teachshares/teachshares.git
git clone https://gitlab.com/teachshares/server.git
```

3) install dependencies of the client and server using yarn in each directory
```
yarn
```

4) create a directory within ```pokerface``` directory and name it ```database```

5) download and install mongodb

6) start mongodb with the dbpath to the ```database``` directory
```
"c:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath c:\git\pokerface\database
```

7) create the user for the DB,
go into the mongo shell and enter the command
```
db.createUser(
   {
     user: "mongo",
     pwd: "admin",
     roles: [ {role: "readWrite", db: "pokerface"}, {role: "dbAdmin", db: "pokerface"} ]
   }
)
```

8) restart mongodb with the authentication enabled
```
[stop the current running mongod.exe]

"c:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --auth --dbpath c:\git\pokerface\database
```

9) build the client (this can be done only once),
go into the ```client``` directory and run the command
```
yarn build
```

10) start the server
go into the ```server``` directory and run the command
```
yarn start
```
