const translations = {
  ru: {
    "label-role": "Должность",
    "label-staff": "Сотрудник",
    "label-date": "Дата",
    "submit": "Отправить",
    "barista": [
      { name: "Проверить кофемашину", key: "coffee_machine" },
      { name: "Заполнить молоко", key: "milk_fill" },
      { name: "Очистить рабочую зону", key: "clean_area" }
    ]
  },
  en: {
    "label-role": "Role",
    "label-staff": "Staff",
    "label-date": "Date",
    "submit": "Submit",
    "barista": [
      { name: "Check coffee machine", key: "coffee_machine" },
      { name: "Refill milk", key: "milk_fill" },
      { name: "Clean workspace", key: "clean_area" }
    ]
  },
  vi: {
    "label-role": "Chức vụ",
    "label-staff": "Nhân viên",
    "label-date": "Ngày",
    "submit": "Gửi",
    "barista": [
      { name: "Kiểm tra máy pha cà phê", key: "coffee_machine" },
      { name: "Đổ đầy sữa", key: "milk_fill" },
      { name: "Dọn dẹp khu vực làm việc", key: "clean_area" }
    ]
  }
};

let currentLang = "ru";

function switchLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (t[key]) el.textContent = t[key];
  });

  document.getElementById("submit-btn").textContent = t["submit"];

  const role = document.getElementById("role").value;
  if (role) renderChecklist(role);
}

function renderChecklist(role) {
  const container = document.getElementById("checklist-container");
  container.innerHTML = "";

  const t = translations[currentLang];
  const items = t[role] || [];

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "form-group";

    const label = document.createElement("label");
    label.className = "label";
    label.textContent = item.name;

    const select = document.createElement("select");
    select.name = item.key;

    ["—", "✔️", "❌"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    });

    row.appendChild(label);
    row.appendChild(select);
    container.appendChild(row);
  });
}

document.getElementById("role").addEventListener("change", (e) => {
  const role = e.target.value;
  if (role) renderChecklist(role);
});

window.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
});