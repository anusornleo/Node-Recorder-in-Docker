# Node-Recorder-in-Docker

## run in dev mode
```sh
$ docker-compose up --build
```
New Tab Terminal
```sh
$ docker exec -it recorder-live sh // get to recoder container
$ cd record
$ ./build.sh     // rebuild every time you build because I edit some config in agora_node_recording.cpp
```
New Tab Terminal agian
```sh
$ docker-compose exec recorder sh -c "npm install && node app.js"
```


## run in production mode (https)
```sh
$ docker-compose -f docker-compose.prod.yml up --build
```
New Tab Terminal
```sh
$ docker exec -it recorder-live sh // get to recoder container
$ cd record
$ ./build.sh     // rebuild every time you build because I edit some config in agora_node_recording.cpp
```
New Tab Terminal agian
```sh
$ docker-compose exec recorder sh -c "npm install && node app.js"
```
