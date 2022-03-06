let videoRecorder;
let music;

function preload() {
  music = loadSound("../../assets/beat.mp3");
}

function setup() {
  createCanvas(400, 400);
  videoRecorder = new p5.VideoRecorder();
  colorMode(HSB);
  noLoop();
}

function draw() {
  background(frameCount, 100, 100);
  if (frameCount === 360) {
    videoRecorder.stop();
  }
}

function mousePressed() {
  music.play();
  videoRecorder.onFileReady = showAndSaveVideo;
  videoRecorder.start();
  loop();
}

function showAndSaveVideo() {
  music.pause();
  const videoURL = videoRecorder.url;
  const vid = createVideo(videoURL);
  vid.showControls();
  videoRecorder.save("myVideo");
}
