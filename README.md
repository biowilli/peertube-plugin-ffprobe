# PeerTube plugin ffprobe

Additional technical information about media data is obtained using ffprobe.

When uploading a video, this data is persistently stored in the plugin's database and can be accessed through an endpoint.
Use ffprobe to get info from media files and return as JSON.

https://www.npmjs.com/package/ffprobe
https://ffmpeg.org/ffprobe.html

### How to use ffprobe

- Login as admin in your PeerTube instance
- Go to Plugin/Themes in the Administration section
- Search plugins for 'ffprobe'
- Click on Install

### npm package

https://www.npmjs.com/package/peertube-plugin-ffprobe

### contributor

https://www.fairkom.eu/

### For Dev

- follow local env tutorial: https://github.com/Chocobozzz/PeerTube/blob/develop/.github/CONTRIBUTING.md#prerequisites

- Doc: https://docs.joinpeertube.org/contribute/plugins

- Build the CLI:
  npm run setup:cli

- command for starting the dev Instanz
  NODE_ENV=dev npm start

- Then, you can install or reinstall your local plugin/theme by running:
  peertube-cli plugins install --path /Users/monz/Git/FS1/peertube-plugin-ffprobe
  or
  node ./dist/server/tools/peertube.js plugins install --path /Users/monz/Git/FS1/peertube-plugin-ffprobe
