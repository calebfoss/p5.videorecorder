# p5.videorecorder

p5.videorecorder is a [p5js](https://p5js.org) library for recording video from sketches using the [MediaRecorder api](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder). The library adds a p5.VideoRecorder class.

## Getting Started

Download the latest release from the [releases page](https://github.com/calebfoss/p5.videorecorder/releases).

Put p5.videorecorder.js in the same directory as your sketch. If using the [web editor](https://editor.p5js.org), you will need to [upload the file](https://thecodingtrain.com/beginners/p5js/6.4-files-web-editor.html).

Add p5.videorecorder.js to your sketch's index.html file in a script tag:

```
<!doctype html>
<html>
<head>
  <script src="p5.js"></script>
  <script src="p5.sound.js"></script>
  <script src="p5.videorecorder.js></script>
  <script src="sketch.js"></script>
</head>
<body>
</body>
</html>

```

Create a new instance of the the p5.VideoRecorder class in your sketch.js file.
```
let videoRecorder;

function setup() {
  createCanvas(400, 400);
  videoRecorder = new p5.VideoRecorder();
}
```
See [Examples](https://github.com/calebfoss/p5.videorecorder#examples) and [Reference](https://github.com/calebfoss/p5.videorecorder#reference) for usage.

## Examples

- [simple canvas](https://editor.p5js.org/cfoss/sketches/t6H_m8AeR)
- [canvas with sound](https://editor.p5js.org/cfoss/sketches/yYxZHMcI1)
- [webcam](https://editor.p5js.org/cfoss/sketches/5SSZyFsEN)

## Reference

### p5.VideoRecorder

#### Description

Class for recording video from the sketch. If no arguments are passed into the constructor, the VideoRecorder instance will default to record the canvas as well as all [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) audio output (if [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) library has been loaded).

The recorded video file may not be available immediately after the stop() method is called. Set the onFileReady callback to call a function when the recorder has finished creating the video file.

Ability to record inputs may vary based on the browser. Recording the canvas is supported by most contemporary browsers (see [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream#browser_compatibility)), but recording media elements currently has limited support (see [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream#browser_compatibility)).

#### Syntax

`new p5.VideoRecorder([input], [format])`

#### Parameters

| name   | type: description                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| input  | p5.Element\|AudioNode\|Array: element, node, or array of elements/nodes to record (Optional)                                                                                                   |
| format | String: [mimeType](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) or extension to be used for recording (Optional) |

#### Properties

| name        | description                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blob        | video file available after recording is completed (Read-only)                                                                                           |
| format      | [mimeType](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) or extension to be used for recording (Write-only) |
| input       | element, node, or array of elments/nodes to record (Write-only)                                                                                                                  |
| onFileReady | callback called after recording is completed and blob is created                                                                                        |
| stream      | MediaStream for selected input(s) (Read-only)                                                                                                           |
| url         | url pointing to video file available after recording is completed (Read-only)                                                                           |

#### Methods

| name                      | description                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addInput(input)           | add another input to the existing MediaStream                                                                                                                                                       |
| erase()                   | delete the contents of the recording                                                                                                                                                                |
| isSupported(format) | returns true/false indicating if the given [mimeType](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) or video format is supported by the browser (calls static isSupported method on p5.VideoRecorder) |
|pause()|pause the recording|
|resume()|resume the recording|
| save(filename)            | download the recording                                                                                                                                                                              |
| start()                   | start recording                                                                                                                                                                                     |
| stop()                    | stop recording, create Blob (video file) and url, and then call the onFileReady callback.                                                                                                           |
#### Static Methods
|name|description|
|-|-|
| isSupported(format) | returns true/false indicating if the given [mimeType](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) or video format is supported by the browser |
