const socket = io();
socket.on("connect", () => {
  query = window.location.search;
  object = new URLSearchParams(query);

  let params = {
    name: object.get("displayer"),
    room: object.get("room"),
  };

  const li = document.createElement("li");
  li.classList.add("shadow");
  li.classList.add("text-center");
  li.innerHTML = `You have Joined in the ${params.room} Room`;
  document.getElementById("textbox").appendChild(li);

  socket.on("people", (msg) => {
    let people = document.getElementById("peoples");
    people.innerHTML = "";
    for (let i = 0; i < msg.length; i++) {
      let li = document.createElement("li");
      li.classList.add("border");
      li.classList.add("rounded-4");
      li.classList.add("py-2");
      li.classList.add("list-unstyled");
      li.classList.add("text-center");
      li.classList.add("h5");

      li.innerHTML = msg[i];
      people.appendChild(li);
    }
  });

  socket.emit("join", params, (call) => {
    if (call) {
      window.location.href = "/index.html";
      return alert(err);
    } else {
      console.log("Joined");
    }
  });
  // socket.emit(
  //   "clientMsg",
  //   {
  //     from: "daniel prince",
  //     message: "Hi Bro ...!",
  //   },
  //   (msg) => {
  //     console.log("This is Callback");
  //     console.log(msg);
  //   }
  // );
  // // socket.on("for_all", (message) => {
  // //   console.log("User added ", message);
  // // });

  document.getElementById("submitbtn").addEventListener("click", (e) => {
    e.preventDefault();
    const message = document.getElementById("messagebox").value;
    const li = document.createElement("li");
    li.classList.add("shadow");
    li.classList.add("text-end");
    li.innerHTML = `${message} : Me`;
    document.getElementById("textbox").appendChild(li);
    messagearea = document.querySelector("ul").lastElementChild;
    messagearea.scrollIntoView();
    socket.emit(
      "message",
      { from: params.name, message: message },
      function () {}
    );

    messagebox("");
  });

  socket.on("serverMsg", (msg, Callback) => {
    console.log("From client : ", msg);
    const li = document.createElement("li");
    li.classList.add("shadow");
    li.innerHTML = `${msg.from} : ${msg.text} `;
    document.getElementById("textbox").appendChild(li);
  });
  console.log("Connected to server..!");
});

let messagebox = (message) =>
  (document.getElementById("messagebox").value = message);

socket.on("message", (msg, callback) => {
  const li = document.createElement("li");

  li.classList.add("shadow");
  li.innerHTML = `${msg.from} : ${msg.message}`;
  if (msg.url) {
    let a = document.createElement("a");
    a.setAttribute("href", msg.url);
    a.setAttribute("target", "_blank");
    a.innerHTML = "My Location";
    document.getElementById("textbox").append(a);
  }
  document.getElementById("textbox").appendChild(li);
  message = document.querySelector("ul").lastElementChild;
  message.scrollIntoView();
});

document.getElementById("locator").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) alert("Geo Location is not Supported");
  console.log(
    navigator.geolocation.getCurrentPosition(
      (position) => {
        socket.emit("location", {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          alt: position.coords.altitude,
        });
      },
      () => {
        alert("Cant fetch Location");
      }
    )
  );
});

document.getElementById("messagebox").addEventListener("keyup", (e) => {
  let value = e.target.value;
  let btn = document.getElementById("submitbtn");
  if (value.trim().length > 0) {
    btn.classList.remove("d-none");
  }
  if (value.trim().length == 0) {
    btn.classList.add("d-none");
  }
});
