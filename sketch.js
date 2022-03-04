let videoRecorder;
let cvs;
let music;

function setup() {
  cvs = createCanvas(400, 400);
  music = createAudio("./assets/beat.mp3");
  noLoop();
}

function draw() {
  background(frameCount, 100, 100);
  if (frameCount === 360) {
    videoRecorder.stop();
  }
}

function mousePressed() {
  videoRecorder = new p5.VideoRecorder([cvs, music]);
  videoRecorder.onFileReady = showAndSaveVideo;
  videoRecorder.start();
  music.play();
  loop();
}

function showAndSaveVideo() {
  const videoURL = videoRecorder.url;
  const vid = createVideo(videoURL);
  vid.showControls();
  videoRecorder.save("myVideo");
}
