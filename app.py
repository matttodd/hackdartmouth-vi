# Required imports
import os
from datetime import datetime
from flask import abort, Flask, request, jsonify
from flask_cors import CORS, cross_origin
from firebase_admin import credentials, firestore, initialize_app, auth

# Imports the Google Cloud client library
from google.cloud import language_v1


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

# Instantiates a NLP client
client = language_v1.LanguageServiceClient()

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
        sentiment = client.analyze_sentiment(
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
        sentiment = client.analyze_sentiment(
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