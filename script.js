document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-switch button');
  const checklistForm = document.getElementById('checklist-form');
  const checklistArea = document.getElementById('checklist-area');
  const roleSelect = document.getElementById('role');
  const dateInput = document.getElementById('date');

  // Установка сегодняшней даты
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  // Язык по умолчанию
  let currentLang = 'ru';

  // Переключение языка
  window.switchLanguage = (lang) => {
    currentLang = lang;
    document.querySelectorAll('[data-ru]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });

    // Обновить чеклист, если выбран
    if (roleSelect.value) renderChecklist(roleSelect.value);
  };

  // Данные чеклистов (только пример)
  const checklistData = {
    barista: {
      ru: ['Проверка машины', 'Запасы молока', 'Чистота стойки'],
      en: ['Machine check', 'Milk stock', 'Bar clean'],
      vi: ['Kiểm tra máy', 'Sữa đủ dùng', 'Quầy sạch sẽ']
    },
    waiter: {
      ru: ['Столы чистые', 'Меню на месте', 'Форма одета'],
      en: ['Tables clean', 'Menus ready', 'Uniform worn'],
      vi: ['Bàn sạch', 'Có menu', 'Mặc đồng phục']
    },
    cashier: {
      ru: ['Касса проверена', 'Терминал работает', 'Сдача есть'],
      en: ['Cash register checked', 'Terminal working', 'Change ready'],
      vi: ['Kiểm tra máy tính tiền', 'Thiết bị hoạt động', 'Có tiền thối']
    }
  };

  function renderChecklist(role) {
    checklistArea.innerHTML = '';

    if (!checklistData[role]) return;

    const items = checklistData[role][currentLang];
    const section = document.createElement('div');
    section.className = 'checklist-section';

    items.forEach((item, index) => {
      const block = document.createElement('div');
      block.className = 'check-item';

      const label = document.createElement('label');
      label.textContent = item;

      const select = document.createElement('select');
      select.name = `item_${index}`;
      ['—', currentLang === 'ru' ? 'Сделано' : currentLang === 'vi' ? 'Đã làm' : 'Done', currentLang === 'ru' ? 'Не сделано' : currentLang === 'vi' ? 'Chưa làm' : 'Not done'].forEach(optText => {
        const opt = document.createElement('option');
        opt.value = optText;
        opt.textContent = optText;
        select.appendChild(opt);
      });

      block.appendChild(label);
      block.appendChild(select);
      section.appendChild(block);
    });

    checklistArea.appendChild(section);
  }

  // Обработчик выбора роли
  roleSelect.addEventListener('change', () => {
    const selected = roleSelect.value;
    renderChecklist(selected);
  });

  // Обработка отправки — ТОЛЬКО ЕСЛИ НУЖНО (ОСТАВЛЯЕМ БЕЗ ИЗМЕНЕНИЙ)
  checklistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Отправка реализована отдельно (Telegram).");
  });
});