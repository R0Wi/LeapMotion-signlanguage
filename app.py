from clf_loader import clf                                          # Load the classifier data
from flask import Flask, render_template, jsonify, request, json    # Load the webserver library
from leap_controller import LeapMotionController                    # Load the LeapMotion controller wrapper

# Configure Flask library
# (NOTE:: default-port is 5000)
app = Flask(__name__,
            static_url_path='', 
            static_folder='web/webroot',
            template_folder='web/templates')

# Get instance of connected controller (wrapper class)
controller = LeapMotionController()

# Route for showing the index page
@app.route('/')
def tutorial():
    return render_template('index.html')

# Ajax route for getting current prediction 
# as probability table
@app.route('/currentPrediction')
def current_prediction():
    global controller

    # Check hand
    hand_data = controller.read_hand_data()
    if not hand_data:
        return jsonify(hasData=False)

    # Return the propabillity-table to the client
    # in form: [["a", 0.125202], ["b", 0.00021], ... ]
    classes = clf.classes_
    probs = zip(classes, clf.predict_proba([hand_data])[0])

    return jsonify(hasData=True, probs=probs)

# MAIN
if __name__ == '__main__':
    app.run(debug=True)
