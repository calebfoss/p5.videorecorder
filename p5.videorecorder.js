/* [p5.videorecorder] Version - 0.2.1 - 03-07-2022
https://github.com/calebfoss/p5.videorecorder */

p5.VideoRecorder = class {
  #blob;
  #chunks;
  #input;
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
  get input() {
    return this.#input;
  }
  set input(input) {
    if (this.#stream !== undefined && this.#stream === input) return;
    if (this.recording)
      return console.error(
        "VideoRecorder input was assigned a new value while recording. \
      Call stop() before changing the input"
      );
    if (input === undefined) {
      if (typeof drawingContext?.canvas === "undefined")
        console.error("VideoRecorder couldn't find canvas to record");
      else this.input = drawingContext.canvas;
      if (typeof soundOut !== "undefined" && soundOut.output !== undefined)
        this.addInput(soundOut.output);
      return;
    }
    const stream = Array.isArray(input)
      ? this.#inputArrayToStream(input)
      : this.#inputToStream(input);
    this.#input = input;
    this.#stream = stream;
    this.#createRecorder();
  }
  get format() {
    return this.#recorder.mimeType;
  }
  set format(format) {
    if (format.charAt(0) === ".") format = format.slice(1);
    if (p5.VideoRecorder.isSupported(format) == false)
      return console.error(
        `Video format ${format} is not supported on this browser`
      );
    if (this.recording)
      return console.error(
        "Can't set format while video recorder is recording"
      );
    this.#mimeType = format.split("/").length > 1 ? format : `video/${format}`;
    if (this.#stream !== undefined) this.#createRecorder();
  }
  get onFileReady() {
    return this.#onFileReady;
  }
  set onFileReady(callback) {
    if (typeof callback !== "function")
      return console.error(
        `VideoRecorder onFileReady must be of type function but was assigned to ${typeof callback}`
      );
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
      return console.error(
        "erase() was called while the video recorder was recording. Call stop() before erasing."
      );
    this.#chunks = [];
  }
  canRecord(input) {
    return p5.VideoRecorder.canRecord(input);
  }
  static canRecord(input) {
    return (
      input instanceof MediaStream ||
      input instanceof AudioNode ||
      typeof input.captureStream === "function" ||
      typeof input.elt?.captureStream === "function"
    );
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
    if (this.canRecord(input) == false)
      return console.error(
        `Selected VideoRecorder input of type ${typeof input} cannot be recorded in this browser`
      );
    if (input instanceof MediaStream) return input;
    if (input instanceof AudioNode) return this.#audioNodeToStream(input);
    if (typeof input.captureStream === "function")
      return this.#mediaElementToStream(input);
    if (input instanceof p5.Element)
      return this.#mediaElementToStream(input.elt);
  }
  isSupported(format) {
    return p5.VideoRecorder.isSupported(format);
  }
  static isSupported(format) {
    if (format.charAt(0) === ".") format = format.slice(1);
    return MediaRecorder.isTypeSupported(
      format.split("/").length > 1 ? format : `video/${format}`
    );
  }
  #mediaElementToStream(mediaElement) {
    if (typeof mediaElement.captureStream !== "function")
      return console.error(`Can't capture stream from input ${mediaElement}`);
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
      return console.error(
        "save() was called before a video file was created.\
      Use onFileReady event to call a function when the video file is ready."
      );
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
  stop() {
    console.assert(
      this.recording,
      "stop() was called while the video recorder was not recording. Call start() before stopping."
    );
    this.#recorder.stop();
  }
};
