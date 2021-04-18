# Required imports
import os
from datetime import datetime
from flask import abort, Flask, request, jsonify
from flask_cors import CORS, cross_origin
from firebase_admin import credentials, firestore, initialize_app, auth
import base64
import wave
import contextlib

# Imports the Google Cloud client library
from google.cloud import language_v1, speech

# Initialize Flask app
app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

# Initialize Firestore DB
cred = credentials.Certificate("key.json")
default_app = initialize_app(cred)

db = firestore.client()
application_ref = db.collection("applications")
profile_ref = db.collection("profiles")

# Instantiates GCP clients
nlp_client = language_v1.LanguageServiceClient()
speech_client = speech.SpeechClient()

# APPLICATION ENDPOINTS
@app.route("/applications", methods=["GET"])
@cross_origin()
def get_all_applications():
    """
    Get all applications.
    """
    try:
        # request fields
        applications = application_ref.stream()

        applications_list = []
        for a in applications:
            application = a.to_dict()
            application["id"] = a.id
            applications_list.append(application)

        return jsonify(applications_list), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


@app.route("/applications/<user_id>", methods=["GET"])
@cross_origin()
def get_all_user_applications(user_id):
    """
    Get all applications for specified user.
    """
    try:
        # request fields
        # applications = application_ref.stream()
        print("FUCK")
        applications = application_ref.where("user_id", "==", user_id).stream()

        applications_list = []
        for a in applications:
            application = a.to_dict()
            application["id"] = a.id
            applications_list.append(application)

        return jsonify(applications_list), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


@app.route("/applications/<user_id>", methods=["POST"])
@cross_origin()
def post_user_application(user_id):
    """
    Post application for specified user.
    """
    # XYrpS0dU2ATb44u15KWy9qNfP9q1
    try:
        new_application = request.json
        new_application["user_id"] = user_id
        new_application["last_update_date"] = datetime.now()
        # TODO - convert datetime to python
        # new_application["date_applied"] = datetime(new_application["date_applied"])

        application_ref.add(new_application)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/applications/<application_id>", methods=["PUT"])
@cross_origin()
def update_user_applications(application_id):
    """
    Update application for specified user.
    """
    try:
        application_ref.document(application_id).update(request.json)

        return jsonify({"success": True}), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


@app.route("/applications/<application_id>", methods=["DELETE"])
@cross_origin()
def delete_user_applications(application_id):
    """
    delete application for specified user.
    """
    try:
        # request fields
        # applications = application_ref.stream()
        application_ref.document(application_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


# PROFILE ENDPOINTS
@app.route("/profiles/<user_id>", methods=["GET"])
@cross_origin()
def get_profile(user_id):
    """
    Get all applications for specified user.
    """
    try:
        # request fields
        profiles = profile_ref.where("user_id", "==", user_id).stream()

        profiles_list = []
        for p in profiles:
            profile = p.to_dict()
            profile["id"] = p.id
            profiles_list.append(profile)

        return jsonify(profiles_list[0]), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


# GCLOUD ENDPOINTS
# @app.route("/interviews/nlp", methods=["GET"])
# @cross_origin()
def get_nlp_analysis(text):
    """
    Get NLP analysis
    """
    try:
        # The text to analyze
        document = language_v1.Document(
            content=text, type_=language_v1.Document.Type.PLAIN_TEXT
        )

        # Detects the sentiment of the text
        sentiment = nlp_client.analyze_sentiment(
            request={"document": document}
        ).document_sentiment

        # verb stuff
        everything = nlp_client.annotate_text(
            request={
                "document": document,
                "features": {
                    "extract_syntax": True,
                    "extract_entities": True,
                    "extract_document_sentiment": False,
                    "extract_entity_sentiment": False,
                    "classify_text": True,
                },
            }
        )

        # # entities = everything.entities
        # tokens = everything.tokens
        # # print(tokens[1])
        # for token in tokens:
        #     print(token)

        # calculate overall score
        sentiment_score = int((sentiment.score + 1) * 50)
        overall_score = (
            sum(
                [
                    sentiment_score,
                    duration_score(),
                    word_density_score(text),
                ]
            )
            / 3
        )
        # overall_percentage = int(overall_score * 10)

        nlp_analysis = {
            "text": text,
            "sentiment_score": sentiment_score,
            "sentiment_magnitude": sentiment.magnitude,
            "duration_score": duration_score(),
            "word_density_score": word_density_score(text),
            "overall_score": int(overall_score),
            "raw_wpm": int(words_per_minute(text)),
            "raw_duration": int(get_wave_duration()),
        }

        # return jsonify(nlp_analysis), 200
        return nlp_analysis
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


@app.route("/interviews/speech2txt", methods=["POST"])
@cross_origin()
def get_speech_from_text():
    """
    Get NLP analysis
    """
    try:
        # The name of the audio file to transcribe

        # Base64 string containing the audio recording
        audioDataURL = request.form["audio"]
        audioDataURL = audioDataURL[len("data:audio/wav;base64") :]

        wav_file = open("temp.wav", "wb")
        decode_string = base64.b64decode(audioDataURL)
        wav_file.write(decode_string)
        wav_file.close()

        content = open("temp.wav", "rb").read()
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )
        # ===============================================================

        # Detects speech in the audio file
        response = speech_client.recognize(config=config, audio=audio)
        responses = []
        for result in response.results:
            responses.append(result.alternatives[0].transcript)
            print("Transcript: {}".format(result.alternatives[0].transcript))

        # return jsonify(" ".join(responses)), 200
        text = " ".join(responses)
        print(text)
        # text =
        # text = "I sure do love working at Google. It is a really cool place! In my opinion, everyone should work at Google. Anyone who doesn't work at Google must be wasting their time! Imagine working somewhere lame like Amazon HAHA!"
        text = "In a team of 4, I participated in HackDartmouth and served as my team’s designer. With a chrome extension and web app, job architech was created to help manage job applications and interview prep."
        analysis = get_nlp_analysis(text)
        print(analysis)
        return jsonify(analysis), 200
    except Exception as e:
        print(e)
        return f"An Error Occured: {e}"


# @app.route("/signin", methods=["POST"])
# def signin(name=None):
#     """
#     Sign in Page
#     """
#     try:
#         # return render_template("sign_in.html", name=name)
#         email = request.json["email"]
#         password = request.json["password"]
#         # userData = default_app.auth().sign_in_with_email_and_password(email, password)
#         userData = auth.sign_in_with_email_and_password(email, password)
#         id_token = userData["idToken"]

#         # Get the ID token sent by the client
#         # id_token = request.json["idToken"]
#         # Set session expiration to 5 days.
#         expires_in = datetime.timedelta(days=5)
#         print(id_token)
#         # Create the session cookie. This will also verify the ID token in the process.
#         # The session cookie will have the same claims as the ID token.
#         session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
#         response = jsonify({"status": "success"})
#         # Set cookie policy for session cookie.
#         expires = datetime.datetime.now() + expires_in
#         response.set_cookie(
#             "session", session_cookie, expires=expires, httponly=True, secure=True
#         )
#         return response

#     except Exception as e:
#         # except exceptions.FirebaseError:
#         print(e)
#         return abort(401, "Failed to create a session cookie")


@app.route("/sessionLogin", methods=["POST"])
def session_login():
    # Get the ID token sent by the client
    id_token = request.json["idToken"]
    # Set session expiration to 5 days.
    expires_in = datetime.timedelta(days=5)
    try:
        # Create the session cookie. This will also verify the ID token in the process.
        # The session cookie will have the same claims as the ID token.
        session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
        response = flask.jsonify({"status": "success"})
        # Set cookie policy for session cookie.
        expires = datetime.datetime.now() + expires_in
        response.set_cookie(
            "session", session_cookie, expires=expires, httponly=True, secure=True
        )
        return response
    except exceptions.FirebaseError:
        return flask.abort(401, "Failed to create a session cookie")


port = int(os.environ.get("PORT", 8080))
if __name__ == "__main__":
    app.run(threaded=True, host="0.0.0.0", port=port)


def word_density_score(text):
    wpm = words_per_minute(text)
    if wpm < 100:
        return int(100 * (wpm / 100))
    elif wpm > 150 and wpm < 250:
        return int(100 * (250 - wpm) / 100)
    elif wpm >= 250:
        return 0
    else:
        return 100


def words_per_minute(text):
    words = len(text.split())
    return words / (get_wave_duration() / 60)


def duration_score():
    duration = get_wave_duration()
    if duration < 30:
        return int(100 * (duration / 30))
    elif duration > 120 and duration < 300:
        return int(100 * (300 - duration) / 180)
    elif duration >= 300:
        return 0
    else:
        return 100


def get_wave_duration():
    with contextlib.closing(wave.open("temp.wav", "r")) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
        return duration


# export FLASK_DEBUG=1
# Running Cloud SDK in Docker Image https://cloud.google.com/sdk/docs/downloads-docker
# Installing GCloud SDK https://cloud.google.com/sdk/docs/install
# Setting up NLP API https://cloud.google.com/natural-language/docs/reference/libraries#client-libraries-install-python