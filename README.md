# Install (Windows only)
- Download and install python 2.7 for Windows from https://www.python.org/downloads/release/python-2717/.
- Check the python installation by typing `python --version`. It should output something like 
```
C:\>python --version
Python 2.7.16
```
- Install LeapMotion SDK v2 (!) from  https://developer.leapmotion.com/setup/desktop.
- Open the LeapMotion visualizer via task menu. If you're on Windows 10 and you have troubles to see anything apply the fix from `install/Win10 Fall Creator's Fix V2` by stopping LeapMotion controller Windows service, copying the two files to `C:\Program Files (x86)\Leap Motion\Core Services` (and overwriting the files there) and restarting the LeapMotion controller (more information: https://forums.leapmotion.com/t/resolved-windows-10-fall-creators-update-bugfix/6585)
- Run `install.bat` to install all python dependencies.

# Run app
- Open terminal and type `python app.py` to start the app.

# Other platforms
Currently we only support Windows as platform for this app. But theoretically it could be run on Linux and MacOS, too. We provide the LeapMotion library files for these platforms but we didn't test them.
