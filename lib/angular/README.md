 To start Google Chrome on Mac with verbose logging you'll need to open a terminal and run something similar to the following:

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-logging --v=1&
Then watch the debug log file by tailing the log file.

tail -f ~/Library/Application\ Support/Google/Chrome/chrome_debug.log
On Ubuntu try:

tail -f ~/.config/google-chrome/chrome_debug.log
It's very chatty but it may be just enough to help you fix your issue.
