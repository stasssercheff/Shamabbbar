document.addEventListener('DOMContentLoaded', () => {
  const languageButtons = document.querySelectorAll('.lang-switch button');
  const languageElements = document.querySelectorAll('[data-lang]');
  const selectElements = document.querySelectorAll('select');
  const form = document.getElementById('checklist-form');
  const tgToken = 'YOUR_TELEGRAM_BOT_TOKEN'; // <-- вставь свой токен
  const chatId = 'YOUR_CHAT_ID';             // <-- вставь свой чат ID

  const langData = {
    ru: {
      default: '—',
      done: 'Сделано',
      not_done: 'Не сделано',
      not_selected: '— Не выбрано —',
    },
    en: {
      default: '—',
      done: 'Done',
      not_done: 'Not done',
      not_selected: '— Not selected —',
    },
    vi: {
      default: '—',
      done: 'Đã làm',
      not_done: 'Chưa làm',
      not_selected: '— Chưa chọn —',
    }
  };

  const translations = {
    ru: {},
    en: {},
    vi: {}
  };

  let currentLang = document.documentElement.lang || 'ru';

  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    languageElements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (el.tagName === 'OPTION' || el.tagName === 'SELECT') return;
      el.textContent = translations[lang][key] || el.textContent;
    });

    updateAllSelects();
  }

  function updateAllSelects() {
    document.querySelectorAll('select.qty').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = ''; // Очистить

      const optionDefault = document.createElement('option');
      optionDefault.value = '';
      optionDefault.textContent = langData[currentLang].default;
      select.appendChild(optionDefault);

      const option1 = document.createElement('option');
      option1.value = 'done';
      option1.textContent = langData[currentLang].done;
      select.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = 'not_done';
      option2.textContent = langData[currentLang].not_done;
      select.appendChild(option2);

      // Сохраняем предыдущее значение
      if (currentValue) select.value = currentValue;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value || '—';
    const date = document.getElementById('date')?.value || '—';
    const sections = document.querySelectorAll('.section');
    let message = `📝 Checklist\n👤 Name: ${name}\n📅 Date: ${date}\n\n`;

    sections.forEach(section => {
      const sectionTitle = section.querySelector('h3')?.textContent.trim() || '';
      const selects = section.querySelectorAll('select.qty');
      const labels = section.querySelectorAll('label.check-label');
      const comment = section.querySelector('textarea')?.value || '';
      message += `📌 ${sectionTitle}\n`;

      selects.forEach((select, index) => {
        const label = labels[index]?.textContent.trim() || '';
        const value = select.value ? langData.en[select.value] : langData.en.default;
        message += `• ${label}: ${value}\n`;
      });

      if (comment.trim()) {
        message += `💬 Comment: ${comment.trim()}\n`;
      }

      message += `\n`;
    });

    const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Отправлено!');
        form.reset();
        updateAllSelects();
      } else {
        alert('Ошибка при отправке');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения');
    }
  });

  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  updateAllSelects(); // первичная инициализация
});