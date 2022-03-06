/* [p5.videorecorder] Version - 0.2 - 03-06-2022
https://github.com/calebfoss/p5.videorecorder */

p5.VideoRecorder = class {
  #blob;
  #chunks;
  #mimeType;
  #recorder;
  #stream;
  #url;
  #onFileReady;

  constructor(input, format = "webm") {
    this.format = format;
    this.input = input;
  }
  get blob() {
    return this.#blob;
  }
  get stream() {
    return this.#stream;
  }
  set input(input) {
    if (this.#stream !== undefined && this.#stream === input) return;
    if (this.recording)
      throw "VideoRecorder input was assigned a new value while recording. \
      Call stop() before changine the input";
    if (input === undefined) {
      if (typeof drawingContext?.canvas === "undefined")
        throw "VideoRecorder couldn't find canvas to record";
      this.addInput(drawingContext.canvas);
      if (typeof soundOut !== "undefined" && soundOut.output !== undefined)
        this.addInput(soundOut.output);

      return;
    }
    const stream = Array.isArray(input)
      ? this.#inputArrayToStream(input)
      : this.#inputToStream(input);
    this.#stream = stream;
    this.#createRecorder();
  }
  get format() {
    return this.#recorder.mimeType;
  }
  set format(format) {
    if (p5.VideoRecorder.isSupported(format) == false)
      throw `Video format ${format} not supported`;
    if (this.recording)
      throw "Can't set format while video recorder is recording";
    this.#mimeType = format.split("/").length > 1 ? format : `video/${format}`;
    if (this.#stream !== undefined) this.#createRecorder();
  }
  get onFileReady() {
    return this.#onFileReady;
  }
  set onFileReady(callback) {
    if (typeof callback !== "function")
      throw `VideoRecorder onFileReady must be of type function but was assigned to ${typeof callback}`;
    this.#onFileReady = callback;
  }
  get recording() {
    if (this.#recorder === undefined) return false;
    return this.#recorder.state === "recording";
  }
  get url() {
    return this.#url;
  }
  addInput(input) {
    if (this.#stream === undefined) {
      this.input = input;
      return;
    }
    this.#inputToStream(input)
      .getTracks()
      .forEach((track) => this.#stream.addTrack(track));
    this.#createRecorder();
  }
  #audioNodeToStream(input) {
    const { context } = input;
    const destination = context.createMediaStreamDestination();
    input.connect(destination);
    return destination.stream;
  }
  erase() {
    if (this.recording)
      throw "erase() was called while the video recorder was recording. Call stop() before erasing.";
    this.#chunks = [];
  }
  #createBlob() {
    this.#blob = new Blob(this.#chunks, { type: this.#recorder.mimeType });
    this.#url = URL.createObjectURL(this.#blob);
    if (typeof this.#onFileReady === "function") this.#onFileReady();
  }
  #createRecorder() {
    this.#recorder = new MediaRecorder(this.#stream, {
      mimeType: this.#mimeType,
    });
    this.#recorder.onstop = () => this.#createBlob();
    this.#recorder.ondataavailable = (e) => this.#chunks.push(e.data);
  }
  #inputArrayToStream(inputArray) {
    inputArray.forEach((input) => this.addInput(input));
    return this.#stream;
  }
  #inputToStream(input) {
    if (input instanceof MediaStream) return input;
    if (input instanceof AudioNode) return this.#audioNodeToStream(input);
    if (typeof input.captureStream === "function")
      return this.#mediaElementToStream(input);
    if (input instanceof p5.Element)
      return this.#mediaElementToStream(input.elt);
    throw "VideoRecorder input is does not contain an element with a media stream that can be captured";
  }
  #mediaElementToStream(mediaElement) {
    if (typeof mediaElement.captureStream !== "function")
      throw `Can't capture stream from input ${mediaElement}`;
    return mediaElement.captureStream();
  }
  pause() {
    this.#recorder.pause();
  }
  resume() {
    this.#recorder.resume();
  }
  save(filename) {
    if (this.#blob === undefined)
      throw "save() was called before a video file was created.\
      Use onFileReady event to call a function when the video file is ready.";
    let extension = this.#mimeType.match(/\/([^;]*)/)?.[1];
    [filename, extension] = p5.prototype._checkFileExtension(
      filename,
      extension
    );
    p5.prototype.downloadFile(this.#blob, filename, extension);
  }
  start() {
    this.erase();
    this.#recorder.start();
  }
  isSupported(format) {
    return p5.VideoRecorder.isSupported(format);
  }
  static isSupported(format) {
    return MediaRecorder.isTypeSupported(
      format.split("/").length > 1 ? format : `video/${format}`
    );
  }
  stop() {
    if (!this.recording)
      throw "stop() was called while the video recorder was not recording. Call start() before stopping.";
    this.#recorder.stop();
  }
};
