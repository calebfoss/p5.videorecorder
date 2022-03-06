/* 
p5.video recorder
https://github.com/calebfoss/p5.videorecorder
-------------------
Example - Simple Canvas

Record a canvas animation, then display and download
the recorded video
*/

//  Declare variable to store VideoRecorder object
let videoRecorder;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  noLoop();
  
  //  Create a new VideoRecorder instance
  //    defaults to recording the canvas
  videoRecorder = new p5.VideoRecorder();
  //  Set callback for when recording is completed
  //    and video file has been created
  videoRecorder.onFileReady = showAndSaveVideo;
}

function draw() {
  background(frameCount, 100, 100);
  //  If 360 frames have passed
  if (frameCount === 360) {
    //  Stop recording
    videoRecorder.stop();
  } else if(frameCount === 1) {
    fill(0);
    rect(100, 100, 200, 200, 20);
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Click to start recording!", 120, 120, 160, 160);
  }
}

function showAndSaveVideo() {
  //  Get url of recorded video
  let videoURL = videoRecorder.url;
  //  Create video player element with recording as source
  let vid = createVideo(videoURL);
  vid.showControls();
  //  Download the recording
  videoRecorder.save("myVideo");
}

function mousePressed() {
  //  Start recording
  videoRecorder.start();
  loop();
}
