import React from 'react';
import logo from './logo.svg';
import './App.css';
// import 'get-user-medi'
var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      is_playing: false
    }
  }
  record = ()=>{
    console.log("recording...");
    this.setState({
      is_playing: true
    })
    // note: for iOS Safari, the constructor must be called in response to a tap, or else the AudioContext will remain
    // suspended and will not provide any audio data.
    this.micStream = new MicrophoneStream();
    // console.log(micStream);
    // if (! micStream){
    //   console.log(micStream);
    //   return;
    // }
    let that = this;
    getUserMedia({ video: false, audio: true })
      .then(function(stream) {
        that.micStream.setStream(stream);
      }).catch(function(error) {
        console.log(error);
      });

    // get Buffers (Essentially a Uint8Array DataView of the same Float32 values)
    this.micStream.on('data', function(chunk) {
      // Optionally convert the Buffer back into a Float32Array
      // (This actually just creates a new DataView - the underlying audio data is not copied or modified.)
      var raw = MicrophoneStream.toRaw(chunk)
      //...
      console.log("raw: ")
      console.log(raw);
      // note: if you set options.objectMode=true, the `data` event will output AudioBuffers instead of Buffers
    });

    // // or pipe it to another stream
    // micStream.pipe(/*...*/);

    // It also emits a format event with various details (frequency, channels, etc)
    this.micStream.on('format', function(format) {
      console.log("format: " + format);
    });

    // // Stop when ready
    // document.getElementById('my-stop-button').onclick = function() {
    //   micStream.stop();
    // };
  }
  stop_recording = ()=>{
    console.log("stopped recording!");
    this.micStream.stop();
    this.setState({
      is_playing: false
    })
  // }
  }
  render(){
    let button_message = this.state.is_playing ? "Stop recording": "Start recording";
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.state.is_playing ? this.stop_recording: this.record}>
            {button_message}
          </button>
          <span>See the console for the info that is logged</span>
        </header>
      </div>
    );
  }
}

export default App;
