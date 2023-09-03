const { initffprobeController }  = require("./controller/ffprobe.js");

async function register({ registerHook, storageManager,getRouter, registerSetting, settingsManager, peertubeHelpers: {
  videos: peertubeVideosHelpers, 
}}) {

  registerSetting({
    name: 'ffprobe-active',
    label: 'ffprobe activated',
    type: 'input-checkbox',
    descriptionHTML: 'enables/disables ffprobe plugin functionality',
    default: 'true',
    private: false
  })

  registerSetting({
    name: 'ffprobe-api-active',
    label: 'ffprobe api activated',
    type: 'input-checkbox',
    descriptionHTML: 'enables/disables ffprobe api',
    default: 'true',
    private: false
  })

  registerSetting({
    name: 'ffprobe-view-active',
    label: 'ffprobe view activated',
    type: 'input-checkbox',
    descriptionHTML: 'enables/disables ffprobe view under a video',
    default: 'true',
    private: false
  })
  
  const ffprobeActive = await settingsManager.getSetting('ffprobe-active')
  if (!ffprobeActive) return;

  const ffprobeApiActive = await settingsManager.getSetting('ffprobe-api-active')
  if (ffprobeApiActive) {
    var router = getRouter();
    initffprobeController(router, storageManager);
  }

  registerHook({
    target: "action:api.video.uploaded",
    handler: (handlerData) => handlerVideoUpload(
      handlerData.video.dataValues.id,
      peertubeVideosHelpers,
      storageManager,
    )
  });
}

async function handlerVideoUpload(videoId, peertubeVideosHelpers, storageManager){
  const videoFiles = await getVideoFiles(videoId, peertubeVideosHelpers);
  if (videoFiles.length === 0) {
    console.log(`No valid video file found for video "${videoId}". Skipping ffprobe...`);
    return false;
  }
  var path = videoFiles[0].path;
  await getffprobe(path)
      .then((result) => {
        console.log(`ffprobe success for ${videoId}:`, result);
        storageManager.storeData(`ffprobe-${videoId}`, {result});
      })
      .catch((error) => {
        console.error(`ffprobe error for ${videoId}:`, error);
      });

  return true;
}

async function getVideoFiles(id, peerTubeVideosHelpers) {
  return await peerTubeVideosHelpers
    .getFiles(id)
    .then(({ webtorrent: { videoFiles: webtorrentVideoFiles }, hls: { videoFiles: hlsVideoFiles } }) =>
      webtorrentVideoFiles.concat(hlsVideoFiles).sort(({ size: sizeA }, { size: sizeB }) => sizeA - sizeB)
    );
} 

function getffprobe(path) {
  const ffprobe = require("ffprobe");
  const ffprobeStatic = require("ffprobe-static");
  options = { path: ffprobeStatic.path };
  return new Promise((resolve, reject) => {
    ffprobe(path, options, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
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
