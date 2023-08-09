const initffprobeController = (router, storageManager) => {
  router.get("/ffprobe/:id", async (req, res) => {
    try {
      var ffprobeId = req.params.id;
      var existingffprobe = await storageManager.getData(`ffprobe-${ffprobeId}`);

      if (existingffprobe == undefined) {
        res
          .status(404)
          .json({ success: false, message: "ffprobe nicht gefunden." });
        return;
      }

      res.status(200).json({
        success: true,
        message: "ffprobe-Data.",
        data: existingffprobe
      });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
        });
      }

module.exports = {
  initffprobeController
};
