/* 
p5.video recorder
https://github.com/calebfoss/p5.videorecorder
-------------------
Example - Webcam

Record video and audio from webcam
Then display and download the recorded video
*/

//  Declare variable to store VideoRecorder object
let videoRecorder;
let capture;
let recordButton, pauseButton, resumeButton, playButton, stopButton, downloadButton;
let videoPlayback;

function setup() {
  createCanvas(400, 400);
  
  //  Create a webcam capture with video and audio
  //  When the stream is ready, setup the buttons
  capture = createCapture({ video: true, audio: true }, setupButtons);
  //  Mute webcam audio to prevent feedback
  capture.volume(0);
  //  Hide capture element (because it will be displayed on canvas instead)
  capture.hide();
  
  //  Create a new VideoRecorder instance
  //    with webcam capture as input
  videoRecorder = new p5.VideoRecorder(capture);
  //  Set callback for when recording is completed
  //    and video file has been created
  videoRecorder.onFileReady = showPlayback;
}

function draw() {
  //  If playing back the recording
  if (videoPlayback && videoPlayback.time() > 0) {
    //  Display video playback
    image(videoPlayback, 0, 0, width, height);
  } else {
    //  Otherwise display webcam
    image(capture, 0, 0, width, height);
    //  If recording
    if (videoRecorder.recording) {
      //  Display a red circle indicator
      noStroke();
      fill(200, 40, 20);
      circle(width - 50, 50, 50);
    }
  }
}

//  Create buttons and hide all except record
function setupButtons() {
  playButton = createButton("Play");
  playButton.hide();
  recordButton = createButton("Record");
  recordButton.mousePressed(startRecording);
  pauseButton = createButton("Pause");
  pauseButton.hide();
  resumeButton = createButton("Resume");
  resumeButton.hide();
  stopButton = createButton("Stop");
  stopButton.hide();
  downloadButton = createButton("Download");
  downloadButton.hide();
}


function startRecording() {
  //  Set buttons to manage recording
  //    and show hidden buttons
  pauseButton.mousePressed(() => videoRecorder.pause());
  pauseButton.show();
  resumeButton.mousePressed(() => videoRecorder.resume());
  resumeButton.show();
  stopButton.mousePressed(() => videoRecorder.stop());
  stopButton.show();
  //  Start recording
  videoRecorder.start();
}

function showPlayback() {
  //  Create video element to display recording
  videoPlayback = createVideo(videoRecorder.url);
  //  Hide video element (because it will be displayed on canvas instead)
  videoPlayback.hide();
  
  //  Set buttons to manage playback
  playButton.mousePressed(() => videoPlayback.play());
  playButton.show();
  pauseButton.mousePressed(() => videoPlayback.pause());
  resumeButton.mousePressed(() => videoPlayback.play());
  stopButton.mousePressed(() => videoPlayback.stop());
  downloadButton.mousePressed(() => videoRecorder.save("webcam"));
  downloadButton.show();
}
