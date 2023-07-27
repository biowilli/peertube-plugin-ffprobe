const fs = require("fs");
var ffprobe = require("ffprobe"),
  ffprobeStatic = require("ffprobe-static");
const { Video } = require("sequelize"); // Stelle sicher, dass du das richtige Modul importierst, um auf die Video-Tabelle in der Datenbank zuzugreifen.

async function register({ registerHook, settingsManager }) {
  console.log("hier bin ich");

  registerHook({
    target: "filter:api.video.upload.accept.result",
    handler: ({ accepted }, { videoFile }) =>
      handlerVideoUpload({
        accepted,
        videoFilePath: videoFile.path,
        settingsManager,
      }),
  });
  /*  other upload
  registerHook({
    target: "filter:api.video.post-import-url.accept.result",
    handler: ({ accepted }, { videoFilePath, videoFile }) =>
      handlerVideoUpload({
        accepted,
        videoFilePath,
        settingsManager,
      }),
  });

  registerHook({
    target: "filter:api.video.post-import-torrent.accept.result",
    handler: ({ accepted }, { videoFilePath, videoFile }) =>
      handlerVideoUpload({
        accepted,
        videoFilePath,
        settingsManager,
      }),
  }); */
}

async function handlerVideoUpload({
  accepted,
  videoFilePath,
  settingsManager,
}) {
  // ffprobe verwenden, um die Metadaten des Videos zu extrahieren - Use await to get the ffprobe result
  var ffprobeResult = await getffprobe(videoFilePath);
  console.log("ffprobe:", ffprobeResult);
  // Weitere Aktionen mit den Metadaten durchführen, z. B. speichern oder verarbeiten.

  return { accepted: true };
}

function getffprobe(path) {
  // Verify that the "ffprobe" library and "ffprobeStatic" object are available
  try {
    const ffprobe = require("ffprobe"); // Check if the ffprobe library is properly imported
    const ffprobeStatic = require("ffprobe-static"); // Check if the ffprobeStatic object is properly imported
  } catch (error) {
    console.error("Error importing 'ffprobe' or 'ffprobe-static':", error);
    throw error; // Throw the error to handle it at a higher level if needed
  }
  options = { path: ffprobeStatic.path };
  return new Promise((resolve, reject) => {
    ffprobe(path, options, function (error, info) {
      if (error) {
        console.log("Error in ffprobe", error);
        reject(error);
      } else {
        console.log("Success in ffprobe", info);
        resolve(info);
      }
    });
  });
}

function getffprobeJs(path) {}
// OM Code not tested yes
function getffprobeChildProcess(path) {
  return new Promise((resolve, reject) => {
    if (typeof path !== "string" || path.length === 0) {
      reject(new Error("Path missing."));
      return;
    }
    const exec = require("child_process").exec;
    // test if the file exists
    fs.access(path, fs.constants.F_OK, (err) => {
      console.log("here 1");
      // if no file exists, leave
      if (err) {
        reject(err);
        return;
      }

      // detect appropriate delimiter
      let delimiter = "'";
      if (path.indexOf("'") > -1) {
        delimiter = '"';
      }
      console.log("here 2");

      // execute ffprobe to get metadata
      exec(
        `/usr/bin/ffprobe -v quiet -print_format json -show_format -show_streams -show_programs -show_chapters ${delimiter}${path}${delimiter}`,
        async (err, stdout, stderr) => {
          console.log("here 3");
          // if an error occurred, leave
          if (err) {
            reject(err);
            return;
          }
          console.log("here 4");
          if (stderr) {
            reject(new Error(stderr));
            return;
          }
          console.log("here 5");
          // parse output to a js object
          try {
            resolve(JSON.parse(stdout));
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  });
}

async function unregister() {
  return;
}

module.exports = {
  register,
  unregister,
};
