const socket = io.connect("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
// create a peer
// undefined is the id, created automatically by peer js.
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

//
//
// get permission from the user
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    //it returns a promise which has stream in it. Stream contain your video, audio and other permission
    console.log("this contain your audio and video information", stream);
    addVideoStream(myVideo, stream);

    // peer.on("call", (call) => {
    //   call.answer(stream);
    //   const video = document.createElement("video");
    //   call.on("stream", (userVideoStream) => {
    //     addVideoStream(video, userVideoStream);
    //   });
    // });

    peer.on(
      "call",
      function (call) {
        // getUserMedia(
        //   { video: true, audio: true },
        //   function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement("video");

        call.on("stream", function (userVideoStream) {
          // Show stream in some video/canvas element.
          addVideoStream(video, userVideoStream);
        });
      }
      // function (err) {
      //   console.log("Failed to get local stream", err);
      // }
    );
    // });

    socket.on("user-connected", (userId) => {
      // user is joining`
      setTimeout(() => {
        // user joined
        connectToNewUser(userId, stream);
      }, 1000);
    });
  });
// listen to peer connection
peer.on("open", (id) => {
  // this id is created automtically by peer js
  console.log("this is the peer id : ", id);
  // joining the room with the specific room id
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  console.log("new user connected");
  console.log("this is the other user id : ", userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log("element is created");
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  // video is the element of type video in HTML
  // stream in the variable container your audio & video data
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // videoGrid is the div which is get by ID
  videoGrid.append(video);
};

let text = $("input");

document.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && text.val().length !== 0) {
    console.log("enter is pressed");
    socket.emit("message", text.val());
    text.val("");
  }
});

// socket. on ---> receive data.
// while
// socket.emit ---> sends.data.

socket.on("createMessage", (message) => {
  console.log("this is the message coming from the server", message);
  $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  scrolltoBottom();
});

const scrolltoBottom = () => {
  let d = $(".chat__window");
  d.scrollTop(d.prop("scrollHeight"));
};

// mute out video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
  <span>Mute</span>
  `;

  document.querySelector(".mute__button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `;

  document.querySelector(".mute__button").innerHTML = html;
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i>
  <span>Stop Video</span>
  `;

  document.querySelector(".video__button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i>
  <span>Play Video</span>
  `;

  document.querySelector(".video__button").innerHTML = html;
};
