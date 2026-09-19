/* The workshop recording, in one place.
   ------------------------------------------------------------------
   Both /uk-workshop/live.html (the simulated-live room) and
   /uk-workshop/watch.html (the on-demand recording) read this file, so
   the video is only ever pointed at from here.

   WHY WISTIA AND NOT A FILE IN THIS REPO
   The master is "Webbi Final V1 2.mp4": 31:26, 3840x2160 HEVC, 1.02 GB.
   GitHub rejects any single file over 100 MB and GitHub Pages serves
   this repository, so it could never have lived here. HEVC is also not
   playable in Firefox and only conditionally in Chrome, so the master
   could not have been served raw to a browser either. Wistia solves
   both: it re-encodes to H.264 and serves adaptive bitrate, so a viewer
   on a phone is not pulling a 4K stream.

   Wistia also gives us a real player API - actual playback position,
   programmatic seeking, and every control switched off individually -
   which is what makes a recording pass as a live session. `.gitignore`
   still blocks *.mp4 and *.mov so a stray local copy cannot be
   committed and break a push. */

window.GK_WORKSHOP = {

  // The media ID, from dylana057.wistia.com. Both pages build their embed
  // from this, so a re-upload only needs the new ID pasted here.
  // Share link for reference: https://dylana057.wistia.com/s/akloohdybjo61np
  wistiaId: 'es2v424yt5',

  // Sits behind the player until Wistia has painted its first frame, so
  // the room does not flash black the moment the countdown hands over.
  // Pulled from the recording's own title card.
  poster: '/images/workshop-poster.jpg',

  // 31:26. The watch tags are percentages of this, so it has to be the
  // real runtime - too short and everyone is tagged watched-complete
  // early. Both pages correct it from Wistia's own metadata once the
  // player is ready, so an error here fixes itself on load; a missing
  // value would not.
  seconds: 1886
};
