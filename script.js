var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var terminalScreen = document.querySelector("#terminal");
var terminalScreenClose = document.querySelector("#terminalclose");
var terminalScreenOpen = document.querySelector("#terminalopen");

var notesScreen = document.querySelector("#notes");
var notesScreenClose = document.querySelector("#notesclose");
var notesScreenOpen = document.querySelector("#notesopen");

var photosScreen = document.querySelector("#photos");
var photosScreenClose = document.querySelector("#photosclose");
var photosScreenOpen = document.querySelector("#photosopen");

var filesScreen = document.querySelector("#files");
var filesScreenClose = document.querySelector("#filesclose");
var filesScreenOpen = document.querySelector("#filesopen");

var topBar = document.querySelector("#topbar");
var activeAppLabel = document.querySelector("#activeApp");
var toastEl = document.querySelector("#toast");

var selectedIcon = undefined;
var biggestIndex = 1;

var noteContent = [
  {
    id: 0,
    title: "welcome.txt",
    content: "Welcome to EJOos Notes Editor!\nYou can edit this note or create new notes."
  }
];

var currentNoteId = 0;

var photoContent = [
  {
    name: "retro_red.png",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23180507'/><circle cx='200' cy='150' r='80' fill='%23e63946'/><text x='200' y='155' fill='%23ffffff' font-family='monospace' font-size='20' text-anchor='middle'>EJOos Red</text></svg>"
  }
];

initializeWindow("welcome");
initializeWindow("terminal");
initializeWindow("notes");
initializeWindow("photos");
initializeWindow("files");

openWindow(welcomeScreen);
openWindow(terminalScreen);

setInterval(updateTime, 1000);
updateTime();

setupTerminal();
setupNotesApp();
setupPhotosApp();
setupFilesApp();

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  handleIconTap(welcomeScreenOpen, welcomeScreen);
});

terminalScreenClose.addEventListener("click", function() {
  closeWindow(terminalScreen);
});

terminalScreenOpen.addEventListener("click", function() {
  handleIconTap(terminalScreenOpen, terminalScreen);
});

notesScreenClose.addEventListener("click", function() {
  closeWindow(notesScreen);
});

notesScreenOpen.addEventListener("click", function() {
  handleIconTap(notesScreenOpen, notesScreen);
});

photosScreenClose.addEventListener("click", function() {
  closeWindow(photosScreen);
});

photosScreenOpen.addEventListener("click", function() {
  handleIconTap(photosScreenOpen, photosScreen);
});

filesScreenClose.addEventListener("click", function() {
  closeWindow(filesScreen);
});

filesScreenOpen.addEventListener("click", function() {
  handleIconTap(filesScreenOpen, filesScreen);
});

function updateTime() {
  var timeText = document.querySelector("#timeElement");
  if (timeText) {
    var now = new Date();
    timeText.innerHTML = now.toLocaleDateString() + " " + now.toLocaleTimeString();
  }
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(function() {
    toastEl.classList.remove("show");
  }, 2000);
}

function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 10;
  var title = element.querySelector(".headertext");
  if (title && activeAppLabel) {
    activeAppLabel.textContent = title.textContent;
  }
}

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
  selectedIcon = undefined;
}

function handleIconTap(element, screen) {
  if (element.classList.contains("selected")) {
    openWindow(screen);
    deselectIcon(element);
  } else {
    selectIcon(element);
  }
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 10;
  var title = element.querySelector(".headertext");
  if (title && activeAppLabel) {
    activeAppLabel.textContent = title.textContent;
  }
  deselectIcon(selectedIcon);
}

function initializeWindow(elementId) {
  var screen = document.querySelector("#" + elementId);
  addWindowTapHandling(screen);
  dragElement(screen);
}

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  var header = document.getElementById(element.id + "header");
  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = performDrag;
  }

  function performDrag(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";

    if (element.offsetTop < 40) {
      element.style.top = "40px";
    }
    if (element.offsetTop > window.innerHeight - 50) {
      element.style.top = (window.innerHeight - 50) + "px";
    }
    if (element.offsetLeft < 50) {
      element.style.left = "50px";
    }
    if (element.offsetLeft > window.innerWidth - 50) {
      element.style.left = (window.innerWidth - 50) + "px";
    }
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function setupTerminal() {
  var out = document.querySelector("#terminalOutput");
  var input = document.querySelector("#terminalInput");

  function printLine(text) {
    var d = document.createElement("div");
    d.className = "line";
    d.textContent = text;
    out.appendChild(d);
    out.parentElement.scrollTop = out.parentElement.scrollHeight;
  }

  printLine("Welcome to EJOos version 1");
  printLine("Type 'help' for available commands.\n");

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      var command = input.value.trim();
      printLine("guest@ejoos:$ " + command);
      input.value = "";

      var rawCmd = command.toLowerCase();
      var parts = command.split(" ");
      var cmd = parts[0].toLowerCase();
      var args = parts.slice(1).join(" ");

      if (rawCmd === "help") {
        printLine("COMMAND LIST:");
        printLine("  about         - Display operating system specs and info");
        printLine("  list / ls     - List all stored document files");
        printLine("  cat <file>    - Read and display content of a file");
        printLine("  open <app>    - Launch an app (welcome, notes, photos, files)");
        printLine("  date          - Display current system date and time");
        printLine("  whoami        - Print active user identity");
        printLine("  clear         - Clear terminal output screen");
        return;
      }

      if (rawCmd === "about") {
        printLine("OS Name: EJOos");
        printLine("Version: 1.0.0");
        printLine("Kernel: EJOos Kernel VFS 1.0.0");
        printLine("Architecture: x86_64 Web Virtual Environment");
        printLine("Status: Active & Operating");
        return;
      }

      if (rawCmd === "ls" || rawCmd === "list") {
        printLine("STORED DOCUMENTS:");
        noteContent.forEach(function(note) {
          printLine("  📄 " + note.title);
        });
        return;
      }

      switch (cmd) {
        case "open":
          var targetApp = args.toLowerCase();
          if (targetApp === "welcome") {
            openWindow(welcomeScreen);
            printLine("Opened Welcome window.");
          } else if (targetApp === "notes") {
            openWindow(notesScreen);
            printLine("Opened Notes app.");
          } else if (targetApp === "photos") {
            openWindow(photosScreen);
            printLine("Opened Photos app.");
          } else if (targetApp === "files") {
            openWindow(filesScreen);
            printLine("Opened Files app.");
          } else {
            printLine("Unknown application: " + args + ". Valid targets: welcome, notes, photos, files");
          }
          break;
        case "whoami":
          printLine("guest");
          break;
        case "date":
          printLine(new Date().toLocaleString());
          break;
        case "clear":
          out.innerHTML = "";
          break;
        case "cat":
          if (args) {
            var found = noteContent.find(function(n) { return n.title.toLowerCase() === args.toLowerCase(); });
            if (found) {
              printLine(found.content);
            } else {
              printLine("cat: " + args + ": File not found. Type 'list' to view files.");
            }
          } else {
            printLine("Usage: cat <filename>");
          }
          break;
        default:
          if (cmd !== "") {
            printLine("Command not found: '" + command + "'. Type 'help' for available commands.");
          }
      }
    }
  });
}

function setupNotesApp() {
  var listEl = document.querySelector("#notesList");
  var titleInput = document.querySelector("#noteTitleInput");
  var contentInput = document.querySelector("#noteContentInput");
  var saveBtn = document.querySelector("#saveNoteBtn");
  var newBtn = document.querySelector("#newNoteBtn");

  function renderList() {
    listEl.innerHTML = "";
    noteContent.forEach(function(note) {
      var item = document.createElement("div");
      item.className = "note-item" + (note.id === currentNoteId ? " active" : "");
      item.textContent = note.title;
      item.addEventListener("click", function() {
        loadNote(note.id);
      });
      listEl.appendChild(item);
    });
  }

  function loadNote(id) {
    currentNoteId = id;
    var note = noteContent.find(function(n) { return n.id === id; });
    if (note) {
      titleInput.value = note.title;
      contentInput.value = note.content;
    }
    renderList();
  }

  saveBtn.addEventListener("click", function() {
    var title = titleInput.value.trim() || "Untitled.txt";
    var content = contentInput.value;

    var existing = noteContent.find(function(n) { return n.id === currentNoteId; });
    if (existing) {
      existing.title = title;
      existing.content = content;
      showToast("Updated note: " + title);
    } else {
      var newId = Date.now();
      noteContent.push({ id: newId, title: title, content: content });
      currentNoteId = newId;
      showToast("Saved note: " + title);
    }
    renderList();
    setupFilesApp();
  });

  newBtn.addEventListener("click", function() {
    currentNoteId = -1;
    titleInput.value = "NewNote.txt";
    contentInput.value = "";
    renderList();
  });

  loadNote(0);
}

function setupPhotosApp() {
  var listEl = document.querySelector("#photosList");
  var viewer = document.querySelector("#photoViewer");
  var caption = document.querySelector("#photoCaption");

  function renderPhotos() {
    listEl.innerHTML = "";
    photoContent.forEach(function(photo, idx) {
      var item = document.createElement("div");
      item.className = "photo-item" + (idx === 0 ? " active" : "");
      item.textContent = photo.name;
      item.addEventListener("click", function() {
        document.querySelectorAll(".photo-item").forEach(function(el) { el.classList.remove("active"); });
        item.classList.add("active");
        viewer.src = photo.url;
        caption.textContent = photo.name;
      });
      listEl.appendChild(item);
    });

    if (photoContent.length > 0) {
      viewer.src = photoContent[0].url;
      caption.textContent = photoContent[0].name;
    }
  }

  renderPhotos();
}

function setupFilesApp() {
  var grid = document.querySelector("#filesGrid");
  grid.innerHTML = "";

  var items = [
    { name: "Documents", type: "folder" },
    { name: "Images", type: "folder" }
  ];

  noteContent.forEach(function(note) {
    items.push({ name: note.title, type: "file" });
  });

  items.forEach(function(item) {
    var node = document.createElement("div");
    node.className = "file-node";
    node.innerHTML = "<div class='icon'>" + (item.type === "folder" ? "📁" : "📄") + "</div><div>" + item.name + "</div>";
    
    node.addEventListener("dblclick", function() {
      if (item.type === "file") {
        var found = noteContent.find(function(n) { return n.title === item.name; });
        if (found) {
          openWindow(notesScreen);
        }
      }
    });

    grid.appendChild(node);
  });
}
