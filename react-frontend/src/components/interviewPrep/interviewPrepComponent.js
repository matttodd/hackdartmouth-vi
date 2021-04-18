import React, { Component } from "react";
import PropTypes from "prop-types";
import * as RecordRTC from "recordrtc";

// redux
import { postInterviewResponse } from "../../redux/actions/interviewActions";
import { connect } from "react-redux";

import axios from "axios";
// css styles
import "./interviewPrep.css";

var recordAudioThing;
var recordAudioFiles;

class InterviewPrep extends Component {
  constructor() {
    super();
    this.state = {};
    this.stopRecording = this.stopRecording.bind(this);
  }

  // search change
  handleChange = (event) => {
    const value = event.target.value.trim();
    // this.props.setApplicationSearch(value);
  };

  //3)
  startRecording(recordAudio) {
    // startRecording.disabled = true;

    //4)
    navigator.getUserMedia(
      {
        audio: true,
      },
      function (stream) {
        //5)
        recordAudio = RecordRTC(stream, {
          type: "audio",

          //6)
          mimeType: "audio/webm",
          sampleRate: 44100,
          // used by StereoAudioRecorder
          // the range 22050 to 96000.
          // let us force 16khz recording:
          desiredSampRate: 16000,

          // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
          // CanvasRecorder, GifRecorder, WhammyRecorder
          recorderType: RecordRTC.StereoAudioRecorder,
          // Dialogflow / STT requires mono audio
          numberOfAudioChannels: 1,
        });

        recordAudio.startRecording();
        // stopRecording.disabled = false;
        console.log(recordAudio);
        recordAudioThing = recordAudio;
      },
      function (error) {
        console.error(JSON.stringify(error));
      }
    );
  }

  stopRecording = (e) => {
    // recording stopped
    // startRecording.disabled = false;
    // stopRecording.disabled = true;
    console.log(recordAudioThing);
    // stop audio recorder
    recordAudioThing.stopRecording(() => {
      // after stopping the audio, get the audio data
      recordAudioThing.getDataURL(function (audioDataURL) {
        //2)
        var files = {
          audio: {
            type: recordAudioThing.getBlob().type || "audio/wav",
            dataURL: audioDataURL,
          },
        };
        // submit the audio file to the server
        // socketio.emit("message", files);
        // console.log(files.audio.dataURL);
        // recordAudioFiles = files;
        let formData = new FormData();
        // formData.append("image", imagefile.files[0]);
        formData.append("audio", files.audio.dataURL);
        return axios.post(`/interviews/speech2txt`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });
    });
    // this.props.postInterviewResponse(recordAudioFiles);
  };

  render() {
    //medium.com/google-cloud/building-a-client-side-web-app-which-streams-audio-from-a-browser-microphone-to-a-server-part-ii-df20ddb47d4e
    //1)
    // const startRecording = document.getElementById("start-recording");
    // const stopRecording = document.getElementById("stop-recording");

    //2)
    var recordAudio;
    const io = require("socket.io");
    const socketio = io();
    const socket = socketio.on("connect", function () {
      // startRecording.disabled = false;
      console.log("Connected");
    });

    return (
      <div>
        <button onClick={() => this.startRecording(recordAudio)}>Start Recording</button>
        <button onClick={() => this.stopRecording()}>Stop Recording</button>
        {/* <textarea id="results" style="width: 800px; height: 300px;"></textarea> */}
      </div>
    );
  }
}

InterviewPrep.propTypes = {
  postInterviewResponse: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { postInterviewResponse })(InterviewPrep);
