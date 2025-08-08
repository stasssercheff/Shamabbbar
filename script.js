document.addEventListener('DOMContentLoaded', () => {
  const languageButtons = document.querySelectorAll('.lang-switch button');
  const allSections = document.querySelectorAll('.section');
  const nameSelect = document.getElementById('name');
  const positionSelect = document.getElementById('position');
  const form = document.getElementById('checklist-form');
  const dateInput = document.getElementById('date');
  const commentBlocks = document.querySelectorAll('.comment-block textarea');

  // Установка сегодняшней даты
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  const checklistData = {
    barista: [/* ... */],
    waiter: [/* ... */],
    cashier: [/* ... */]
  };

  const names = {
    barista: ['Alice', 'Bob'],
    waiter: ['Charlie', 'Dana'],
    cashier: ['Eve', 'Frank']
  };

  const translations = {
    done: { ru: 'Сделано', en: 'Done', vi: 'Hoàn thành' },
    not_done: { ru: 'Не сделано', en: 'Not done', vi: 'Chưa làm' },
    dash: { ru: '—', en: '—', vi: '—' }
  };

  const positionTranslations = {
    barista: { ru: "Бариста", en: "Barista", vi: "Barista" },
    waiter: { ru: "Официант", en: "Waiter", vi: "Phục vụ" },
    cashier: { ru: "Кассир", en: "Cashier", vi: "Thu ngân" },
    order: { ru: "Заказ", en: "Order", vi: "Đơn hàng" },
    "select-placeholder": { ru: "—", en: "—", vi: "—" }
  };

  // Смена языка
  function switchLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);

    // Обновляем option'ы всех селекторов
    document.querySelectorAll('select.qty').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '';
      const dashOption = document.createElement('option');
      dashOption.value = '';
      dashOption.textContent = translations.dash[lang];
      select.appendChild(dashOption);

      const doneOption = document.createElement('option');
      doneOption.value = 'done';
      doneOption.textContent = translations.done[lang];
      select.appendChild(doneOption);

      const notDoneOption = document.createElement('option');
      notDoneOption.value = 'not_done';
      notDoneOption.textContent = translations.not_done[lang];
      select.appendChild(notDoneOption);

      select.value = currentValue;
    });

    // Обновляем option'ы должности (position)
    document.querySelectorAll('#position option[data-key]').forEach(opt => {
      const key = opt.dataset.key;
      if (positionTranslations[key] && positionTranslations[key][lang]) {
        opt.textContent = positionTranslations[key][lang];
      }
    });
  }

  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

  positionSelect.addEventListener('change', () => {
    const role = positionSelect.value;
    nameSelect.innerHTML = '<option value="">—</option>';
    if (names[role]) {
      names[role].forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        nameSelect.appendChild(opt);
      });
    }

    allSections.forEach(section => {
      if (section.dataset.role === role) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });

  // Автосохранение
  const autosaveFields = ['name', 'position', 'date'];
  autosaveFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saved = localStorage.getItem(id);
      if (saved) el.value = saved;
      el.addEventListener('change', () => localStorage.setItem(id, el.value));
    }
  });

  // Чеклисты и комментарии
  document.querySelectorAll('select.qty').forEach(select => {
    const saved = localStorage.getItem(select.name);
    if (saved) select.value = saved;
    select.addEventListener('change', () => localStorage.setItem(select.name, select.value));
  });

  commentBlocks.forEach(area => {
    const saved = localStorage.getItem(area.name);
    if (saved) area.value = saved;
    area.addEventListener('input', () => localStorage.setItem(area.name, area.value));
  });

  // Отправка
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameSelect.value || '—';
    const role = positionSelect.value || '—';
    const date = dateInput.value || '—';

    const result = [`Name: ${name}`, `Position: ${role}`, `Date: ${date}`];

    document.querySelectorAll('.section').forEach(section => {
      const roleSection = section.dataset.role;
      if (roleSection !== role) return;

      const sectionTitle = section.querySelector('h3')?.textContent || '';
      result.push(`\n${sectionTitle}`);

      section.querySelectorAll('label.check-label').forEach(label => {
        const select = label.querySelector('select.qty');
        const value = select?.value || '';
        const labelText = label.childNodes[0].textContent.trim();
        let displayText = '—';
        if (value === 'done') displayText = 'Done';
        if (value === 'not_done') displayText = 'Not done';
        result.push(`• ${labelText}: ${displayText}`);
      });

      const comment = section.querySelector('textarea')?.value.trim();
      if (comment) result.push(`Comment: ${comment}`);
    });

    const finalMessage = result.join('\n');

    try {
      await fetch('https://api.telegram.org/bot<8307377112:AAEb7d6w3tBypnqclQpJ5mBdSMG5SwoMWXc>/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '<4961000707>',
          text: finalMessage
        })
      });

      localStorage.clear();
      alert('Checklist sent successfully!');
      form.reset();
    } catch (err) {
      alert('Failed to send');
    }
  });
});