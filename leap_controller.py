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
    - returns a ordered list where the index of the entry its points unique identifier
'''

# This is a wrapper class for the
# LeapMotion SDK Controller
class LeapMotionController:

    def __init__(self):
        self._controller = Leap.Controller()
        self._controller.set_policy(Leap.Controller.POLICY_BACKGROUND_FRAMES)

    def read_hand_data(self):
        frame = self._controller.frame()
        if len(frame.fingers) == 0:
            return None

        fingers = self._controller.frame().fingers
        finger_points = []
        for finger in fingers:
            metacarpal_bone_end = finger.bone(Bone.TYPE_METACARPAL).next_joint
            proximal_bone_end = finger.bone(Bone.TYPE_PROXIMAL).next_joint
            intermediate_bone_end = finger.bone(Bone.TYPE_INTERMEDIATE).next_joint
            distal_bone_end = finger.bone(Bone.TYPE_DISTAL).next_joint

            finger_points.append(metacarpal_bone_end)
            finger_points.append(proximal_bone_end)
            finger_points.append(intermediate_bone_end)
            finger_points.append(distal_bone_end)

        hands = self._controller.frame().hands
        if len(hands) == 0:
            return None

        # Take the first hand in case we have multiple
        hand_center = hands[0].palm_position
        relative_finger_points = []

        for finger_point_index in range(len(finger_points)):
            # This is the difference-vector between hand
            # palm position and current finger point
            realtive_point_to_center = (finger_points[finger_point_index] - hand_center).to_tuple()
            # Fill (x,y,z) into flat list
            for dimension_index in range(3):
                relative_finger_points.append(realtive_point_to_center[dimension_index])

        return relative_finger_points

# Debug and datageneration
# possibility for the 
# hand data algorithm
if __name__ == "__main__":
    controller = LeapMotionController()
    while True:
        hand_data = controller.read_hand_data()
        if hand_data:
            for i in range(len(hand_data)) :
                print (str(i) + ": " + str(hand_data[i]))
        time.sleep(1)
