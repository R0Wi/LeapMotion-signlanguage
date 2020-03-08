import time
import collections
from lib import Leap
from lib.Leap import Bone

'''
Algorithm:
    - get current frame from LeapMotion controller
    - iterate through fingers and store the topmost end of each bone (4 points)
    - for each of the points create relative vector by subtracting the center of the hand
    - create a flat tuple out of each relative point
    - fill a flat list with these points (4 finger vectors * 5 fingers * 3 dimensional tuple = 60 entries)
    - returns a orderey dictionary in form
        {   
            feat0=<FLOAT>, 
            feat1=<FLOAT>, 
            ... 
            feat59=<FLOAT>
        }
'''
def get_hand_position(controller, blocking=False):
    frame = controller.frame()
    if not blocking and len(frame.fingers) == 0:
        return None

    while len(frame.fingers) == 0:
        frame = controller.frame()

    fingers = controller.frame().fingers
    finger_points = []
    for finger in fingers:
        finger_points.append(finger.bone(Bone.TYPE_METACARPAL).next_joint)
        finger_points.append(finger.bone(Bone.TYPE_PROXIMAL).next_joint)
        finger_points.append(finger.bone(Bone.TYPE_INTERMEDIATE).next_joint)
        finger_points.append(finger.bone(Bone.TYPE_DISTAL).next_joint)

    # if we've more than one hand take the first one
    hands = controller.frame().hands
    if len(hands) == 0:
        return None
    hand_center = hands[0].palm_position

    relative_finger_points = collections.OrderedDict()
    for fingerPointIdx in range(len(finger_points)):
        realtive_point_to_center = (finger_points[fingerPointIdx] - hand_center).to_tuple()
        # Fill (x,y,z) into flat list
        for dimensionIdx in range(3):
            relative_finger_points["feat" + str(fingerPointIdx*3+dimensionIdx)] = realtive_point_to_center[dimensionIdx]

    return relative_finger_points


# Debug and datageneration
# possibility for the 
# hand data algorithm
if __name__ == "__main__":

    controller = Leap.Controller()

    while True:
        hand_pos = get_hand_position(controller)
        if hand_pos:
            for k,v in hand_pos.iteritems():
                print (str(k) + " " + str(v))
        time.sleep(1)
