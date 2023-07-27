function register({ registerHook }) {
  // Remove the "my-video-ffprobe" element when the video player has loaded
  registerHook({
    target: "action:video-watch.player.loaded",
    handler: () => {
      const myVideoffprobe = document.querySelector("my-video-ffprobe");
      myVideoffprobe.remove();
    },
  });
}

export { register };
