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
    const { analysis } = this.props.interviews;
    let response_string = analysis.text;
    let duration_score = analysis.duration_score;
    let sentiment_magnitude = analysis.sentiment_magnitude;
    let sentiment_score = analysis.sentiment_score;
    let word_density_score = analysis.word_density_score;
    let overall_score = analysis.overall_score;

    return (
      <div className="container">
        <section className="interview-qa">
          <div className="interview-qa-section">
            <div className="qa-section-header">
              <h3 className="qa-section-label">Job Role:</h3>
            </div>
            <select className="qa-text role-selection" name="role" id="role">
              <option value="product-manager">Product Manager</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="designers">Designer</option>
            </select>
            <div className="qa-section-header">
              <h3 className="qa-section-label">Question:</h3>
            </div>
            {/* <p className="qa-text">Describe a time you ate shit.</p> */}
            <select className="qa-text role-selection" name="role" id="role">
              <option value="1">What’s your greatest weakness?</option>
              <option value="2">Tell me about a group project you were involved with?</option>
              <option value="3">What’s your greatest weakness?</option>
              <option value="4">Why this company?</option>
              <option value="5">What is the toughest decision you have ever had to make?</option>
            </select>
          </div>
          <div className="interview-qa-section">
            <div className="qa-section-header">
              <h3 className="qa-section-label">Your response:</h3>
            </div>
            <div className="qa-response-container">
              {response_string.length == 0 && (
                <div className="record-button-container">
                  {!this.state.isRecording ? (
                    <>
                      <button
                        // className="record-button notRec"
                        className="record-button notRec"
                        onClick={() => this.startRecording()}
                      >
                        Record
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="record-button Rec"
                        onClick={() => this.stopRecording()}
                      ></button>
                    </>
                  )}
                </div>
              )}
              {response_string.length > 0 && <p className="qa-text">{response_string}</p>}
            </div>
          </div>
        </section>
        {response_string.length > 0 && (
          <section className="interview-qa">
            <div className="interview-qa-section">
              <h3 className="qa-section-label">Analysis</h3>
              <p>{`Overal Score: ${overall_score} / 100`}</p>
              <ul className="card-row">
                <li className="analysis-card">
                  <h3 className="card-title">General Sentiment</h3>
                  <p>{sentiment_score}</p>
                </li>
                <li className="analysis-card">
                  <h3 className="card-title">Response Length</h3>
                  <p>{duration_score}</p>
                </li>
                <li className="analysis-card">
                  <h3 className="card-title">Talking Speed</h3>
                  <p>{word_density_score}</p>
                </li>
              </ul>
            </div>
          </section>
        )}
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
