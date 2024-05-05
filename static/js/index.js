const socket = io();
socket.on("connect", () => {
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
    li.innerHTML = `${msg.from} : ${msg.text} `;
    document.querySelector("body").appendChild(li);
    Callback("Yes Iam");
  });
  console.log("Connected to server..!");
});

let messagebox = (message) =>
  (document.getElementById("messagebox").value = message);

socket.on("message", (msg, callback) => {
  console.log(msg);

  const li = document.createElement("li");
  li.innerHTML = `${msg.from} : ${msg.message} -  - ${new Date().toJSON()}`;
  document.querySelector("body").appendChild(li);
});

document.getElementById("submitbtn").addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.getElementById("messagebox").value;

  socket.emit("message", { from: "user", message: message }, function () {});

  messagebox("");
});
