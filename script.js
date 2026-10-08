function getSavedData(key, fallback) {
  try {
    var stored = localStorage.getItem("EJOOS_" + key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem("EJOOS_" + key, JSON.stringify(value));
  } catch (e) {}
}

var sfxEnabled = getSavedData("sfx", true);
var audioCtx = null;

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

var calcScreen = document.querySelector("#calculator");
var calcScreenClose = document.querySelector("#calculatorclose");
var calcScreenOpen = document.querySelector("#calcopen");

var paintScreen = document.querySelector("#paint");
var paintScreenClose = document.querySelector("#paintclose");
var paintScreenOpen = document.querySelector("#paintopen");

var snakeScreen = document.querySelector("#snake");
var snakeScreenClose = document.querySelector("#snakeclose");
var snakeScreenOpen = document.querySelector("#snakeopen");

var minesScreen = document.querySelector("#minesweeper");
var minesScreenClose = document.querySelector("#minesweeperclose");
var minesScreenOpen = document.querySelector("#minesopen");

var cameraScreen = document.querySelector("#camera");
var cameraScreenClose = document.querySelector("#cameraclose");
var cameraScreenOpen = document.querySelector("#cameraopen");

var musicScreen = document.querySelector("#music");
var musicScreenClose = document.querySelector("#musicclose");
var musicScreenOpen = document.querySelector("#musicopen");

var browserScreen = document.querySelector("#browser");
var browserScreenClose = document.querySelector("#browserclose");
var browserScreenOpen = document.querySelector("#browseropen");

var chatScreen = document.querySelector("#chat");
var chatScreenClose = document.querySelector("#chatclose");
var chatScreenOpen = document.querySelector("#chatopen");

var settingsScreen = document.querySelector("#settings");
var settingsScreenClose = document.querySelector("#settingsclose");
var settingsScreenOpen = document.querySelector("#settingsopen");

var taskScreen = document.querySelector("#taskmanager");
var taskScreenClose = document.querySelector("#taskmanagerclose");
var taskScreenOpen = document.querySelector("#taskopen");

var topBar = document.querySelector("#topbar");
var activeAppLabel = document.querySelector("#activeApp");
var toastEl = document.querySelector("#toast");
var sfxToggleBtn = document.querySelector("#sfxToggleBtn");

var selectedIcon = undefined;
var biggestIndex = 10;
var currentFolder = "root";
var currentUser = getSavedData("user", "guest");
var currentTheme = getSavedData("theme", "main");
var currentBg = getSavedData("bg", "");
var activePhotoUrl = "";
var browserHistory = ["ejoos://home"];

var guestbookMessages = getSavedData("guestbook", [
  { id: 1, user: "admin", text: "Thanks for visiting EJOos web desktop!" }
]);

var noteContent = getSavedData("notes", [
  {
    id: 0,
    title: "welcome.txt",
    content: "Welcome to EJOos Notes Editor!\nYou can edit this note or create new notes."
  }
]);

var currentNoteId = 0;

var photoContent = getSavedData("photos", [
  {
    name: "retro_red.png",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23180507'/><circle cx='200' cy='150' r='80' fill='%23e63946'/><text x='200' y='155' fill='%23ffffff' font-family='monospace' font-size='20' text-anchor='middle'>EJOos Red</text></svg>"
  }
]);

var allWindows = [
  { id: "welcome", el: welcomeScreen, name: "Welcome" },
  { id: "terminal", el: terminalScreen, name: "Terminal" },
  { id: "notes", el: notesScreen, name: "Notes Editor" },
  { id: "photos", el: photosScreen, name: "EJOos Photos" },
  { id: "files", el: filesScreen, name: "File System" },
  { id: "calculator", el: calcScreen, name: "Calculator" },
  { id: "paint", el: paintScreen, name: "Pixel Paint" },
  { id: "snake", el: snakeScreen, name: "Retro Snake" },
  { id: "minesweeper", el: minesScreen, name: "Minesweeper" },
  { id: "camera", el: cameraScreen, name: "Retro Camera" },
  { id: "music", el: musicScreen, name: "Music Player" },
  { id: "browser", el: browserScreen, name: "Retro Browser" },
  { id: "chat", el: chatScreen, name: "Chatbot" },
  { id: "settings", el: settingsScreen, name: "System Settings" },
  { id: "taskmanager", el: taskScreen, name: "Task Manager" }
];

var loadNoteInEditor = function() {};
var renderTaskList = function() {};


function playSfx(type) {
  if (!sfxEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    var now = audioCtx.currentTime;
    if (type === "click") {
      osc.type = "square";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "open") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "close") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "boom") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {}
}

// Initial state application
applySavedSettings();

initializeWindow("welcome");
initializeWindow("terminal");
initializeWindow("notes");
initializeWindow("photos");
initializeWindow("files");
initializeWindow("calculator");
initializeWindow("paint");
initializeWindow("snake");
initializeWindow("minesweeper");
initializeWindow("camera");
initializeWindow("music");
initializeWindow("browser");
initializeWindow("chat");
initializeWindow("settings");
initializeWindow("taskmanager");

openWindow(welcomeScreen);
openWindow(terminalScreen);

setInterval(updateTime, 1000);
updateTime();

setupTerminal();
setupNotesApp();
setupPhotosApp();
setupFilesApp();
setupCalculator();
setupPaint();
setupSnake();
setupMinesweeper();
setupDesktopSudokuGadget();
setupCamera();
setupMusic();
setupBrowser();
setupChatbot();
setupSettings();
setupTaskManager();

if (sfxToggleBtn) {
  sfxToggleBtn.textContent = sfxEnabled ? "🔊 SFX ON" : "🔇 SFX OFF";
  sfxToggleBtn.addEventListener("click", function() {
    sfxEnabled = !sfxEnabled;
    saveData("sfx", sfxEnabled);
    sfxToggleBtn.textContent = sfxEnabled ? "🔊 SFX ON" : "🔇 SFX OFF";
    showToast(sfxEnabled ? "System audio enabled" : "System audio muted");
  });
}

document.addEventListener("click", function(e) {
  if (!e.target.closest(".app-icon")) {
    deselectIcon(selectedIcon);
  }
});

welcomeScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(welcomeScreen); });
welcomeScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(welcomeScreen); });

terminalScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(terminalScreen); });
terminalScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(terminalScreen); });

notesScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(notesScreen); });
notesScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(notesScreen); });

photosScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(photosScreen); });
photosScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(photosScreen); });

filesScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(filesScreen); });
filesScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(filesScreen); });

calcScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(calcScreen); });
calcScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(calcScreen); });

paintScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(paintScreen); });
paintScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(paintScreen); });

snakeScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(snakeScreen); });
snakeScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(snakeScreen); });

minesScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(minesScreen); });
minesScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(minesScreen); });

cameraScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(cameraScreen); });
cameraScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(cameraScreen); });

musicScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(musicScreen); });
musicScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(musicScreen); });

browserScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(browserScreen); });
browserScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(browserScreen); });

chatScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(chatScreen); });
chatScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(chatScreen); });

settingsScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(settingsScreen); });
settingsScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(settingsScreen); });

taskScreenClose.addEventListener("click", function(e) { e.stopPropagation(); closeWindow(taskScreen); });
taskScreenOpen.addEventListener("click", function(e) { e.stopPropagation(); openWindow(taskScreen); });

function applySavedSettings() {
  var body = document.querySelector("#desktopBody");
  body.className = currentTheme;
  if (currentBg) {
    body.style.backgroundImage = "url('" + currentBg + "')";
    body.style.backgroundSize = "cover";
  }
}

function updateTime() {
  var timeText = document.querySelector("#timeElement");
  if (timeText) {
    var now = new Date();
    timeText.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString();
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
  if (!element) return;
  playSfx("close");
  element.style.display = "none";
  renderTaskList();
}

function openWindow(element) {
  if (!element) return;
  playSfx("open");
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = 9999;
  var title = element.querySelector(".headertext");
  if (title && activeAppLabel) {
    activeAppLabel.textContent = title.textContent;
  }
  renderTaskList();
}

function selectIcon(element) {
  if (selectedIcon && selectedIcon !== element) {
    deselectIcon(selectedIcon);
  }
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
  selectedIcon = undefined;
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = 9999;
  var title = element.querySelector(".headertext");
  if (title && activeAppLabel) {
    activeAppLabel.textContent = title.textContent;
  }
  deselectIcon(selectedIcon);
}

function initializeWindow(elementId) {
  var screen = document.querySelector("#" + elementId);
  if (!screen) return;
  screen.style.position = "absolute";
  addWindowTapHandling(screen);
  dragElement(screen);
}

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");
  var dragTarget = header || element;

  dragTarget.onmousedown = startDragging;

  function startDragging(e) {
    e = e || window.event;
    if (e.target.classList.contains("closebutton") || e.target.closest(".closebutton") || e.target.tagName === "INPUT" || e.target.tagName === "BUTTON" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      return;
    }
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

    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;

    if (newTop < 40) newTop = 40;
    if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
    if (newLeft < 10) newLeft = 10;
    if (newLeft > window.innerWidth - 50) newLeft = window.innerWidth - 50;

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
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
      playSfx("click");
      var command = input.value.trim();
      printLine(currentUser + "@ejoos:$ " + command);
      input.value = "";

      var rawCmd = command.toLowerCase();
      var parts = command.split(" ");
      var cmd = parts[0].toLowerCase();
      var args = parts.slice(1).join(" ");

      if (rawCmd === "help") {
        printLine("COMMAND LIST:");
        printLine("  about         - Display operating system specs and info");
        printLine("  matrix        - Toggle simulated hacker stream");
        printLine("  list / ls     - List all stored document files");
        printLine("  cat <file>    - Read and display content of a file");
        printLine("  open <app>    - Launch an app (welcome, notes, photos, files, calc, paint, snake, mines, camera, music, browser, chatbot, settings, tasks)");
        printLine("  date          - Display current system date and time");
        printLine("  whoami        - Print active user identity");
        printLine("  clear         - Clear terminal output screen");
        return;
      }

      if (rawCmd === "matrix") {
        printLine("Initializing stream... Press enter to stop.");
        var matrixTimer = setInterval(function() {
          var chars = "010101010101ABCDEF";
          var line = "";
          for (var i = 0; i < 35; i++) line += chars[Math.floor(Math.random() * chars.length)];
          printLine(line);
        }, 100);

        var stopMatrix = function(evt) {
          if (evt.key === "Enter") {
            clearInterval(matrixTimer);
            window.removeEventListener("keydown", stopMatrix);
            printLine("Matrix stream halted.");
          }
        };
        window.addEventListener("keydown", stopMatrix);
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
          if (targetApp === "welcome") openWindow(welcomeScreen);
          else if (targetApp === "notes") openWindow(notesScreen);
          else if (targetApp === "photos") openWindow(photosScreen);
          else if (targetApp === "files") openWindow(filesScreen);
          else if (targetApp === "calc" || targetApp === "calculator") openWindow(calcScreen);
          else if (targetApp === "paint") openWindow(paintScreen);
          else if (targetApp === "snake") openWindow(snakeScreen);
          else if (targetApp === "mines" || targetApp === "minesweeper") openWindow(minesScreen);
          else if (targetApp === "camera") openWindow(cameraScreen);
          else if (targetApp === "music") openWindow(musicScreen);
          else if (targetApp === "browser") openWindow(browserScreen);
          else if (targetApp === "chat" || targetApp === "chatbot") openWindow(chatScreen);
          else if (targetApp === "settings") openWindow(settingsScreen);
          else if (targetApp === "tasks" || targetApp === "taskmanager") openWindow(taskScreen);
          else printLine("Unknown application: " + args);
          break;
        case "whoami":
          printLine(currentUser);
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
  var deleteBtn = document.querySelector("#deleteNoteBtn");
  var newBtn = document.querySelector("#newNoteBtn");  

  function renderList() {
    listEl.innerHTML = "";
    noteContent.forEach(function(note) {
      var item = document.createElement("div");
      item.className = "note-item" + (note.id === currentNoteId ? " active" : "");
      item.textContent = note.title;
      item.addEventListener("click", function() {
        playSfx("click");
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

  loadNoteInEditor = loadNote;

  saveBtn.addEventListener("click", function() {
    playSfx("click");
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
    saveData("notes", noteContent);
    renderList();
    setupFilesApp();
  });

  deleteBtn.addEventListener("click", function() {
    playSfx("click");
    noteContent = noteContent.filter(function(n) { return n.id !== currentNoteId; });
    saveData("notes", noteContent);
    if (noteContent.length > 0) {
      loadNote(noteContent[0].id);
    } else {
      currentNoteId = -1;
      titleInput.value = "";
      contentInput.value = "";
      renderList();
    }
    setupFilesApp();
    showToast("Note deleted");
  });

  newBtn.addEventListener("click", function() {
    playSfx("click");
    currentNoteId = -1;
    titleInput.value = "NewNote.txt";
    contentInput.value = "";
    renderList();
  });

  if (noteContent.length > 0) loadNote(noteContent[0].id);
}

function setupPhotosApp() {
  var listEl = document.querySelector("#photosList");
  var viewer = document.querySelector("#photoViewer");
  var caption = document.querySelector("#photoCaption");
  var setWallBtn = document.querySelector("#setWallpaperBtn");

  function renderPhotos() {
    listEl.innerHTML = "";
    photoContent.forEach(function(photo, idx) {
      var item = document.createElement("div");
      item.className = "photo-item" + (idx === 0 ? " active" : "");
      item.textContent = photo.name;
      item.addEventListener("click", function() {
        playSfx("click");
        document.querySelectorAll(".photo-item").forEach(function(el) { el.classList.remove("active"); });
        item.classList.add("active");
        viewer.src = photo.url;
        caption.textContent = photo.name;
        activePhotoUrl = photo.url;
      });
      listEl.appendChild(item);
    });

    if (photoContent.length > 0) {
      viewer.src = photoContent[0].url;
      caption.textContent = photoContent[0].name;
      activePhotoUrl = photoContent[0].url;
    }
  }

  setWallBtn.addEventListener("click", function() {
    playSfx("click");
    if (activePhotoUrl) {
      var body = document.querySelector("#desktopBody");
      body.style.backgroundImage = "url('" + activePhotoUrl + "')";
      body.style.backgroundSize = "cover";
      currentBg = activePhotoUrl;
      saveData("bg", currentBg);
      showToast("Set photo as wallpaper!");
    }
  });

  renderPhotos();
}

function setupFilesApp() {
  var grid = document.querySelector("#filesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  var items = [];

  if (currentFolder !== "root") {
    items.push({ name: "..", type: "back" });
  }

  if (currentFolder === "root") {
    items.push({ name: "Documents", type: "folder" });
    items.push({ name: "Images", type: "folder" });
  } else if (currentFolder === "Documents") {
    noteContent.forEach(function(note) {
      items.push({ name: note.title, type: "file", id: note.id });
    });
  } else if (currentFolder === "Images") {
    photoContent.forEach(function(photo, idx) {
      items.push({ name: photo.name, type: "image", index: idx });
    });
  }

  items.forEach(function(item) {
    var node = document.createElement("div");
    node.className = "file-node";
    
    var icon = "📄";
    if (item.type === "folder") icon = "📁";
    if (item.type === "back") icon = "📁";
    if (item.type === "image") icon = "🖼️";

    var label = item.name;
    if (item.type === "back") label = ".. (Back)";

    node.innerHTML = "<div class='icon'>" + icon + "</div><div>" + label + "</div>";

    node.addEventListener("dblclick", function() {
      playSfx("click");
      if (item.type === "folder") {
        currentFolder = item.name;
        setupFilesApp();
      } else if (item.type === "back") {
        currentFolder = "root";
        setupFilesApp();
      } else if (item.type === "file") {
        var found = noteContent.find(function(n) { return n.id === item.id; });
        if (found) {
          openWindow(notesScreen);
          loadNoteInEditor(found.id);
        }
      } else if (item.type === "image") {
        openWindow(photosScreen);
      }
    });

    grid.appendChild(node);
  });
}

function setupCalculator() {
  var display = document.querySelector("#calcDisplay");
  var expr = "";

  document.querySelectorAll(".calc-btn.num, .calc-btn.op").forEach(function(btn) {
    btn.addEventListener("click", function() {
      playSfx("click");
      var num = btn.getAttribute("data-num");
      var op = btn.getAttribute("data-op");

      if (num !== null) expr += num;
      else if (op !== null) expr += op;
      display.value = expr || "0";
    });
  });

  document.querySelector("#calcClear").addEventListener("click", function() {
    playSfx("click");
    expr = "";
    display.value = "0";
  });

  document.querySelector("#calcDel").addEventListener("click", function() {
    playSfx("click");
    expr = expr.slice(0, -1);
    display.value = expr || "0";
  });

  document.querySelector("#calcEquals").addEventListener("click", function() {
    playSfx("click");
    try {
      if (expr) {
        var sanitizedExpr = expr.replace(/×/g, "*").replace(/÷/g, "/");
        var res = eval(sanitizedExpr);
        display.value = res;
        expr = String(res);
      }
    } catch (err) {
      display.value = "Error";
      expr = "";
    }
  });
}

function setupPaint() {
  var canvas = document.querySelector("#paintCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var painting = false;
  var currentColor = "#e63946";

  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function endPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", draw);

  document.querySelector("#colorRed").addEventListener("click", function() { playSfx("click"); currentColor = "#e63946"; });
  document.querySelector("#colorWhite").addEventListener("click", function() { playSfx("click"); currentColor = "#ffffff"; });
  document.querySelector("#colorBlack").addEventListener("click", function() { playSfx("click"); currentColor = "#080202"; });
  document.querySelector("#clearCanvas").addEventListener("click", function() {
    playSfx("click");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function setupSnake() {
  var canvas = document.querySelector("#snakeCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var scoreEl = document.querySelector("#snakeScore");
  var startBtn = document.querySelector("#startSnakeBtn");

  var gridSize = 10;
  var snake = [{ x: 50, y: 50 }];
  var dx = 10;
  var dy = 0;
  var food = { x: 100, y: 100 };
  var score = 0;
  var gameInterval = null;

  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
  }

  function moveSnake() {
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      playSfx("click");
      score += 10;
      scoreEl.textContent = score;
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
      };
    } else {
      snake.pop();
    }
  }

  function renderGame() {
    ctx.fillStyle = "#080202";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSquare(food.x, food.y, "#ffffff");

    snake.forEach(function(segment) {
      drawSquare(segment.x, segment.y, "#e63946");
    });

    if (
      snake[0].x < 0 || snake[0].x >= canvas.width ||
      snake[0].y < 0 || snake[0].y >= canvas.height
    ) {
      playSfx("boom");
      clearInterval(gameInterval);
      showToast("Game Over! Score: " + score);
    }
  }

  function gameLoop() {
    moveSnake();
    renderGame();
  }

  window.addEventListener("keydown", function(e) {
    if (snakeScreen.style.display !== "none") {
      if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -10; }
      else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 10; }
      else if (e.key === "ArrowLeft" && dx === 0) { dx = -10; dy = 0; }
      else if (e.key === "ArrowRight" && dx === 0) { dx = 10; dy = 0; }
    }
  });

  startBtn.addEventListener("click", function() {
    playSfx("click");
    clearInterval(gameInterval);
    snake = [{ x: 50, y: 50 }];
    dx = 10;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
    gameInterval = setInterval(gameLoop, 100);
  });
}

function setupMinesweeper() {
  var grid = document.querySelector("#minesGrid");
  var resetBtn = document.querySelector("#minesResetBtn");
  var countEl = document.querySelector("#minesCount");
  var timerEl = document.querySelector("#minesTimer");

  var rows = 8, cols = 8, mineCount = 10;
  var board = [], revealedCount = 0, timer = null, timeSeconds = 0, gameOver = false;

  function initBoard() {
    clearInterval(timer);
    timeSeconds = 0;
    revealedCount = 0;
    gameOver = false;
    timerEl.textContent = "⏱️ 000";
    countEl.textContent = "💣 " + mineCount;
    resetBtn.textContent = "🙂";
    grid.innerHTML = "";
    board = [];

    for (var r = 0; r < rows; r++) {
      board[r] = [];
      for (var c = 0; c < cols; c++) {
        board[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
      }
    }

    var placed = 0;
    while (placed < mineCount) {
      var rr = Math.floor(Math.random() * rows);
      var cc = Math.floor(Math.random() * cols);
      if (!board[rr][cc].mine) {
        board[rr][cc].mine = true;
        placed++;
      }
    }

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (!board[r][c].mine) {
          var cnt = 0;
          for (var dr = -1; dr <= 1; dr++) {
            for (var dc = -1; dc <= 1; dc++) {
              var nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) cnt++;
            }
          }
          board[r][c].count = cnt;
        }
      }
    }

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = document.createElement("div");
        cell.className = "mine-cell";
        cell.dataset.r = r;
        cell.dataset.c = c;

        cell.addEventListener("click", function(e) {
          var cr = parseInt(this.dataset.r);
          var cc = parseInt(this.dataset.c);
          revealCell(cr, cc);
        });

        cell.addEventListener("contextmenu", function(e) {
          e.preventDefault();
          var cr = parseInt(this.dataset.r);
          var cc = parseInt(this.dataset.c);
          flagCell(cr, cc);
        });

        grid.appendChild(cell);
      }
    }
  }

  function startTimer() {
    if (!timer) {
      timer = setInterval(function() {
        timeSeconds++;
        timerEl.textContent = "⏱️ " + String(timeSeconds).padStart(3, "0");
      }, 1000);
    }
  }

  function flagCell(r, c) {
    if (gameOver || board[r][c].revealed) return;
    playSfx("click");
    board[r][c].flagged = !board[r][c].flagged;
    var cell = grid.children[r * cols + c];
    cell.textContent = board[r][c].flagged ? "🚩" : "";
  }

  function revealCell(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    startTimer();

    board[r][c].revealed = true;
    revealedCount++;
    var cell = grid.children[r * cols + c];
    cell.classList.add("revealed");

    if (board[r][c].mine) {
      playSfx("boom");
      cell.classList.add("mine");
      cell.textContent = "💣";
      gameOver = true;
      resetBtn.textContent = "😵";
      clearInterval(timer);
      showToast("Game Over!");
      return;
    }

    playSfx("click");
    if (board[r][c].count > 0) {
      cell.textContent = board[r][c].count;
    } else {
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          var nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) revealCell(nr, nc);
        }
      }
    }

    if (revealedCount === rows * cols - mineCount) {
      gameOver = true;
      resetBtn.textContent = "😎";
      clearInterval(timer);
      showToast("You Win Minesweeper!");
    }
  }

  resetBtn.addEventListener("click", function() {
    playSfx("click");
    initBoard();
  });

  initBoard();
}

function setupDesktopSudokuGadget() {
  var gridEl = document.querySelector("#widgetSudokuGrid");
  var newBtn = document.querySelector("#widgetSudokuNewBtn");
  var diffSelect = document.querySelector("#widgetSudokuDiff");
  var eraseBtn = document.querySelector("#widgetSudokuErase");
  var statusEl = document.querySelector("#widgetSudokuStatus");

  if (!gridEl) return;

  var selectedCell = null;

  var easyPuzzles = [
    {
      puzzle: [
        5,3,0,0,7,0,0,0,0,
        6,0,0,1,9,5,0,0,0,
        0,9,8,0,0,0,0,6,0,
        8,0,0,0,6,0,0,0,3,
        4,0,0,8,0,3,0,0,1,
        7,0,0,0,2,0,0,0,6,
        0,6,0,0,0,0,2,8,0,
        0,0,0,4,1,9,0,0,5,
        0,0,0,0,8,0,0,7,9
      ],
      solution: [
        5,3,4,6,7,8,9,1,2,
        6,7,2,1,9,5,3,4,8,
        1,9,8,3,4,2,5,6,7,
        8,5,9,7,6,1,4,2,3,
        4,2,6,8,5,3,7,9,1,
        7,1,3,9,2,4,8,5,6,
        9,6,1,5,3,7,2,8,4,
        2,8,7,4,1,9,6,3,5,
        3,4,5,2,8,6,1,7,9
      ]
    }
  ];

  var mediumPuzzles = [
    {
      puzzle: [
        0,0,0,2,6,0,7,0,1,
        6,8,0,0,7,0,0,9,0,
        1,9,0,0,0,4,5,0,0,
        8,2,0,1,0,0,0,4,0,
        0,0,4,6,0,2,9,0,0,
        0,5,0,0,0,3,0,2,8,
        0,0,9,3,0,0,0,7,4,
        0,4,0,0,5,0,0,3,6,
        7,0,3,0,1,8,0,0,0
      ],
      solution: [
        4,3,5,2,6,9,7,8,1,
        6,8,2,5,7,1,4,9,3,
        1,9,7,8,3,4,5,6,2,
        8,2,6,1,9,5,3,4,7,
        3,7,4,6,8,2,9,1,5,
        9,5,1,7,4,3,6,2,8,
        5,1,9,3,2,6,8,7,4,
        2,4,8,9,5,7,1,3,6,
        7,6,3,4,1,8,2,5,9
      ]
    }
  ];

  var currentPuzzle = [];
  var currentSolution = [];
  var userState = [];

  function loadGame() {
    var diff = diffSelect.value;
    var set = diff === "0" ? easyPuzzles : mediumPuzzles;
    var item = set[Math.floor(Math.random() * set.length)];

    currentPuzzle = item.puzzle;
    currentSolution = item.solution;
    userState = currentPuzzle.slice();
    selectedCell = null;
    statusEl.textContent = "IN PROGRESS";

    renderBoard();
  }

  function renderBoard() {
    gridEl.innerHTML = "";
    for (var i = 0; i < 81; i++) {
      var r = Math.floor(i / 9);
      var c = i % 9;

      var cell = document.createElement("div");
      cell.className = "widget-sudoku-cell";
      if (c === 2 || c === 5) cell.classList.add("border-right");
      if (r === 2 || r === 5) cell.classList.add("border-bottom");

      var val = userState[i];
      if (currentPuzzle[i] !== 0) {
        cell.classList.add("given");
        cell.textContent = currentPuzzle[i];
      } else if (val !== 0) {
        cell.textContent = val;
      }

      cell.dataset.index = i;

      cell.addEventListener("click", function() {
        playSfx("click");
        var idx = parseInt(this.dataset.index);
        if (currentPuzzle[idx] === 0) {
          document.querySelectorAll(".widget-sudoku-cell").forEach(function(el) { el.classList.remove("selected"); });
          this.classList.add("selected");
          selectedCell = idx;
        }
      });

      gridEl.appendChild(cell);
    }
  }

  function checkWin() {
    var win = true;
    for (var i = 0; i < 81; i++) {
      if (userState[i] !== currentSolution[i]) {
        win = false;
        break;
      }
    }
    if (win) {
      statusEl.textContent = "SOLVED! 🎉";
      showToast("Sudoku Solved on Desktop!");
      playSfx("open");
    }
  }

  document.querySelectorAll(".widget-key").forEach(function(key) {
    key.addEventListener("click", function() {
      playSfx("click");
      if (selectedCell !== null && currentPuzzle[selectedCell] === 0) {
        var num = parseInt(key.getAttribute("data-val"));
        if (num) {
          userState[selectedCell] = num;
        }
        renderBoard();
        checkWin();
      }
    });
  });

  if (eraseBtn) {
    eraseBtn.addEventListener("click", function() {
      playSfx("click");
      if (selectedCell !== null && currentPuzzle[selectedCell] === 0) {
        userState[selectedCell] = 0;
        renderBoard();
      }
    });
  }

  if (newBtn) {
    newBtn.addEventListener("click", function() {
      playSfx("click");
      loadGame();
    });
  }

  loadGame();
}

function setupCamera() {
  var video = document.querySelector("#cameraVideo");
  var startBtn = document.querySelector("#startCameraBtn");
  var snapBtn = document.querySelector("#snapPhotoBtn");

  startBtn.addEventListener("click", function() {
    playSfx("click");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        showToast("Camera activated!");
      }).catch(function(err) {
        showToast("Camera access denied or unavailable.");
      });
    } else {
      showToast("Camera not supported in browser.");
    }
  });

  snapBtn.addEventListener("click", function() {
    playSfx("click");
    if (video.srcObject) {
      var c = document.createElement("canvas");
      c.width = 320;
      c.height = 240;
      var ctx = c.getContext("2d");
      ctx.drawImage(video, 0, 0, 320, 240);
      var dataUrl = c.toDataURL("image/png");
      var snapName = "snap_" + Date.now() + ".png";
      
      photoContent.push({ name: snapName, url: dataUrl });
      saveData("photos", photoContent);
      setupPhotosApp();
      setupFilesApp();
      showToast("Photo saved to gallery!");
    } else {
      showToast("Enable camera first!");
    }
  });
}

function setupMusic() {
  var statusEl = document.querySelector("#synthStatus");
  var playBtn = document.querySelector("#playMusicBtn");
  var stopBtn = document.querySelector("#stopMusicBtn");
  var trackSelect = document.querySelector("#trackSelect");

  var synthCtx = null;
  var musicTimer = null;

  function play8BitTone(freq, duration) {
    if (!synthCtx) synthCtx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = synthCtx.createOscillator();
    var gain = synthCtx.createGain();

    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, synthCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, synthCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(synthCtx.destination);

    osc.start();
    osc.stop(synthCtx.currentTime + duration);
  }

  playBtn.addEventListener("click", function() {
    playSfx("click");
    clearInterval(musicTimer);
    statusEl.textContent = "PLAYING: " + trackSelect.options[trackSelect.selectedIndex].text;
    
    var notes = [261, 329, 392, 523, 440, 349, 293, 392];
    var step = 0;

    musicTimer = setInterval(function() {
      play8BitTone(notes[step % notes.length], 0.15);
      step++;
    }, 200);

    showToast("Playing chiptune audio");
  });

  stopBtn.addEventListener("click", function() {
    playSfx("click");
    clearInterval(musicTimer);
    statusEl.textContent = "STOPPED";
    showToast("Audio stopped");
  });
}

function setupBrowser() {
  var urlInput = document.querySelector("#browserUrlInput");
  var goBtn = document.querySelector("#browserGoBtn");
  var backBtn = document.querySelector("#browserBackBtn");
  var homeBtn = document.querySelector("#browserHomeBtn");
  var frame = document.querySelector("#browserFrame");

  function bindLinks() {
    frame.querySelectorAll(".web-link").forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        playSfx("click");
        var target = link.getAttribute("data-url");
        navigate(target);
      });
    });

    var searchBtn = frame.querySelector("#retroSearchBtn");
    var searchInput = frame.querySelector("#retroSearchInput");
    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", function() {
        playSfx("click");
        var query = searchInput.value.trim();
        frame.innerHTML = "<h3>EJOgle Search Results for '" + query + "'</h3><p>Found 3 retro results:</p><ul class='browser-links'><li><a href='#' class='web-link' data-url='ejoos://about'>Result 1: About EJOos</a></li><li><a href='#' class='web-link' data-url='ejoos://news'>Result 2: 1998 Web Archives</a></li><li><a href='#' class='web-link' data-url='ejoos://guestbook'>Result 3: Public Guestbook</a></li></ul>";
        bindLinks();
      });
    }

    var guestBtn = frame.querySelector("#guestbookSubmitBtn");
    var guestInput = frame.querySelector("#guestbookInput");
    if (guestBtn && guestInput) {
      guestBtn.addEventListener("click", function() {
        playSfx("click");
        var msg = guestInput.value.trim();
        if (msg) {
          guestbookMessages.push({ id: Date.now(), user: currentUser, text: msg });
          saveData("guestbook", guestbookMessages);
          navigate("ejoos://guestbook");
        }
      });
    }

    frame.querySelectorAll(".del-guest-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        playSfx("click");
        var id = parseInt(btn.getAttribute("data-id"));
        guestbookMessages = guestbookMessages.filter(function(item) { return item.id !== id; });
        saveData("guestbook", guestbookMessages);
        navigate("ejoos://guestbook");
      });
    });
  }

  function navigate(url) {
    urlInput.value = url;
    if (browserHistory[browserHistory.length - 1] !== url) {
      browserHistory.push(url);
    }

    if (url === "ejoos://home") {
      frame.innerHTML = "<h3>Welcome to NetSurfer v1.0</h3><p>Explore retro web destinations below:</p><ul class='browser-links'><li><a href='#' class='web-link' data-url='ejoos://about'>About EJOos Project</a></li><li><a href='#' class='web-link' data-url='ejoos://search'>EJOgle Retro Search Engine</a></li><li><a href='#' class='web-link' data-url='ejoos://news'>Retro Net News 1998</a></li><li><a href='#' class='web-link' data-url='ejoos://guestbook'>EJOos Web Guestbook</a></li></ul>";
    } else if (url === "ejoos://about") {
      frame.innerHTML = "<h3>About EJOos</h3><p>EJOos is a retro web operating system created as a front-end UI project.</p><p><a href='#' class='web-link' data-url='ejoos://home'>◄ Return Home</a></p>";
    } else if (url === "ejoos://search") {
      frame.innerHTML = "<h3>EJOgle Search Engine</h3><div class='browser-search-box'><input type='text' id='retroSearchInput' placeholder='Search retro web...' /><button class='action-btn' id='retroSearchBtn'>Search</button></div><p>Popular: <a href='#' class='web-link' data-url='ejoos://news'>News</a>, <a href='#' class='web-link' data-url='ejoos://guestbook'>Guestbook</a></p>";
    } else if (url === "ejoos://news") {
      frame.innerHTML = "<h3>Retro Net News 1998</h3><p><b>Headline:</b> EJOos Desktop Operating System releases v1.0 online!</p><p><a href='#' class='web-link' data-url='ejoos://home'>◄ Return Home</a></p>";
    } else if (url === "ejoos://guestbook") {
      var html = "<h3>EJOos Guestbook</h3><p>Leave a public note:</p><div class='browser-search-box'><input type='text' id='guestbookInput' placeholder='Write a comment...' /><button class='action-btn' id='guestbookSubmitBtn'>Post</button></div><div id='guestbookEntries' style='display:flex; flex-direction:column; gap:6px;'>";
      
      guestbookMessages.forEach(function(m) {
        html += "<div style='display:flex; justify-content:space-between; align-items:center; background:var(--dark-panel); padding:4px 8px; border:1px solid var(--border-sub);'><span><b>" + m.user + ":</b> " + m.text + "</span><button class='action-btn del-guest-btn' data-id='" + m.id + "' style='padding:2px 6px; font-size:11px;'>Delete</button></div>";
      });
      
      html += "</div>";
      frame.innerHTML = html;
    } else {
      frame.innerHTML = "<h3>404 Page Not Found</h3><p>The retro web address '" + url + "' could not be resolved.</p><p><a href='#' class='web-link' data-url='ejoos://home'>◄ Return Home</a></p>";
    }

    bindLinks();
  }

  goBtn.addEventListener("click", function() {
    playSfx("click");
    navigate(urlInput.value.trim());
  });

  homeBtn.addEventListener("click", function() {
    playSfx("click");
    navigate("ejoos://home");
  });

  backBtn.addEventListener("click", function() {
    playSfx("click");
    if (browserHistory.length > 1) {
      browserHistory.pop();
      var prev = browserHistory[browserHistory.length - 1];
      navigate(prev);
    }
  });

  bindLinks();
}

function setupChatbot() {
  var logs = document.querySelector("#chatLogs");
  var input = document.querySelector("#chatInput");
  var sendBtn = document.querySelector("#sendChatBtn");

  var savedChatHistory = getSavedData("chatHistory", [
    { sender: "Bot", text: "Hello! I am the EJOos virtual assistant. Ask me anything about system functions or type 'help'!" }
  ]);

  function renderLogs() {
    if (!logs) return;
    logs.innerHTML = "";
    savedChatHistory.forEach(function(msg) {
      var div = document.createElement("div");
      div.className = "chat-msg";
      div.innerHTML = "<b>[" + msg.sender + "]:</b> " + msg.text;
      logs.appendChild(div);
    });
    logs.scrollTop = logs.scrollHeight;
  }

  function getBotResponse(query) {
    var text = query.toLowerCase();
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello " + currentUser + "! How can I assist you with EJOos today?";
    } else if (text.includes("help") || text.includes("apps") || text.includes("functions")) {
      return "You can run Terminal, Notes, Photos, Files, Calc, Paint, Snake, Minesweeper, Camera, Music, Browser, and Settings!";
    } else if (text.includes("time") || text.includes("clock") || text.includes("date")) {
      return "Current system time is " + new Date().toLocaleTimeString() + ". Check top-right of your screen!";
    } else if (text.includes("clear")) {
      savedChatHistory = [];
      saveData("chatHistory", savedChatHistory);
      renderLogs();
      return "Chat history cleared.";
    } else {
      var replies = [
        "Beep boop! I process queries at virtual 8-bit speed.",
        "Try typing 'help' in the Terminal for CLI mode!",
        "Need music? Open 8-Bit Audio Player for synthesized tunes."
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }

  function sendMessage() {
    playSfx("click");
    var text = input.value.trim();
    if (!text) return;

    savedChatHistory.push({ sender: currentUser, text: text });
    saveData("chatHistory", savedChatHistory);
    renderLogs();
    input.value = "";

    setTimeout(function() {
      var botReply = getBotResponse(text);
      savedChatHistory.push({ sender: "Bot", text: botReply });
      saveData("chatHistory", savedChatHistory);
      renderLogs();
    }, 500);
  }

  if (sendBtn && input) {
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") sendMessage();
    });
  }

  renderLogs();
}

function setupSettings() {
  var body = document.querySelector("#desktopBody");
  var userInput = document.querySelector("#userNameInput");
  var userBtn = document.querySelector("#saveUserBtn");
  var resetBtn = document.querySelector("#resetSystemBtn");
  var termPrompt = document.querySelector("#termPrompt");
  var wallpaperInput = document.querySelector("#wallpaperInput");
  var uploadBtn = document.querySelector("#uploadWallpaperBtn");

  function setTheme(themeClass, name) {
    playSfx("click");
    body.className = themeClass;
    currentTheme = themeClass;
    saveData("theme", currentTheme);
    showToast("Theme: " + name);
  }

  document.querySelector("#themeRed").addEventListener("click", function() { setTheme("main", "Retro Red"); });
  document.querySelector("#themeAmber").addEventListener("click", function() { setTheme("main theme-amber", "Amber CRT"); });
  document.querySelector("#themeGreen").addEventListener("click", function() { setTheme("main theme-green", "Matrix Green"); });
  document.querySelector("#themeBlue").addEventListener("click", function() { setTheme("main theme-blue", "Cobalt Blue"); });

  uploadBtn.addEventListener("click", function() {
    playSfx("click");
    wallpaperInput.click();
  });

  wallpaperInput.addEventListener("change", function(e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        body.style.backgroundImage = "url('" + evt.target.result + "')";
        body.style.backgroundSize = "cover";
        currentBg = evt.target.result;
        saveData("bg", currentBg);
        showToast("Custom wallpaper updated!");
      };
      reader.readAsDataURL(file);
    }
  });

  userBtn.addEventListener("click", function() {
    playSfx("click");
    var val = userInput.value.trim();
    if (val) {
      currentUser = val;
      saveData("user", currentUser);
      if (termPrompt) {
        termPrompt.textContent = currentUser + "@ejoos:$ ";
      }
      showToast("User updated to " + currentUser);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function() {
      playSfx("click");
      if (confirm("Reset all saved system preferences and user files?")) {
        localStorage.clear();
        location.reload();
      }
    });
  }
}

function setupTaskManager() {
  var taskListEl = document.querySelector("#taskList");
  var cpuUsageEl = document.querySelector("#cpuUsage");
  var cpuMeterEl = document.querySelector("#cpuMeter");
  var ramUsageEl = document.querySelector("#ramUsage");
  var ramMeterEl = document.querySelector("#ramMeter");

  renderTaskList = function() {
    if (!taskListEl) return;
    taskListEl.innerHTML = "";

    allWindows.forEach(function(win) {
      var isOpen = win.el && win.el.style.display !== "none" && win.el.style.display !== "";
      if (isOpen) {
        var row = document.createElement("div");
        row.className = "task-row";
        row.innerHTML = "<span>" + win.name + "</span>";

        var killBtn = document.createElement("button");
        killBtn.className = "action-btn";
        killBtn.textContent = "End Task";
        killBtn.addEventListener("click", function() {
          closeWindow(win.el);
          showToast("Closed " + win.name);
        });

        row.appendChild(killBtn);
        taskListEl.appendChild(row);
      }
    });
  };

  setInterval(function() {
    var activeCount = allWindows.filter(function(w) {
      return w.el && w.el.style.display !== "none" && w.el.style.display !== "";
    }).length;

    var cpu = Math.floor(Math.random() * 12) + (activeCount * 5);
    if (cpu > 100) cpu = 99;

    var ram = 118 + (activeCount * 32) + Math.floor(Math.random() * 10);

    if (cpuUsageEl) cpuUsageEl.textContent = cpu + "%";
    if (cpuMeterEl) cpuMeterEl.style.width = cpu + "%";
    if (ramUsageEl) ramUsageEl.textContent = ram + " MB / 512 MB";
    if (ramMeterEl) ramMeterEl.style.width = Math.floor((ram / 512) * 100) + "%";
  }, 2000);

  renderTaskList();
}
