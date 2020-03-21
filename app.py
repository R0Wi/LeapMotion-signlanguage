import lib_locator
from classifier import clf
from flask import Flask, render_template, jsonify, request, json
from hand_data import get_hand_position
from lib import Leap
import pickle
import random
#import redis

app = Flask(__name__)

controller = Leap.Controller()
controller.set_policy(Leap.Controller.POLICY_BACKGROUND_FRAMES)

#r = redis.StrictRedis(host='localhost', port=6379, db=0)

# @app.route('/translate')
# def translate():
#     return render_template('ui.html')

@app.route('/')
def tutorial():
    return render_template('tutorial.html')

# @app.route('/score', methods=['POST'])
# def add_score():
#     data = request.form
#     try:
#         record = json.dumps({'user': data['user'], 'score': int(data['score'])})
#         print record
#         result = r.lpush('scoreboard', record)
#         return jsonify(error=result)
#     except KeyError:
#         return jsonify(error=True)

# @app.route('/scores', methods=['GET'])
# def get_scores():
#     scores = [json.loads(i) for i in r.lrange('scoreboard', 0, 100)]
#     scores.sort(key=lambda s: s['score'], reverse=True)
#     return jsonify(scores=scores[:10])

@app.route('/currentPrediction')
def current_prediction():
    # Check hand
    hand_pos = get_hand_position(controller)
    if not hand_pos:
        return jsonify(hasData=False)

    features = []
    for _, featureValue in hand_pos.iteritems():
        features.append(featureValue)

    # Return the propabillity-table to the client
    # in form: [["a", 0.125202], ["b", 0.00021], ... ]
    classes = clf.classes_
    probs = zip(classes, clf.predict_proba([features])[0])

    return jsonify(hasData=True, probs=probs)

# @app.route('/splash')
# def splash():
#     return render_template('splash.html')


# @app.route('/scoreboard')
# def scoreboard():
#     return jsonify(user_score=100)

if __name__ == '__main__':
    app.run(debug=True)
