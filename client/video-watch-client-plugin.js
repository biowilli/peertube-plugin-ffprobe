async function register({ registerHook, peertubeHelpers }) {
  peertubeHelpers.getSettings().then((setting) => {
    if (!setting["ffprobe-view-active"]) {
      console.error("Settings is not set.");
      return;
    }
    if (!setting["ffprobe-view-active"]) return;

    registerHook({
      target: "action:video-watch.player.loaded",
      handler: ({ video }) => {
        console.log(video);
        console.log(video.id);

        fetch(peertubeHelpers.getBaseRouterRoute() + `/ffprobe/${video.id}`, {
          method: "GET",
          headers: peertubeHelpers.getAuthHeader(),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              createHeaderField("ffprobe-Metaddata", 1);
              printJSONKeysAndValues(result.data.result);
            }

            if (result.success) {
              console.log("could not find the ffprobe analysed data");
            }
          });
      },
    });
  });
}

function printJSONKeysAndValues(obj, indent = 0) {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      //console.log("  ".repeat(indent) + key + ":");
      createHeaderField("  ".repeat(indent) + key + ":", indent);
      printJSONKeysAndValues(obj[key], indent + 1);
    } else {
      //console.log("  ".repeat(indent) + key, obj[key]);
      createVideoInfo("  ".repeat(indent) + key, obj[key]);
    }
  }
}

function createHeaderField(header, headerlevel) {
  const myHeader = document.querySelector("my-video-attributes");
  const newHeader = document.createElement("div");
  newHeader.classList.add("header-field");
  newHeader.innerHTML = `
    <h${headerlevel} class="header-label">${header}</h${headerlevel}>
  `;
  myHeader.appendChild(newHeader);
}

function createVideoInfo(label, value) {
  const myVideoAttributes = document.querySelector("my-video-attributes");
  const newField = document.createElement("div");
  newField.classList.add("attribute-ffprobe");
  newField.innerHTML = `
<span class="attribute-label-ffprobe">${label}</span>
<span class="attribute-value-ffprobe">${value}</span>
`;
  myVideoAttributes.appendChild(newField);
}

export { register };
