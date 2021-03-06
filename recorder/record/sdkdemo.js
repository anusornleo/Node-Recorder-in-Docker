﻿const AgoraRecordingSDK = require("./AgoraRecordSdk");
const path = require("path");
const fs = require("fs");
const uuidv4 = require('uuid/v4');
function startRecording() {
    const sid = uuidv4();
    let rec = new AgoraRecordingSDK();
    let layout = {
        "canvasWidth": 640,
        "canvasHeight": 480,
        "backgroundColor": "#00ff00",
        "regions": []
    }
    rec.setMixLayout(layout);
    rec.on("joinchannel", function (channel, uid) {
        console.log(`channel joined ${channel} ${uid}`);
    });
    rec.on("error", function (err, stat) {
        console.log(`err ${err} ${stat}`);
    });
    rec.on("recordingStats", function (stats) {
        console.log(`recording stats ${JSON.stringify(stats)}`)
    })
    rec.on("userleave", function (uid) {
        //rearrange layout when user leaves
        console.log(`userleave ${uid}`);
        layout.regions = layout.regions.filter(function (region) {
            return region.uid !== uid
        })
        rec.setMixLayout(layout);
    });
    rec.on("userjoin", function (uid) {
        //rearrange layout when new user joins
        console.log(`userjoin ${uid}`);
        let region = {
            "x": 0,
            "y": 0,
            "width": 640,
            "height": 480,
            "zOrder": 1,
            "alpha": 1,
            "uid": uid
        }
        switch (layout.regions.length) {
            case 0:
                region.x = 0;
                region.y = 0;
                break;
            case 1:
                region.x = 320;
                region.y = 0;
                break;
            case 2:
                region.x = 0;
                region.y = 240;
                break;
            case 3:
                region.x = 320;
                region.y = 240;
            default:
                break;
        }
        layout.regions.push(region)
        rec.setMixLayout(layout);
    });
    let storageDir = path.resolve(__dirname, `../output/${sid}`);

    //create output folder
    fs.mkdir(storageDir, {recursive: true}, err => {
        //join channel
        rec.joinChannel('8c47eae8102b4acbbee3a409e773aa39', "test", 0, "4bdddbacc9f24b2584de36f55a9f75de", storageDir)
            .then();
    })
    console.log("REC:"+rec)
    return rec;
}


let recorder = startRecording();

setTimeout(() => {
    recorder.leaveChannel();
}, 1000 * 60)
// setInterval(() => {
//     //prevent from exiting
// }, 1000 * 30);
