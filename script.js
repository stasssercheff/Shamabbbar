document.addEventListener("DOMContentLoaded", function () {
  const langButtons = document.querySelectorAll(".lang-switch button");
  const allSections = document.querySelectorAll("section");
  const selects = document.querySelectorAll("select");
  const nameSelect = document.getElementById("name");
  const positionSelect = document.getElementById("position");
  const dateInput = document.getElementById("date");
  const commentBlocks = document.querySelectorAll(".comment-block textarea");
  const form = document.querySelector("form");

  const translations = {
    en: {
      nameLabel: "Name",
      positionLabel: "Position",
      dateLabel: "Date",
      sendButton: "Send",
      defaultOption: "—",
      done: "Done",
      notDone: "Not done",
      positions: {
        waiter: "Waiter",
        barista: "Barista",
        cashier: "Cashier"
      }
    },
    ru: {
      nameLabel: "Имя",
      positionLabel: "Должность",
      dateLabel: "Дата",
      sendButton: "Отправить",
      defaultOption: "—",
      done: "Сделано",
      notDone: "Не сделано",
      positions: {
        waiter: "Официант",
        barista: "Бариста",
        cashier: "Кассир"
      }
    },
    vi: {
      nameLabel: "Tên",
      positionLabel: "Chức vụ",
      dateLabel: "Ngày",
      sendButton: "Gửi",
      defaultOption: "—",
      done: "Hoàn thành",
      notDone: "Chưa hoàn thành",
      positions: {
        waiter: "Phục vụ",
        barista: "Barista",
        cashier: "Thu ngân"
      }
    }
  };

  let currentLang = document.documentElement.lang || "en";

  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    const t = translations[lang];

    // Обновление лейблов
    document.querySelector("label[for='name']").textContent = t.nameLabel;
    document.querySelector("label[for='position']").textContent = t.positionLabel;
    document.querySelector("label[for='date']").textContent = t.dateLabel;
    document.querySelector("button[type='submit']").textContent = t.sendButton;

    // Обновление селектора должностей
    Array.from(positionSelect.options).forEach(option => {
      if (option.value && t.positions[option.value]) {
        option.textContent = t.positions[option.value];
      }
      if (option.value === "") {
        option.textContent = t.defaultOption;
      }
    });

    // Обновление всех select.qty
    document.querySelectorAll("select.qty").forEach(select => {
      Array.from(select.options).forEach(option => {
        if (option.value === "done") option.textContent = t.done;
        else if (option.value === "not_done") option.textContent = t.notDone;
        else if (option.value === "") option.textContent = t.defaultOption;
      });
    });
  }

  // Смена языка при клике на кнопки
  langButtons.forEach(button => {
    button.addEventListener("click", () => {
      switchLanguage(button.getAttribute("data-lang"));
    });
  });

  // Установка текущей даты
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  dateInput.value = `${year}-${month}-${day}`;

  // Автосохранение
  function saveForm() {
    const data = {
      name: nameSelect.value,
      position: positionSelect.value,
      date: dateInput.value,
      checklist: {},
      comments: {}
    };

    allSections.forEach(section => {
      const sectionId = section.id;
      const items = section.querySelectorAll(".check-item");
      data.checklist[sectionId] = {};
      items.forEach(item => {
        const select = item.querySelector("select.qty");
        data.checklist[sectionId][select.name] = select.value;
      });

      const comment = section.querySelector("textarea");
      if (comment) {
        data.comments[sectionId] = comment.value;
      }
    });

    localStorage.setItem("checklistData", JSON.stringify(data));
  }

  function loadForm() {
    const data = JSON.parse(localStorage.getItem("checklistData"));
    if (!data) return;

    nameSelect.value = data.name || "";
    positionSelect.value = data.position || "";
    dateInput.value = data.date || "";

    allSections.forEach(section => {
      const sectionId = section.id;
      const items = section.querySelectorAll(".check-item");

      if (data.checklist && data.checklist[sectionId]) {
        items.forEach(item => {
          const select = item.querySelector("select.qty");
          const value = data.checklist[sectionId][select.name];
          if (value !== undefined) {
            select.value = value;
          }
        });
      }

      const comment = section.querySelector("textarea");
      if (comment && data.comments && data.comments[sectionId]) {
        comment.value = data.comments[sectionId];
      }
    });
  }

  // Отправка в Telegram
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameSelect.value || "—";
    const position = translations["en"].positions[positionSelect.value] || "—";
    const date = dateInput.value || "—";

    const messageLangs = {
      ru: [],
      en: []
    };

    ["ru", "en"].forEach(lang => {
      const t = translations[lang];

      let message = `🧾 <b>${t.nameLabel}:</b> ${name}\n`;
      message += `<b>${t.positionLabel}:</b> ${t.positions[positionSelect.value] || "—"}\n`;
      message += `<b>${t.dateLabel}:</b> ${date}\n\n`;

      allSections.forEach(section => {
        const sectionTitle = section.querySelector("h3").textContent.trim();
        message += `📍 <u>${sectionTitle}</u>\n`;

        const items = section.querySelectorAll(".check-item");
        items.forEach(item => {
          const label = item.querySelector("label").textContent.trim();
          const select = item.querySelector("select.qty");
          const value = select.value;
          let valueText = "—";
          if (value === "done") valueText = t.done;
          else if (value === "not_done") valueText = t.notDone;
          message += `▫️ ${label}: ${valueText}\n`;
        });

        const comment = section.querySelector("textarea");
        if (comment && comment.value.trim() !== "") {
          message += `💬 ${comment.value.trim()}\n`;
        }

        message += `\n`;
      });

      messageLangs[lang].push(message.trim());
    });

    const token = "YOUR_TELEGRAM_BOT_TOKEN";
    const chatId = "YOUR_CHAT_ID";

    Promise.all(
      messageLangs.en.concat(messageLangs.ru).map(msg => {
        return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: "HTML"
          })
        });
      })
    )
      .then(() => {
        localStorage.removeItem("checklistData");
        alert("Checklist sent successfully!");
        form.reset();
      })
      .catch(() => {
        alert("Failed to send checklist.");
      });
  });

  // Обновление на старте
  switchLanguage(currentLang);
  loadForm();

  // Сохранение при изменениях
  form.addEventListener("change", saveForm);
});