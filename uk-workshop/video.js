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

   All three pages use the <wistia-player> web component rather than the
   older E-v1.js embed. Its options are plain HTML attributes, present
   before the player initialises, so they cannot arrive too late and be
   discarded the way an options object pushed to _wq can. That matters
   here because the room and the on-demand page share one media ID: with
   nothing set per embed, both would fall back to whatever the media is
   configured as in the Wistia dashboard, and giving the recording a
   scrub bar there would put one over a session claiming to be live.

   The component also exposes currentTime, duration, muted and play() the
   way a plain <video> element does, which is what the watch tracking on
   each page reads. `.gitignore` still blocks *.mp4 and *.mov so a stray
   local copy cannot be committed and break a push. */

window.GK_WORKSHOP = {

  // The full 31:26 workshop, on dylana057.wistia.com. The room and the
  // on-demand page both build their embed from this, so a re-upload only
  // needs the new ID pasted here.
  // Share link for reference: https://dylana057.wistia.com/s/akloohdybjo61np
  wistiaId: 'es2v424yt5',

  // The same full workshop again, uploaded a second time, for the on-demand
  // page. Two copies rather than one because a Wistia media carries its own
  // player settings and those beat the attributes set on an embed: the live
  // room needs no controls and instant muted autoplay, the recording page
  // needs a play button and a scrub bar, and one media cannot be both. Set
  // this media's player to the ordinary defaults in Wistia and leave
  // wistiaId's alone.
  // Until the second upload exists this falls back to the shared ID, which
  // means the recording page keeps the live room's chromeless player.
  watchWistiaId: null,

  // The five minute recap, a separate cut, used only by /uk-workshop/recap.
  recapWistiaId: '43po0oinls',

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
