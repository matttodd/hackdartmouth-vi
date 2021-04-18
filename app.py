# Required imports
import os
from datetime import datetime
from flask import abort, Flask, request, jsonify
from flask_cors import CORS, cross_origin
from firebase_admin import credentials, firestore, initialize_app, auth
import base64

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
@app.route("/interviews/nlp", methods=["GET"])
@cross_origin()
def get_nlp_analysis():
    """
    Get NLP analysis
    """
    try:
        # The text to analyze
        text = "Hello, world!"
        document = language_v1.Document(
            content=text, type_=language_v1.Document.Type.PLAIN_TEXT
        )

        # Detects the sentiment of the text
        sentiment = nlp_client.analyze_sentiment(
            request={"document": document}
        ).document_sentiment

        nlp_analysis = {
            "text": text,
            "sentiment_score": sentiment.score,
            "sentiment_magnitude": sentiment.magnitude,
        }

        return jsonify(nlp_analysis), 200
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
        # Base64 string containing the audio recording
        audioDataURL = request.form["audio"]
        # audioDataURL = "UklGRlwXAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YTgXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v8AAAIAAQAAAAYACgD9/wcA///0////CAACAPv/BwD8//7/BwANAPD/9f/+////BgD+/wAABADz/wAA7/8BAAIA/v/4/wMA/f/3/xcAAQACAAYACAAHABEA8P/7/wAAAQACAAMA9//8/////v8AAAAA7f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA+f8HAAUABgALAPT/8f8BAAAA/f8IAPf/9f8JAA0AAwD+/wAACgADABUABAD8//7/+f/4/wMA+/8DAPD/+f8GAAwA/v/1//3/AwAEAAwA+v8AAP3/CwADAAYAAgD0//z/AwABAPX/9v/8//r//P8LAAwAAAD8/wQAAAAGAAwACgADAP3/CAAGAPX//v/4//z//v/+//3/+/8AAP3/DAABAAQAAQABAAMABwD8//H/AAD6//z/AQD8/wAAAQAGAAAAAAAEAAYAEgD8//3/BAD5//j/BQD9//r/DAAAAP//BQDs//7//P8GAAgAAAD6/wMAAAD5/wYA/f/5/w0ABQD//wYAAAAOAAQABgACAAAA/f/5//j/9v/x//j/9P/5////BwACAAoABwAKAPr/AgAEAA0A/f/5/wUA/v8UAP7/8v8HAAAABAD//wAA/v///wgA/P/7/wEAAgD9//7//f/2/wwA/P///wAAAAADAP7/BAAOAAAA+v/+/wQACQD9//3//P8AAPz//f8BAAMA/P8AAAgA+v8EAAkABQAAAAUA+P/7//3/+P8FAPb/+v/7//3/DgDz//j/DAAEAAkACQDu/wUABgAJAAUAAQALAAEA//8BAPv/AAAFAAgABAD7//v/BQD4/wEA8P/y/+7/AwD//wIACAABAAgA/v8DAAYABAAKAP//BQD6/wAA8v8EAP///f8CAAkAAQD///7/AADx/wYABgD4/wIABgD8/wMACAD7/wwA/f/+/wgA+f8AAPP/AwD5//n//f////r/BgD//wEABgD8/wUA+v8DAAIABQADAAEAAwAAAAcABAABAAEA9f/1/wEA9P/1//j//f8AAAQA///+/wwA/P8CAAMADAADAPv////+//z///8AAAcADAD+//r//v////z//f8DAAIAAwAJAPr//f8LAPf/BAADAAAABQAAAPv//v/z/wAAAQD6/wkACAD6////AAD6/wQA+f8HAAYAAAD+//7/AAAIAPX/BQABAPP/BQAKAPv/AQD7/wgA/v8FAAQAAQABAP//AAAFAAYACAD///T/BAD1/+v/AAADAPj//v8BAAsABwAKAAUA/f/7//n/+P8CAP7//v8IAP7//v8AAPn/BgAIAP///f/+//v/+/8CAAcAAQAEAP//AwADAPP/+P8AAPL/AgAQAA4ABgAEAP3/BwABAPL/AQD6//P//f8GAAAA/f8IAAgA9//7/wMA9v/5/wQAAQAAAA0ADwD6////+v/7//3/+f8DAAYACQD9//v//P/+/wIAAQAAAP//BAD+/wQABwADAAEABgAGAPz/9//5//v/7P8VAP7/BAD///r/AAD6//D/AAAGAPr/AwAOAAEABgAFAAQADgAAAPb//P8KAAEACgD6/wMA9f/+/wYA9v/w//L//v/+/wQADQAHAAAAAgD3/wAA+P8FAPr//P8IAAkAAgAFAA8A+/8BAPf/BgD+/wcABAD//xAABgDy//b/AwAAAAAA9v/9//L/+P8JAAQAAwD9//b/9v8BAPz/+/8RAAQABAAIAA4A+//8/wYA+f/8/wcACQACAAUAAwAIAP7/AADy//z/AAD1//7/7P8FAAoA+//5/wUA/v/z//b/DgAFAPL/CgARAAEAFQAMAP7/AwD2//f/+v/6/wAABAD8/wUABwD//wAA+P/0//7/BAD7/xAABAAGAPr//P8AAAQABwD7/wEA8/8AAAIAAAAHAAMAAQD0/wQA/f/6/wMADAD9//z/BgADAAAA8v8KAPz/AQACAAAABAD//wAABgD9//j////0//7/AQADAPv/CQAEAAcA//8AAAEA9//9/wAAAQADAAQABQAAAAkA/f8DAP7//v8AAP//AgD9//v//f////f/9v8GAAUAAgAGAAoA/P8LAPX/AQAAAP7/9f8FAPr/BQAIAAAA+v8CAAQABQACAAAABQAHAPf/BQD+//v//v/7//z/+v8AAPr//P8AAAYA/P/5/wsA/v///xEAAAAJAAQACAD8/wUAAQD5/////P/7/wUAAwD///j/9/8AAPr/9P/+/wAAAgAEAAMAAAD///7/+f8LAAsA9/8PAP//AgACAAgA/v8CAAAAAAAHAPH/BQD+/wEA+/8AAAEA9v/3/wEABQD5/wAAAAABAP//CwD8//n/AwAEAAgAAAADAAUAAAD6////CQD5/wAAAQD7//3//f/5/+7/AgAKAPj/DQAFAAUABAD5/wAA/P/+/wQA/f8IAP7////+/////////wgABAD//wQA+P8HAP7///////f/CgABAPH/AwD3//7/AQAKAA0AAAD9/wAAAwACAPX/AgAKAAcA//8DAPb/AgD///f/+////wAA/P8AAA0ABQD3//3/CQD7//v/AQD+//v/BgAFAAQAAAAFAAoADAABAP//AwD8/wAAAAABAPr/AAADAO///f/z/wYA/v8DAA0A+v8BAAoABQAAAPv/EAAJAAEA///2//n/9/8AAAIA+/8DAAUABgD///b/AAAAAP//+v8BAPv/AQAKAP7/+P/2/wIACQANAAAA7f8BAAQAAQAGAPz/+f8NAAAAAgAOAPz/AwD8//j/CQD4/wEA/P////j/BQAJAAIA9//+//z//v8AAPz/AQDx/wIAEAAAAP7//f8DAPv/BAD3//v/7f8FAAkAAAABAAYAAQABAAgAAAD3/wAACwAEAAQABgD1//n//f/9/wAA+//6/wEABQADAAAA/P8AAAQAFAACAAcA8f/9/wAA/P8PAPb/+P/3//j/AwANAAEAAAD8////CgAMAPr/+/8CAPr/AgD7//3//P8AAAQAAQAIAAYA9//+/wEAAQACAP3//v8GAPn/+f/8//v/BQAPAAAABQD5/wIAEgAAAAUABQD2/wEA/v8CAPn//P/9//3/AAALAPz/BgDw/wAABQADAAEA9v/7//T/CAD+/wMAAAD+/wIABAAKAAAACAD9//3//v8LAP//+P/y//X/DgD8/wwA8v8CAP7///8KAAsA8/8GAPr//P8NAP//AAD3/wQAEAD4/wAA/P/z/wQAFAACAPz////2//X/AAACAAAA/f8CAPn/AwALABEA//8DAPf/DAAFAPn/+f8JAPj//f/5/wAA7P/v//f/BwAXAAYAAAAKAPz//P8JAA0AAAD7//v//v/4//7//v/4//3/+f8LAAMA+f/9/wQAEQAEAAIAAAD///T/AAACAPr/+f/7/wUA9f8JAAMA+v8FAAYACgAKAP7//v8BAPr/6v8EAPv/+v8AAPr/BAAAAP3///8UAAkA/v8GAP7/BAD//wIAEAD3/wAA+//w/wIAAAD1//T/9v/z//b/DgAHAAcABwD9/wcADwAGAAYA///1//z/BgADAPv/BQD///n/+f8AAAIAAgD8//v/BgD9//z/CwAKAAcABgAKAAUA9v/v/wQABwD+//P/AAAAAPP//v/8/wsA///5/wcABwADAP3/CAD/////9//9//v///8HAPX/BAAGAAMA/P8AAA4ADAAAAA0ABgD4//b/9/8AAPr/AwD+//j/+//4//b/AAABAAMACQD+//7/DAAGAPr/BQAWAPz/8//5/wUA/f8EAAIA//8KAPv/BAAOAAwA+v/x//H////+//z/+//3//r/+v8CAAIABwD5//f/CgAAAAcABgD7/w4A/f8AAAIA//8AAP7/CAAMAAEA+P8CAP//CAAJAP7/CwD6//n/AgD5//P/8f/z/wkA//8AAPf/CgACAAIAAQACAAkAAAD9//r/AgD6//z/CQAEAAEADgD5//7////7/wIADwD2/wcA6f8DAAYAAwAHAAkA5v8GAAoA/v/0//P///8CAPr/BAACAAAAAAAAAA0AAQD+/wIADAADAPT//f8CAP3/AAAFAAIADAD7//v/CQAAAP7/6f8AAAkABAD6/wwAAQD2//n/AQAEAPz//v8DAAAA9//9//L//f8FAPT/BQASAAMA/f8IAAAACAAGAAEAAAD7//n/CgAIAAIA+f8AAAAAAADn/wsA7/8AAPz/9/8AAAQACgAIAAAA/f8AAAYAAAAFAAYA+/8GAA0A/P/0////CQACAAEA/P/9//7//P/+//j////+//7//v/8//7/CgAZAAEA/v8FAP3/AQABAAQA9/8GAPz/9v8CAAQA+P8AAP//AAD4/wAA//8AAPb/BAAHAAwAAAD+/wwADQD5/+n/BAAEAPn/AwAPAAQA/P8GAPr/8//3/wAA/v8BAPn/BQAHAP//BwAIAPT/AAD5//P/AwD5/wUAEgAPAAAAAwD7//j/9//4/wQABQD5/wYA+v8AAPn////9/wIA+f8KAAcA/v/8/wYAAQD//wMACgAIAAMAAAABAPT//f////P//f8IAO//8/8HAPz/9P8JAAwAAgABAPz/BAD//wIA/v/+/wQAAwARAAkA//8SAPn/8f8AAPT/7//9/wMABwAFAAIA///1/wAAAQD+/wAADgAFAP3/DgD9//3//v/3/wMAEAD//wIAAwAIAPv/AAD6//7/AAD7/wEADAABAAAAAAD4/wQAAQD8//z/9v/6/wgADAAIAPb/9f8JAAEA9f8GAAkAEQAIAAEA+//z/wAAAAD2//j/BwAEABAAAgABAAMA+/8BAPb/9P8GAAAA9f8OAPn///8MAAEACAAFAPX/BQACAAAABAAHAP3/AQABAAAA+v/z/wMA/f/7/wAA+v8CAPv/AQAEAAIACAAPAAsA+P/+/wYA/v/9//z/+P8DAAUA+f/9/wIAAQD3/wUABgD6//b/AAD+////CwAGAAAA/v8AAP3/CQAAAPL/AAAAAAIAEwD/////AQD8//3/AgD8//7/AQAAAPT//v8GAP7/6//+/woAAAD7//3/AAAGAAMADAABAAMAAQD+/w4ABADz/wQACAACAAUA+/8BAPz/7v/7//7/+P8EAAMABwD3////9v/9/wAAAwD7//z/DAD9/wQAAAAAAAIACwD6/wAABQAGAAIA/P///wAABQD+//f/BwADAPH/AAD4//H/BAAAAAgA/f/7/wIABQD1/wUABwAJAAQA/v8AAP3/BwAIAAcACgD7//L/AAD7//7//f8CAP///P/7//j//P8AAP7/AAAQAAQA+v8JAAAA9f8IAAgAEQD8//n/AwD9//n/AwAGAAIA9/8AAPH/AgAFAAEABwAJAAIAAAD5//7///8BAPn/BwARAP//DwADAAIA9P/7//3/AgD9/wUA+//7//b/+f/5/wAAAwDu//z/AAD7/wgADAAYAAsA/f8QAAAA//8OAAgAAAD4/wMA/P/7//j/+P/5//L/8//x/wAACQDx/wAADAAGABEADgAGAAsA/f8BAAgACQABAPX/BwAEAPb/+f/v/wQA9v8IAAAA9//6/wMA/f/9//r/AQD4//n///8OAAQAAQAGAAAABQAGAAMA//8CAPb/BQABAAUA9v////j/AAAAAPn/AwD8/wUABwAAAAAAAQAAAAQABAAEAPL//v/6//b/AAAEAPn/+/8GAAIA9f8LAAMAAAD8/wYACQD4/wAAAgAHAAsABAAOAAMAAwD//wAAAADz//7/+//v//r/8v/2/wUACQD5/wQABgAGAPv/BAABAAMAAgD//wEAAgAEAAoABwD6/wAACAANAPr/BQABAAIAAAADAPn//P8AAPf/7/8HAPv/8v8HAPn/AAD1/wAA+//7/wEA/v8BAAkA+v8CAAYA/v/+/wwABwAUAAoABAAFAAwAAAD1//n/AADr//f/9f/8////BAD8//7/CAAKAPL/BAADAPX/+v8KAAgACAAHAPz/AAAVAP7////5/wUA8//0///////9/woAAQANAAEA+v8EAAEAAQD2//v//f/z//7//f8DAP//DQADAPv/EAD7//H/BQD7//P/BwD9/wUAAwACABAABwALAPn/+f8AAAQA+f8BAP3/9/8FABEABQD9//z//v8AAPz/6f8EAPT/+/8KAPz/BQALAPf/CQD//wQABAD4/wcAAwD5//X/AAAIAP//8/8CAA0A/f///wUA/v8FAP3/9P8CAP7/BQACAPn/AwAAAAMACgAAAAMA/v/z/wsABQD7////BgAAAAgA6v8AAAMA/f8AAAMA+f///wIA/P/0/wAAAwD/////EgABAPr/AgANAP7////y/woAAAD4/wYAAQD5/wEA+f/4/wIAAgAQAPz/AQAFAAAAAAACAPz/8/8AAP//BQAFAPj/BQADAPv/AwD///7/CAD+//7/BAD3//T//P8BAAMA/P8FAAQA+f8FAAIA+v8LAAgABwAJAAAA9f8CAAsA+f/9//z/AgD0//z/AADs//T/CwAHAP///v8LAA4A+//z/wgAAQAAAAkA/v8HAAkA/P8AAAYA///+//z////8//3//f/+/woAAADz////BQABAP3/CgD8//b/+/8IAAEA/P8DAP7/BQDu//v/BQAJAAoABAAKAPz//f8FAPb//v8FAAMACQD3/wMA+//1/wAA+/8BAPn/AwAJAPr/DQAIAAEA5v/3//n/9/8CAAgABQAMAAUA//8FAA4A+v8AAAAA9f8DAAgABAAGAAMAAAD4//P/AADw/w4A///7/wIA9v/2//P/BwAEAAIAAQAAAAIAAQD2//3//v8AAP7/CQARAAEAEwAOAAUA+f/4//v/+f////b/BwAAAP3/BgAEAP7/AADz/wAAAgABAAAAAQACAPX/AQAIAPr/+/8GAPT/BwD+/wIA//8DAP7/9P/8/wMA/P8GAA8ABwAAAP//BQD5//3/AgD7/wcAAQAJAAMABgADAPj/+f/3/wMA/P/3/wAA/P/+/wEA+P8DAAcABgAAAP///v/3/wIAEAACAPz/BgD///f/9v8BAAkAAAABAAQA9f/7//b/BAAFAAQABwAEAP3/AgD1//j/AQAAAAMACAD///n///////D/AAAHABAA/P8NAAAAAgD+//r/9v8BAAEAAwALAAIA+f/6/wIA8/8AAAcA/f8BAAYABgAAAP//DwAAAAkAAwAAAPf/"
        # The name of the audio file to transcribe
        # gcs_uri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw"

        # audio = speech.RecognitionAudio(uri=gcs_uri)
        # audio = speech.RecognitionAudio(audioDataURL)
        base64_bytes = base64.b64encode(audioDataURL.encode("ascii"))
        print("converted")
        # audio = speech.RecognitionAudio(base64_bytes)
        audio = speech.RecognitionAudio({"content": base64_bytes})
        # audio = speech.RecognitionAudio({"content": audioDataURL.encode("utf-8")})
        # audio = speech.RecognitionAudio({"content": audioDataURL})

        config = speech.RecognitionConfig(
            encoding="FLAC",
            sample_rate_hertz=16000,
            language_code="en-US",
        )

        # Detects speech in the audio file
        response = speech_client.recognize(config=config, audio=audio)
        print("response raw: ", type(response))
        responses = []
        for result in response.results:
            responses.append(result.alternatives[0].transcript)
            print("Transcript: {}".format(result.alternatives[0].transcript))

        print(f"responses: {responses}")
        return jsonify(responses), 200
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

# export FLASK_DEBUG=1
# Running Cloud SDK in Docker Image https://cloud.google.com/sdk/docs/downloads-docker
# Installing GCloud SDK https://cloud.google.com/sdk/docs/install
# Setting up NLP API https://cloud.google.com/natural-language/docs/reference/libraries#client-libraries-install-python