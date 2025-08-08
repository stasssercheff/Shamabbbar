document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checklist-form");
  const nameInput = document.getElementById("staffName");
  const dateInput = document.getElementById("checkDate");
  const positionSelect = document.getElementById("position");
  const checklistContainer = document.getElementById("checklist-container");
  const langButtons = document.querySelectorAll(".lang-switch button");

  let currentLang = "ru";

  const telegramToken = "XXX:XXXXXXXX"; // ← ВСТАВЬ СВОЙ ТОКЕН
  const telegramChatId = "chat_id";     // ← ВСТАВЬ СВОЙ CHAT_ID

  const positionTranslations = {
    barista: { ru: "Бариста", en: "Barista", vi: "Barista" },
    waiter: { ru: "Официант", en: "Waiter", vi: "Phục vụ" },
    cashier: { ru: "Кассир", en: "Cashier", vi: "Thu ngân" },
    order: { ru: "Заказ", en: "Order", vi: "Đơn hàng" },
    "select-placeholder": { ru: "—", en: "—", vi: "—" }
  };

  const translations = {
    send: { ru: "Отправить", en: "Send", vi: "Gửi" },
    date: { ru: "Дата", en: "Date", vi: "Ngày" },
    name: { ru: "Имя", en: "Name", vi: "Tên" }
  };

  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Текстовые элементы
    document.querySelectorAll("[data-ru]").forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Селектор должности
    document.querySelectorAll("#position option[data-key]").forEach(opt => {
      const key = opt.dataset.key;
      if (positionTranslations[key]) {
        opt.textContent = positionTranslations[key][lang];
      }
    });

    // Placeholder селекторов чеклиста
    document.querySelectorAll("select.qty").forEach(select => {
      const firstOption = select.options[0];
      if (firstOption) {
        firstOption.textContent = positionTranslations["select-placeholder"][lang];
      }
    });

    // Перезапустить чеклист
    generateChecklist();
  }

  function generateChecklist() {
    const selected = positionSelect.value;
    const checklistId = `checklist-${selected}`;
    document.querySelectorAll(".checklist-block").forEach(block => {
      block.style.display = block.id === checklistId ? "block" : "none";
    });
  }

  function saveToLocal() {
    const data = {
      name: nameInput.value,
      date: dateInput.value,
      position: positionSelect.value,
      fields: {},
      comments: {}
    };

    document.querySelectorAll(".checklist-block").forEach(block => {
      const inputs = block.querySelectorAll("select.qty");
      inputs.forEach(input => {
        data.fields[input.name] = input.value;
      });

      const textarea = block.querySelector("textarea.comment");
      if (textarea) data.comments[block.id] = textarea.value;
    });

    localStorage.setItem("checklistData", JSON.stringify(data));
  }

  function loadFromLocal() {
    const saved = localStorage.getItem("checklistData");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      nameInput.value = data.name || "";
      dateInput.value = data.date || "";
      positionSelect.value = data.position || "";

      generateChecklist();

      document.querySelectorAll(".checklist-block").forEach(block => {
        const inputs = block.querySelectorAll("select.qty");
        inputs.forEach(input => {
          if (data.fields[input.name]) {
            input.value = data.fields[input.name];
          }
        });

        const textarea = block.querySelector("textarea.comment");
        if (textarea && data.comments[block.id]) {
          textarea.value = data.comments[block.id];
        }
      });
    } catch (e) {
      console.warn("Ошибка загрузки данных");
    }
  }

  function formatMessage(lang) {
    const name = nameInput.value || "—";
    const date = dateInput.value || "—";
    const positionKey = positionSelect.value;
    const position = positionTranslations[positionKey]?.[lang] || "—";

    let msg = `👤 ${translations.name[lang]}: ${name}\n📅 ${translations.date[lang]}: ${date}\n📌 ${positionTranslations[positionKey]?.[lang] || positionKey}\n\n`;

    const checklistId = `checklist-${positionKey}`;
    const block = document.getElementById(checklistId);

    if (!block) return msg;

    block.querySelectorAll(".check-row").forEach(row => {
      const label = row.querySelector("label.check-label");
      const select = row.querySelector("select.qty");
      const key = select ? select.value || "—" : "—";
      msg += `- ${label?.textContent?.trim() || "—"}: ${key}\n`;
    });

    const comment = block.querySelector("textarea.comment");
    if (comment && comment.value.trim()) {
      msg += `\n💬 ${comment.value.trim()}\n`;
    }

    return msg;
  }

  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const body = {
      chat_id: telegramChatId,
      text: text,
      parse_mode: "HTML"
    };
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (e) {
      alert("Ошибка отправки в Telegram");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = formatMessage("en");
    await sendToTelegram(msg);

    localStorage.removeItem("checklistData");
    alert("Отправлено ✅");
    form.reset();
    generateChecklist();
  });

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => switchLanguage(btn.dataset.lang));
  });

  positionSelect.addEventListener("change", () => {
    generateChecklist();
    saveToLocal();
  });

  form.addEventListener("input", saveToLocal);

  // Установка текущей даты
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;

  loadFromLocal();
  generateChecklist();
});