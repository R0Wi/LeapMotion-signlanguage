# This scripts add the LeapMotion
# library path to the environment
# of the current process

import sys
import os

lib_dir = "lib"
is64bit = sys.maxsize > 2**32

if is64bit:
    print("Running on 64bit-machine")
    lib_dir = os.path.join(lib_dir, "x64")
else:
    print("Running on 32bit-machine")
    lib_dir = os.path.join(lib_dir, "x86")

# create full lib-dir path depending 
# on bitness of current process
cwd = os.path.dirname(os.path.realpath(__file__))
lib_dir_absolute = os.path.join(cwd, lib_dir)

if not os.path.exists(lib_dir_absolute):
    raise IOError("The 'lib' folder for LeapMotion SDK can't be found", lib_dir_absolute)

# add the lib-dir to the path
sys.path.append(lib_dir_absolute)