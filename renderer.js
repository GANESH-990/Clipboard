console.log("renderer 1st line runned..");
//import { clipboard } from 'electron';
const { clipboard, nativeImage, ipcRenderer } = require("electron");
const fs = require('fs');

const Store = require("electron-store");
const store = new Store();
let data = store.store;

// to display the list on start
window.addEventListener("load", () => {
  console.log("windows loadedd...");
  updateList();
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

  if(typeof data === "string"){
    store.set(key, data);
    item.appendChild(document.createTextNode(data));
  }
  else{
    store.set(key,data);
    item.appendChild(document.createTextNode(data.name));
  }

  item.addEventListener("click",()=>{
    console.log("button clicked.....",data);
    if(typeof data === "object"){
        const path = data.path;
        if(path.endsWith(".png") || path.endsWith(".jpeg")){
            const img = nativeImage.createFromPath(path);
            clipboard.writeImage(img);
        }
        else{
            fs.readFile(path,(err,data)=>{
                if(err){
                    console.log("can't read file=",err);
                    return 0;
                }
                clipboard.writeBuffer('application/pdf',data);
                console.log(" file copied.....")
            })
        }

    }
    else{
        clipboard.writeText(data);
    }


       let d =  document.createElement("div");
    d.classList.add( "customAlert","alert","alert-success","col-3","text-center","m-0","p-0");
    d.textContent = 'copied!!!';

   item.appendChild(d);
  setTimeout(() => {
    item.removeChild(d);
  }, 500);
  })


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
  console.log("-------stored data-----------");
  console.log(data);
  console.log("------------------------------");
});



//----------------------------file-------------------------------------------


const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change",(event)=>{

    console.log(event.target.files);
    if(event.target.files[0].name.endsWith(".png") || event.target.files[0].name.endsWith(".jpeg")){
        handleDroppedFiles( Date.now().toString(),event.target.files);
    }
    else{
        console.log("please select correct file format");
    }
    
})

function handleDroppedFiles( key,files) {
    // Handle the dropped files as needed
    for (const file of files) {
        const fileName = file.name;
        const filePath = file.path;

        // Store the file information in Electron Store
        // store.set(key, {
        //     name: fileName,
        //     path: filePath
        // });
        createList(key,{
            name: fileName,
            path: filePath
        })

        // Add your logic to further process the file as needed
        // For example, you might want to display or read the file content
        console.log(`File uploaded: ${fileName}`);
    
    }
}