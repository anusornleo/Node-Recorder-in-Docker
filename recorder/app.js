const express = require('express')
const app = express()
const port = 4000
const RecordManager = require('./recordManager')
const bodyParser = require('body-parser')
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
let cors = require('cors')
const AgoraRecordingSDK = require("./record/AgoraRecordSdk");
const path = require("path");
const uuidv4 = require('uuid/v4');
let recorders = {};
var { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

app.use(bodyParser.json());

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions))

// app.use("/video", express.static('output'));
app.use("/recorder/video", express.static('output'));

app.get('/recorder/', (req, res) => {
    res.send("ok")
})

// app.get('/recorder/decode', (req, res) => {
//     ffmpeg.setFfmpegPath(ffmpegInstaller.path);
//
//     ffmpeg('videos/video.mp4', { timeout: 432000 }).addOptions([
//         '-profile:v baseline',
//         '-level 3.0',
//         '-start_number 0',
//         '-hls_time 10',
//         '-hls_list_size 0',
//         '-f hls'
//     ]).output('videos/output.m3u8').on('end', () => {
//         console.log('end');
//     }).run();
// })

app.post('/recorder/start', (req, res, next) => {
    let {body} = req;
    let {appid, channel, key, width, height} = body;
    if (!appid) {
        res.status(401).json("appid is mandatory")
    }
    if (!channel) {
        res.status(401).json("channel is mandatory")
    }

    RecordManager.start(key, appid, channel, width, height).then(recorder => {
        //start recorder success
        res.status(200).json({
            success: true,
            sid: recorder.sid
        });
    }).catch((e) => {
        //start recorder failed
        next(e);
    });

    // const output = path.resolve(__dirname, "./output");
    // if (!fs.existsSync(output)){
    //     fs.mkdirSync(output);
    // }
    //
    // function startRecording() {
    //     let rec = new AgoraRecordingSDK();
    //     const sid = uuidv4();
    //     let recorder = {
    //         sid:sid,
    //         sdk:rec
    //     }
    //     let layout = {
    //         "canvasWidth": width,
    //         "canvasHeight": height,
    //         "backgroundColor": "#000000",
    //         "regions": []
    //     }
    //     rec.setMixLayout(layout);
    //     rec.on("joinchannel", function (channel, uid) {
    //         console.log(`channel joined ${channel} ${uid}`);
    //     });
    //     rec.on("error", function (err, stat) {
    //         console.log(`err ${err} ${stat}`);
    //     });
    //     rec.on("recordingStats", function (stats) {
    //         console.log(`recording stats ${JSON.stringify(stats)}`)
    //     })
    //     rec.on("userleave", function (uid) {
    //         //rearrange layout when user leaves
    //         console.log(`userleave ${uid}`);
    //         layout.regions = layout.regions.filter(function (region) {
    //             return region.uid !== uid
    //         })
    //         rec.setMixLayout(layout);
    //     });
    //     rec.on("userjoin", function (uid) {
    //         //rearrange layout when new user joins
    //         console.log(`userjoin ${uid}`);
    //         let region = {
    //             "x": 0,
    //             "y": 0,
    //             "width": width,
    //             "height": height,
    //             "zOrder": 1,
    //             "alpha": 1,
    //             "uid": uid
    //         }
    //         switch (layout.regions.length) {
    //             case 0:
    //                 region.x = 0;
    //                 region.y = 0;
    //                 break;
    //             case 1:
    //                 region.x = 320;
    //                 region.y = 0;
    //                 break;
    //             case 2:
    //                 region.x = 0;
    //                 region.y = 240;
    //                 break;
    //             case 3:
    //                 region.x = 320;
    //                 region.y = 240;
    //             default:
    //                 break;
    //         }
    //         layout.regions.push(region)
    //         rec.setMixLayout(layout);
    //     });
    //     let storageDir = path.resolve(__dirname, `./output/${sid}`);
    //
    //     //create output folder
    //     fs.mkdir(storageDir, { recursive: true }, err => {
    //         //join channel
    //         rec.joinChannel(tokenKey, channel, 0, appid, storageDir).then(()=>{
    //             recorders[sid] = recorder;
    //                 res.status(200).json({
    //                     success: true,
    //                     sid: "recorder.sid"
    //                 });
    //         });
    //     })
    //     return rec;
    // }
    //
    //
    // let recorder = startRecording();
    //
    //
    //
    // setTimeout(() => {
    //     recorder.leaveChannel();
    // }, 1000 * 180)
})

app.post('/recorder/get-url', (req, res) => {
    // let {body} = req;
    // let {sid} = body;
    // if (!sid) {
    //     res.status(401).json("sid is mandatory")
    // }
    //
    // const folder = `./output/${sid}`;
    //
    // fs.readdir(folder, (err, files) => {
    //     files.forEach(file => {
    //         if (file.substr(file.length - 3) === 'mp4') {
    //             console.log("get url");
    //             res.status(200).json({
    //                 success: true,
    //                 file:file,
    //                 path: `/recorder/video/${sid}/${file}`,
    //                 url:`${req.protocol}://${req.headers.host}/recorder/video/${sid}/${file}`
    //             });
    //         }
    //
    //     });
    // });

    res.status(200).json({
        success: true,
        file:"file",
        path: "/recorder/video/${sid}/${file}",
        url:"${req.protocol}://${req.headers.host}/recorder/video/${sid}/${file}"
    });
})

app.post('/recorder/stop', (req, res, next) => {
    let {body} = req;
    let {sid} = body;
    if (!sid) {
        res.status(401).json("sid is mandatory")
    }

    RecordManager.stop(sid);

    let folder = `./output/${sid}`;

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            if (file.substr(file.length - 3) === 'mp4') {
                console.log("stop record");
                res.status(200).json({
                    success: true,
                    path: `/recorder/video/${sid}/${file}`
                });
            }

        });
    });

    // res.status(200).json({
    //     success: true
    // });
})

// app.get('/recorder/get-token',(req,resp)=>{
//     let appID = "4bdddbacc9f24b2584de36f55a9f75de";
//     var appCertificate = "8c47eae8102b4acbbee3a409e773aa39";
//     var expirationTimeInSeconds = 3600
//     var role = RtcRole.PUBLISHER
//
//     var currentTimestamp = Math.floor(Date.now() / 1000)
//     var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
//     var channelName = req.query.channelName;
//     // use 0 if uid is not specified
//     var uid = req.query.uid || 0
//     if (!channelName) {
//         return resp.status(400).json({ 'error': 'channel name is required' }).send();
//     }
//
//
//     var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
//
//     // resp.header("Access-Control-Allow-Origin", "*")
//     //resp.header("Access-Control-Allow-Origin", "http://ip:port")
//     // return resp.json({ 'key': key }).send();
//     resp.status(200).json({key:key})
// })

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        err: err.message || 'generic error'
    })
})

app.listen(port, () => {
    console.log(port)
})
