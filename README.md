# Test to BetVictor
This a test to BetVictor

### TASK DESCRIPTION ###
Create a Node.js application that calls the following URL and navigates through it's content.
URL: http://www.betvictor.com/live/en/live/list.json
The Content hierarchy is: Sports > Events > Outcomes
Minimum requisites are:
* Method to list all sports (/sports)
* Method to list all events for a given sport (/sports/<id>)
* Method to list all outcomes for a given event (/sports/<id>/events/<id>
* Full test coverage (Mocha is a good test framework)
Notes:
* Obey the list order as per upstream API 'pos' property
* Please use a local Git repository and commit as you go along
Extra points for: Language support, Caching
###

# Setup
* First, 'npm install' to install dependencies.
* To launch server use 'npm start'. The server use params stablish on config.json. 
* If you want to launch units test, it uses 'npm test'.

