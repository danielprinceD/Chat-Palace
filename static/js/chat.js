const socket = io();
socket.on("connect", () => {
  query = window.location.search;
  object = new URLSearchParams(query);

  let params = {
    name: object.get("displayer"),
    room: object.get("room"),
  };

  socket.emit("join", params, (err) => {
    console.log(params);
    if (err) {
      alert(err);
      window.location.href = "/index.html";
    } else {
      console.log("Joined");
    }
  });
  socket.emit(
    "clientMsg",
    {
      from: "daniel prince",
      message: "Hi Bro ...!",
    },
    (msg) => {
      console.log("This is Callback");
      console.log(msg);
    }
  );
  socket.on("for_all", (message) => {
    console.log("User added ", message);
  });
  socket.on("serverMsg", (msg, Callback) => {
    console.log("From client : ", msg);
    const li = document.createElement("li");
    li.classList.add("shadow");
    li.innerHTML = `${msg.from} : ${msg.text} `;
    document.getElementById("textbox").appendChild(li);
    Callback("Yes Iam");
  });
  console.log("Connected to server..!");
});

let messagebox = (message) =>
  (document.getElementById("messagebox").value = message);

socket.on("message", (msg, callback) => {
  console.log(msg);

  const li = document.createElement("li");
  li.classList.add("shadow");
  li.innerHTML = `${msg.from} : ${msg.message} -  - ${new Date().toJSON()}`;
  let a = document.createElement("a");
  a.setAttribute("href", msg.url);
  a.setAttribute("target", "_blank");
  a.innerHTML = "My Location";
  document.getElementById("textbox").append(a);
  document.getElementById("textbox").appendChild(li);
  message = document.querySelector("ul").lastElementChild;
  message.scrollIntoView();
});

document.getElementById("submitbtn").addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.getElementById("messagebox").value;

  socket.emit("message", { from: "user", message: message }, function () {});

  messagebox("");
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
