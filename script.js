const BOT_TOKEN = '6420665890:AAFRBCqLguAk43O3VVnUsaS3-3eZ4q7L8m4';
const CHAT_ID = '@checklist_qla';

let currentLang = 'ru';

// Переводы для селектора должностей
const positionTranslations = {
  barista: { ru: "Бариста", en: "Barista", vi: "Barista" },
  waiter: { ru: "Официант", en: "Waiter", vi: "Phục vụ" },
  cashier: { ru: "Кассир", en: "Cashier", vi: "Thu ngân" },
  order: { ru: "Заказ", en: "Order", vi: "Đơn hàng" },
  "select-placeholder": { ru: "—", en: "—", vi: "—" }
};

// Переключение языка
function switchLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-ru]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Обновляем placeholder'ы в <select>
  document.querySelectorAll('select').forEach(select => {
    const firstOption = select.options[0];
    if (firstOption && firstOption.dataset.default === "true") {
      firstOption.textContent = positionTranslations["select-placeholder"][lang];
    }
  });

  // Переводим <option> в селекторе должностей
  document.querySelectorAll('#position option[data-key]').forEach(opt => {
    const key = opt.dataset.key;
    if (positionTranslations[key]) {
      opt.textContent = positionTranslations[key][lang];
    }
  });

  generateChecklist();
  restoreFormState();
}

// Отображение чеклиста после выбора должности
document.getElementById('position').addEventListener('change', function () {
  const selected = this.value;
  document.querySelectorAll('.checklist-section').forEach(section => {
    section.style.display = 'none';
  });
  if (selected) {
    document.getElementById(`checklist-${selected}`).style.display = 'block';
  }
  saveFormState();
});

// Автоматическая дата
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  dateInput.value = formattedDate;

  restoreFormState();
});

// Сохраняем форму
function saveFormState() {
  const formData = {
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    position: document.getElementById("position").value,
    selects: {},
    comments: {}
  };

  document.querySelectorAll(".checklist-section").forEach(section => {
    section.querySelectorAll("select").forEach(select => {
      formData.selects[select.id] = select.value;
    });
    section.querySelectorAll("textarea").forEach(textarea => {
      formData.comments[textarea.id] = textarea.value;
    });
  });

  localStorage.setItem("checklistForm", JSON.stringify(formData));
}

// Восстанавливаем форму
function restoreFormState() {
  const data = JSON.parse(localStorage.getItem("checklistForm"));
  if (!data) return;

  document.getElementById("name").value = data.name || '';
  document.getElementById("date").value = data.date || '';
  document.getElementById("position").value = data.position || '';

  document.querySelectorAll('.checklist-section').forEach(section => {
    section.style.display = 'none';
  });

  if (data.position) {
    const section = document.getElementById(`checklist-${data.position}`);
    if (section) section.style.display = 'block';
  }

  for (const id in data.selects) {
    const select = document.getElementById(id);
    if (select) select.value = data.selects[id];
  }

  for (const id in data.comments) {
    const textarea = document.getElementById(id);
    if (textarea) textarea.value = data.comments[id];
  }
}

// Генерация Telegram-сообщения
function generateChecklist() {
  const name = document.getElementById("name").value || '—';
  const date = document.getElementById("date").value || '—';
  const position = document.getElementById("position").value;

  const section = document.getElementById(`checklist-${position}`);
  if (!section) return;

  const checklistTitle = positionTranslations[position]?.en || "Checklist";

  let message = `👤 Name: ${name}\n📅 Date: ${date}\n📌 Position: ${checklistTitle}\n\n`;

  section.querySelectorAll(".item-row").forEach(row => {
    const label = row.querySelector("label")?.textContent.trim() || "";
    const select = row.querySelector("select");
    const value = select?.value || "—";
    message += `• ${label}: ${value === "" ? "—" : value}\n`;
  });

  const comment = section.querySelector("textarea")?.value.trim();
  if (comment) {
    message += `\n💬 Comment:\n${comment}`;
  }

  return message;
}

// Отправка в Telegram
function sendToTelegram() {
  const msg = generateChecklist();
  if (!msg) return;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: "HTML"
    })
  }).then(res => {
    if (res.ok) {
      alert("Checklist sent successfully!");
      localStorage.removeItem("checklistForm");
      window.location.reload();
    } else {
      alert("Failed to send. Try again.");
    }
  }).catch(() => {
    alert("Error occurred during sending.");
  });
}

// Отправка при клике
document.getElementById("submit-btn").addEventListener("click", () => {
  saveFormState();
  sendToTelegram();
});