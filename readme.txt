What do I need,
Menu for play button, settings, scoreboard?

Game
-Visual indicator of tiles found and left
-Hints-- possible moves or best move based on settings
-Quit
-Restart
-Tiles fly over to their place in the mat.
-Clearly mark which buttons will remove progress
-When win prompt name to write to scoreboard
--3 letters?
-board layout Change
--starts with default chosen in settings
--arrow clicks or dropdown


Settings
-several different profiles
-lock after changes for a few days?
--stretch goal to make txt method usable with larger player base
-Music? toggle
-Sound effect toggle
-Animation Speed
-Apply button
-Pickable tile glow
-Back to menue
-AI toggle
--AI speed
-Hints avalible
-Hint type
-Tile face
--Gym
--Traditional
--App?
--Custom?
-Background color.
-information like tiles left and avalible matches
-default board

scoreboard
-Board
-Hints used
-Maybe hints disqualify for scoreboard

Info page


Known Errors
--Logo does not properly scale horozontally 

--Full screen will have wasted space with current implimentation


Things to fix
-mindex
--Change default font size of buttons on home page
--Add button to all pages to return to home page

-game
--test readout needs to be spaced properly
RESOLVED buttons need hooked up to style system
RESOLVED need to find a way to source canvas images
RESOLVED The canvas scale prioritizer isn't choosing the correct scale
    Rez: not properly converting from fu to hu
RESOLVED Single tile on canvas online, likely because of image loading problems

Stretch goal
--dev page for board building
---click on board to place tiles, maybe in checkers style, apply to output to txt file
---outputs text easy to copy and paste into game.html

Understand
--document.body.style = "white-space: pre;"; //game.js
--onclick="window.location.href='score/score.html';" //mindex.html
--imageLoad //game.js