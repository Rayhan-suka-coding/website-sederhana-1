const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateinput = document.getElementById("todo-date");
const list = document.getElementById("todo-list");
const counter = document.getElementById("todo-counter");
const doneCount = document.getElementById("todo-done-count");
const tabs = document.querySelectorAll(".tab");
const searchinput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-completed");
const toggleThemeBtn = document.getElementById("toggle-theme");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importfile = document.getElementById("import-file");

let todos = JSON.parse(localStorage.getItem("todos")) ||[];
let filter = all;
let searchTerm = "";

function render() {
  list.innerHTML = "";

  let filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (searchTerm) {
    filtered = filtered.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

if (filtered.length === 0) {
    list.innerHTML = `<li class="empty">Tidak ada tugas</li>`;
  } else {
    filtered.forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = "item" + (todo.completed ? " completed" : "");

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? "checked" : ""} data-index="${index}" />
        <div class="title">
          <span class="text">${todo.text}</span>
          ${todo.date ? `<span class="meta">📅 ${todo.date}</span>` : ""}
        </div>
        <div class="actions">
          <button class="btn delete" data-index="${index}">❌</button>
        </div>
      `;

      list.appendChild(li);
    });
  }

  counter.textContent = `${filtered.length} tugas`;
  doneCount.textContent = todos.filter(t => t.completed).length;
  localStorage.setItem("todos", JSON.stringify(todos));

form.addEventListener("submit", e => {
  e.preventDefault();
  const text =input.value.trim();
   if (!text) return;

  todos.push({
    text,
    date: dateInput.value,
    completed: false
  });

  input.value = "";
  dateInput.value = "";
  render();
});

// Toggle selesai & hapus
list.addEventListener("click", e => {
  if (e.target.matches("input[type=checkbox]")) {
    const index = e.target.dataset.index;
    todos[index].completed = e.target.checked;
    render();
  }

  if (e.target.classList.contains("delete")) {
    const index = e.target.dataset.index;
    todos.splice(index, 1);
    render();
  }
});

// Filter tab
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    filter = tab.dataset.filter;
    render();
  });
});

// Cari tugas
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  render();
});

// Bersihkan yang sudah selesai
clearBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.completed);
  render();
});

// Mode terang/gelap
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Ekspor JSON
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(todos)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mytodolist.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Impor JSON
importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      todos = JSON.parse(reader.result);
      render();
    } catch {
      alert("File tidak valid!");
    }
  };
  reader.readAsText(file);
});

// Pertama kali render
render();