#Neighborhood Map

The idea is that you can explore your neighborhood's businesses, stores, and
other attractions on a map.

If the map seems like it's not showing an area close enough, choose "Yes" when
prompted and (with your permission) the application will use a more accurate
method of finding your position.

Drag the map around to explore different areas; the map will move slightly and
zoom to fit the nearby venues it finds.

Click on a place to see more information about that place.

##Steps to run the app

###View / develop locally

The app has two components:

- The front end (this repository)
- A back end called api-proxy [https://github.com/lyle-sigurdson/api-proxy](https://github.com/lyle-sigurdson/api-proxy)

api-proxy needs to be running locally in order for the front end to work
locally.

####Prerequisites

#####Required

- A set of API keys (client id and client secret) from [developer.foursquare.com](https://developer.foursquare.com)
- A Google Maps API key
- npm and node
- bower

####Back End (api-proxy) Setup

Replace \<client-id> and \<client-secret> below with your Foursquare
credentials.

1. Change into a suitable directory to contain the api-proxy repository
   directory
1. `git clone https://github.com/lyle-sigurdson/api-proxy.git`
1. `cd api-proxy`
1. `npm install`
1. `API_PROXY_PORT=9999 FS_CLIENT_ID=<client-id> FS_CLIENT_SECRET=<client-secret> node index.js`

####Client Setup

1. In a different terminal window, change into a suitable directory to contain
   the neighborhood-map repository directory
1. `git clone https://github.com/lyle-sigurdson/neighborhood-map.git`
1. `cd neighborhood-map`
1. Replace the Google Maps API key in html/app/app-config.json with your own
1. Replace the Foursquare client ID in html/app/app-config.json with your own
1. `npm install`
1. `node_modules/.bin/jspm install`
1. `bower install`
1. `gulp serve`

The access URL will be shown in the output of "gulp serve" (typically
http://localhost:3000)
