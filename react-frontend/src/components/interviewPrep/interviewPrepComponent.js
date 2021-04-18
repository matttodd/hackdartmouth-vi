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
    // let sentiment_magnitude = analysis.sentiment_magnitude;
    let sentiment_score = analysis.sentiment_score;
    let word_density_score = analysis.word_density_score;
    let overall_score = analysis.overall_score;
    let raw_duration = analysis.raw_duration;
    let raw_wpm = analysis.raw_wpm;

    return (
      <div className="container">
        <section className="interview-qa">
          <div className="interview-qa-section">
            <div className="qa-section-header">
              <h3 className="qa-section-label">Job Role:</h3>
            </div>
            <select className="qa-text role-selection" name="role" id="role">
              <option value="software-engineer">Software Engineer</option>
              <option value="product-manager">Product Manager</option>
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
        {/* {response_string.length > 0 && ( */}
        {true && (
          <section className="interview-qa">
            <div className="interview-qa-section">
              <h3 className="qa-section-label">Analysis</h3>
              <div className="overall-score-container">
                <p className="overall-score">{`Overall Score: ${overall_score} / 100`}</p>
              </div>
              <ul className="card-row">
                <li className="analysis-card">
                  <h3 className="card-title">General Enthusiam</h3>
                  {sentiment_score < 25 && (
                    <div className="bad-box">
                      <p className="feedback">Bad</p>
                    </div>
                  )}
                  {50 <= sentiment_score && sentiment_score < 65 && (
                    <div className="ok-box">
                      <p className="feedback">Ok</p>
                    </div>
                  )}
                  {65 <= sentiment_score && (
                    <div className="good-box">
                      <p className="feedback">Good</p>
                    </div>
                  )}

                  <p>Sentiment score: {sentiment_score}</p>
                  <p>Try to start and end your responses on a positive note!</p>
                </li>
                <li className="analysis-card">
                  <h3 className="card-title">Response Length</h3>
                  {duration_score < 25 && (
                    <div className="bad-box">
                      <p className="feedback">Bad</p>
                    </div>
                  )}
                  {50 <= duration_score && duration_score < 65 && (
                    <div className="ok-box">
                      <p className="feedback">Ok</p>
                    </div>
                  )}
                  {65 <= duration_score && (
                    <div className="good-box">
                      <p className="feedback">Good</p>
                    </div>
                  )}
                  <p>Duration: {raw_duration} seconds.</p>
                  <p>Keep your answers short and concise - between 30s to 2min!</p>
                </li>
                <li className="analysis-card">
                  <h3 className="card-title">Talking Speed</h3>
                  {/* {word_density_score < 25 && <p>Very Bad</p>}
                  {25 <= word_density_score && word_density_score < 50 && <p>Bad</p>}
                  {50 <= word_density_score && word_density_score < 75 && <p>OK</p>}
                  {75 <= word_density_score && <p>Good</p>} */}
                  {word_density_score < 25 && (
                    <div className="bad-box">
                      <p className="feedback">Bad</p>
                    </div>
                  )}
                  {50 <= word_density_score && word_density_score < 65 && (
                    <div className="ok-box">
                      <p className="feedback">Ok</p>
                    </div>
                  )}
                  {65 <= word_density_score && (
                    <div className="good-box">
                      <p className="feedback">Good</p>
                    </div>
                  )}
                  <p>Your WPM: {raw_wpm}</p>
                  <p>Use a moderate pace when speaking.</p>
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
