import React, { Component } from "react";
import PropTypes from "prop-types";
import * as RecordRTC from "recordrtc";

// redux
import { postInterviewResponse } from "../../redux/actions/interviewActions";
import { connect } from "react-redux";

// css styles
import "./interviewPrep.css";

var recordAudioThing;

class InterviewPrep extends Component {
  constructor() {
    super();
    this.state = { isRecording: false };
    // this.stopRecording = this.stopRecording.bind(this);
  }

  startRecording() {
    this.setState({
      isRecording: true,
    });

    navigator.getUserMedia(
      {
        audio: true,
      },
      function (stream) {
        //5)
        let recordAudio = RecordRTC(stream, {
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
        recordAudioThing = recordAudio;
      },
      function (error) {
        console.error(JSON.stringify(error));
      }
    );
  }

  stopRecording = (e) => {
    this.setState({
      isRecording: false,
    });
    recordAudioThing.stopRecording(() => {
      // after stopping the audio, get the audio data
      recordAudioThing.getDataURL((audioDataURL) => {
        var files = {
          audio: {
            type: recordAudioThing.getBlob().type || "audio/wav",
            dataURL: audioDataURL,
          },
        };
        // submit the audio file to the server
        this.props.postInterviewResponse(files.audio.dataURL);
      });
    });
  };

  render() {
    //medium.com/google-cloud/building-a-client-side-web-app-which-streams-audio-from-a-browser-microphone-to-a-server-part-ii-df20ddb47d4e
    const { response_string } = this.props.interviews;

    return (
      <div className="container">
        <section className="interview-qa">
          <div className="interview-qa-section">
            <div className="qa-section-header">
              <h3 className="qa-section-label">Question:</h3>
            </div>
            <p className="qa-text">Describe a time you ate shit.</p>
          </div>
          <div className="interview-qa-section">
            <div className="qa-section-header">
              <h3 className="qa-section-label">Your response:</h3>
              <div className="record-button-container">
                {!this.state.isRecording ? (
                  <>
                    <button className="record-button notRec" onClick={() => this.startRecording()}>
                    </button>
                    <p>Record</p>
                  </>
                ) : (
                  <>
                    <button className="record-button Rec" onClick={() => this.stopRecording()}>
                    </button>
                    <p>Stop</p>
                  </>
                )}
              </div>
            </div>
            {response_string.length > 0 && <p className="qa-text">{response_string}</p>}
          </div>
        </section>
        <section className="interview-qa">
          <div className="interview-qa-section">
            <h3 className="qa-section-label">Analysis</h3>
          </div>
        </section>
      </div>
    );
  }
}

InterviewPrep.propTypes = {
  postInterviewResponse: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { interviews: state.interviews };
};

export default connect(mapStateToProps, { postInterviewResponse })(InterviewPrep);
