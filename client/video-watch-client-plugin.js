function register({ registerHook, peertubeHelpers}) {
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
        .then((result) => printJSONKeysAndValues(result.data.result))
    },
  });
}

function printJSONKeysAndValues(obj, indent = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      console.log('  '.repeat(indent) + key + ':');
      createHeaderField('  '.repeat(indent) + key + ':', indent);
      printJSONKeysAndValues(obj[key], indent + 1);
    } else {
      console.log('  '.repeat(indent) + key, obj[key]);
      createVideoInfo('  '.repeat(indent) + key, obj[key]);
    }
  }
}

function createHeaderField(header, headerlevel) {
  // Wähle das Element aus, zu dem du das neue Feld hinzufügen möchtest 
  const myHeader = document.querySelector("my-video-attributes");

  // Erstelle das neue Feld
  const newHeader = document.createElement("div");
  newHeader.classList.add("header-field");

  // Füge den Inhalt des neuen Feldes hinzu
  newHeader.innerHTML = `
    <h${headerlevel} class="header-label">${header}</h${headerlevel}>
  `;

  // Füge das neue Header am Ende des my-header-Elements hinzu
  myHeader.appendChild(newHeader);
}

function createVideoInfo(label, value) {
  // Wähle das Element aus, zu dem du das neue Feld hinzufügen möchtest 
  const myVideoAttributes = document.querySelector("my-video-attributes");

  // Erstelle das neue Feld
  const newField = document.createElement("div");
  newField.classList.add("attribute-ffprobe");

  // Füge den Inhalt des neuen Feldes hinzu
  newField.innerHTML = `
<span class="attribute-label-ffprobe">${label}</span>
<span class="attribute-value-ffprobe">${value}</span>
`;

  // Füge das neue Feld am Ende des my-video-attributes-Elements hinzu
  myVideoAttributes.appendChild(newField);
}

export { register };
