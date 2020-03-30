# Install (Windows only)
- Download and install <b>python 2.7 for Windows</b> from https://www.python.org/downloads/release/python-2717/.
- Check the python installation by typing `python --version`. It should output something like 
```
C:\>python --version
Python 2.7.16
```
- Make sure that the `python`-command is really python 2.7.X, otherwise the project won't run. Especially it's incompatible with python 3.X.X.
- Install LeapMotion <b>SDK v2 (!)</b> from  https://developer.leapmotion.com/setup/desktop.
- Open the LeapMotion visualizer via task menu. If you're on Windows 10 and you have troubles to see anything apply the fix from `install/Win10 Fall Creator's Fix V2` by stopping LeapMotion controller Windows service, copying the two files to `C:\Program Files (x86)\Leap Motion\Core Services` (and overwriting the files there) and restarting the LeapMotion controller (more information: https://forums.leapmotion.com/t/resolved-windows-10-fall-creators-update-bugfix/6585)
- <b>Run `install.bat`</b> to install all python dependencies. Note: if you would have to uninstall dependencies for some reason use `pip uninstall -r requirements.txt`.

# Run
- <b>Plug in your LeapMotion hardware</b> and make sure it's working correctly.
- Run the <b>`run.bat`</b> to start the app.
- Open a <b>Webbrowser</b> on your local system and point to address <b>http://localhost:5000</b>.
- Try your best and <b>have fun :-)</b>

# Debug
This project is bundled with a folder called `.vscode` which includes all the necessary information for <b>Microsoft Visual Studio Code</b> debugger. To have the debugger properly configured for python 2.7 please visit https://code.visualstudio.com/docs/python/debugging.

There are two debug profiles included in the `.vscode/launch.json` you can use:
- `run app` lets you start the app and attaches the debugger to the default python process. With this configuration you can <b>debug all the startup code</b> until the webserver is running.
- `debug Flask` will attatch the debugger to the Flask webserver process. You can use this profile to <b>debug all the endpoints</b> you can find inside `app.py`. Note that there are currently some issues with VSCode debugger and Flask in higher version than 1.0.3 (this is the reason we use Flask in that specific version). If you have troubles with debugging please refer to https://github.com/microsoft/ptvsd/issues/2101#issuecomment-598492065 for more information.


# Other platforms
Currently we <b>only support Windows</b> as platform for this app. But theoretically it could be run on Linux and MacOS, too. We provide the LeapMotion library files for these platforms but we didn't test them.

# Used Libraries
- Flask (https://palletsprojects.com/p/flask/)
- Jinja2 (https://jinja.palletsprojects.com/en/2.11.x/)
- scikit-learn (https://scikit-learn.org/stable/)
