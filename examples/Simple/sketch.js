let videoRecorder;
let cvs;
let music;

function setup() {
  cvs = createCanvas(400, 400);
  noLoop();
}

function draw() {
  background(frameCount, 100, 100);
  if (frameCount === 360) {
    videoRecorder.stop();
  }
}

function showAndSaveVideo() {
  const videoURL = videoRecorder.url;
  const vid = createVideo(videoURL);
  vid.showControls();
  videoRecorder.save("myVideo");
}

function mousePressed() {
  videoRecorder = new p5.VideoRecorder();
  videoRecorder.onFileReady = showAndSaveVideo;
  videoRecorder.start();
  loop();
}
