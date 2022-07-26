const socket = io.connect("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
// create a peer
// undefined is the id, created automatically by peer js.
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
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
  $("ul").scrollTop($("ul")[0].scrollHeight);
};

const copyurl = () => {
  var inputc = document.body.appendChild(document.createElement("input"));
  inputc.value = window.location.href;
  inputc.focus();
  inputc.select();
  document.execCommand("copy");
  inputc.parentNode.removeChild(inputc);
  alert("URL Copied. Share it with other person");
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

// Title Animation

window.onload = function () {
  var container = document.getElementById("container");

  var cW = container.offsetWidth;
  var cH = container.offsetHeight;
  var gravity = 2.55;
  var lifespan1 = 100;
  var lifespan2 = 150;
  var ground = 0.3 * cH;
  var startX;
  var r = 38;
  var speedX;
  var speedYDown = 3;
  var speedYUp = 15;
  var fontSize = 32;
  if (cW > 500) {
    startX = 0.25 * cW;
    speedX = 0.005 * cW;
  } else {
    startX = 0.15 * cW;
    speedX = 0.007 * cW;
  }

  // Ball object
  var Ball = function (sLetter, index) {
    this.sLetter = sLetter;
    this.node;
    this.x = startX;
    this.y = ground - 50;
    this.index = index;
    this.r = r;
    this.jumpN = 0;
    this.speedY = speedYDown;
    this.speedX = speedX;
    this.opa = 1;
    this.create();
  };

  Ball.prototype = {
    create: function () {
      this.node = document.createElement("div");
      this.node.className = "ball";
      this.node.style.width = this.r + "px";
      this.node.style.height = this.r + "px";
      this.node.style.left = this.x + "px";
      this.node.style.top = this.y + "px";
      this.node.innerHTML = this.sLetter;
      container.appendChild(this.node);
      this.node.style.fontSize = fontSize + "px";
    },
    move: function () {
      this.y += this.speedY;
      this.x += this.speedX;
    },
    display: function () {
      //this.node.style.transform = "translate("+ this.x + "px," + this.y + "px)";
      //this.node.style.top = this.y + "px";
      //this.node.style.left = this.x + "px";
      this.node.style.top = (this.y / cH) * 100 + "%";
      this.node.style.left = (this.x / cW) * 100 + "%";
    },
  };

  // TextBall object
  var TextBalls = function (sText) {
    this.sText = sText + " ";
    this.n = sText.length + 1;
    this.balls = [];
    this.timeIntv = null;
    this.life = 0;
    this.createBalls();
  };
  TextBalls.prototype = {
    createBalls: function () {
      for (var i = 0; i < this.n; i++) {
        var ball = new Ball(this.sText[i], i);
        this.balls.push(ball);
      }
      this.balls[this.n - 1].node.className = "cover";
      this.balls[this.n - 1].xTarget = cW;
    },

    move: function () {
      var thisObj = this;
      this.timeIntv = setInterval(function () {
        thisObj.life++;
        if (thisObj.life < lifespan2) {
          for (var i = 0; i < thisObj.n; i++) {
            var ball = thisObj.balls[i];
            if (ball.y < ground) {
              ball.speedY += gravity;
            } else {
              ball.y = ground;
              if (ball.jumpN < i || i == thisObj.n - 1) {
                ball.jumpN++;
                ball.speedY = -speedYUp;
              } else {
                ball.speedY = 0;
                ball.speedX = 0;
              }
            }

            ball.move();
            ball.display();
          }
          if (thisObj.life > lifespan1) {
            var coverB1 = thisObj.balls[thisObj.n - 1];
            coverB1.opa = coverB1.opa > 0 ? coverB1.opa - 0.025 : 0;
            coverB1.node.style.opacity = coverB1.opa;
          }
        } else {
          clearInterval(thisObj.timeIntv);
        }
      }, 50);
    },
  };

  var tb = new TextBalls("BIT MEET");
  tb.move();
};
