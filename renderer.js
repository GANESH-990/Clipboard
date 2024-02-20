console.log("renderer 1st line runned..");
//import { clipboard } from 'electron';
const { clipboard, ipcRenderer } = require("electron");
const Store = require("electron-store");
const store = new Store();
let data = store.store;



window.addEventListener("load",()=>{
    console.log("windows loadedd...");
    updateList();
})
 function updateList() {
    const data = store.store;
  //empty inital list
  let list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  for (const key in data) {
    console.log(` displaying---${key}: ${data[key]}`);
    createList(key, data[key]);
  }
}

function createList(key, data) {
  const list = document.getElementById("list");
  let item = document.createElement("li");
  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "bg-primary",
    "col-10",
    "text-wrap"
  );
  item.textContent = data;
  store.set(key, data);

  //delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    store.delete(key);
    document.getElementById("list").removeChild(item);
  });
  item.appendChild(deleteBtn);
  list.appendChild(item);
}

//clear all the data logiv
const clearDataBtn = document.getElementById("clearData");
clearDataBtn.addEventListener("click", () => {
   store.clear();
  console.log("store cleared...");
  updateList();
});

const alwaysOnTopToggle = document.getElementById("alwaysOnTopToggle");
console.log(alwaysOnTopToggle);
alwaysOnTopToggle.addEventListener("change", () => {
  const alwaysOnTop = alwaysOnTopToggle.checked;
  ipcRenderer.send("toggle-always-on-top", alwaysOnTop);
});

//add to list logic
const button = document.getElementById("addToListBtn");
button.addEventListener("click", () => {
  const input = document.getElementById("myInput");
  const currentTime = Date.now();
  createList(currentTime.toString(), input.value);
  input.value = "";
});

//log all store data
let btn = document.getElementById("showData");
btn.addEventListener("click", () => {
  let data = store.store;
  console.log("all data==", data);
  console.log(Array.isArray(data));
});
