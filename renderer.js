console.log("renderer 1st line runned..");
//import { clipboard } from 'electron';
const { clipboard, ipcRenderer } = require("electron");
const Store = require("electron-store");
const store = new Store();
let data = store.store;

// to display the list on start
window.addEventListener("load", () => {
  console.log("windows loadedd...");
  updateList();
  copyClick();
});

//update list function
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

//create list function
function createList(key, data) {
  const list = document.getElementById("list");
  let item = document.createElement("li");
  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "text-wrap",
    "position-relative"
  );
  //item.textContent = data;
  item.appendChild(document.createTextNode(data));
  store.set(key, data);

  //delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn")
  //deleteBtn.textContent = "Delete";
  //deleteBtn.appendChild(document.createTextNode("DELETE"));

  let icon = document.createElement("i");
  icon.classList.add("bi","bi-trash","bt");
  deleteBtn.appendChild(icon);
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
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
  copyClick();
});

//log all store data
let btn = document.getElementById("showData");
btn.addEventListener("click", () => {
  let data = store.store;
  console.log("all data==", data);
});

// Updated copy function
function copyClick() {
  // Remove existing click event listeners from list items
  let nodes = document.getElementById("list").childNodes;
  nodes.forEach((node) => {
    if (node.nodeType === 1) {
      node.removeEventListener("click", handleListItemClick);
      node.addEventListener("click", handleListItemClick);
    }
  });

  // New click event handler for list items
  function handleListItemClick() {
    console.log("the text is == ", this.childNodes[0].textContent);
    clipboard.writeText(this.childNodes[0].textContent);

   let d =  document.createElement("div");
   d.classList.add( "customAlert","alert","alert-success","col-3","text-center","m-0","p-0");
   d.textContent = 'copied!!!';

   this.appendChild(d);
  setTimeout(() => {
    this.removeChild(d);
  }, 500);
  }

}
