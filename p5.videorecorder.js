p5.VideoRecorder = class {
  #blob;
  #chunks;
  #mimeType;
  #recorder;
  #src;
  #url;
  onFileReady;

  constructor(src, format = "webm") {
    if (src == undefined)
      throw "Missing required argument 'src' from VideoRecorder constructor.";
    this.format = format;
    this.src = src;
    this.erase();
    this.#recorder.onstop = () => this.#createBlob();
    this.#recorder.ondataavailable = (e) => this.#chunks.push(e.data);
  }
  get src() {
    return this.#src;
  }
  set src(src) {
    const stream = Array.isArray(src)
      ? this.#srcArrayToStream(src)
      : this.#srcToStream(src);
    this.#src = src;
    this.#createRecorder(stream);
  }
  set format(format) {
    if (p5.VideoRecorder.isFormatSupported(format) == false)
      throw `Video format ${format} not supported`;
    if (this.recording)
      throw "Can't set format while video recorder is recording";
    this.#mimeType = `video/${format}`;
    if (this.#recorder !== undefined)
      this.#createRecorder(this.#recorder.stream);
  }
  get recording() {
    if (this.#recorder === undefined) return false;
    return this.#recorder.state === "recording";
  }
  get url() {
    return this.#url;
  }
  erase() {
    if (this.recording)
      throw "erase() was called while the video recorder was recording. Call stop() before erasing.";
    this.#chunks = [];
  }
  #createBlob() {
    this.#blob = new Blob(this.#chunks, { type: this.#recorder.mimeType });
    this.#url = URL.createObjectURL(this.#blob);
    if (typeof this.onFileReady === "function") this.onFileReady();
  }
  #createRecorder(stream) {
    this.#recorder = new MediaRecorder(stream, { mimeType: this.#mimeType });
  }
  #mediaElementToStream(mediaElement) {
    if (typeof mediaElement.captureStream !== "function")
      throw `Can't capture stream from src ${mediaElement}`;
    return mediaElement.captureStream();
  }
  #srcArrayToStream(srcArray) {
    const tracks = srcArray.map((s) => this.#srcToStream(s).getTracks()).flat();
    return new MediaStream(tracks);
  }
  #srcToStream(src) {
    if (src instanceof HTMLMediaElement) return this.#mediaElementToStream(src);
    if (src instanceof p5.Element) return this.#mediaElementToStream(src.elt);
    throw "src is not of type p5.Element, p5.MediaElement, or HTMLMediaElement";
  }
  save(filename) {
    if (this.#blob === undefined)
      throw "save() was called before a video file was created.\
      Use onFileReady event to call a function when the video file is ready.";
    let extension = this.#mimeType.split("/")[1];
    [filename, extension] = p5.prototype._checkFileExtension(
      filename,
      extension
    );
    p5.prototype.downloadFile(this.#blob, filename, extension);
  }
  start() {
    this.#recorder.start();
  }
  static isFormatSupported(format) {
    return MediaRecorder.isTypeSupported(`video/${format}`);
  }
  stop() {
    if (!this.recording)
      throw "stop() was called while the video recorder was not recording. Call start() before stopping.";
    this.#recorder.stop();
  }
};
