// === Переключение языка ===
function switchLanguage(lang) {
  document.documentElement.lang = lang;

  // Метки
  document.querySelectorAll('.check-label').forEach(label => {
    if (label.dataset[lang]) label.textContent = label.dataset[lang];
  });

  // Комментарии
  document.querySelectorAll('label[for^="comment"]').forEach(label => {
    if (label.dataset[lang]) label.textContent = label.dataset[lang];
  });
}

// === Переключение вкладок ===
function showTab(index) {
  document.querySelectorAll('.tab-button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  document.querySelectorAll('.tab-content').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

// === Отправка чеклиста ===
function sendChecklistToTelegram() {
  const activeForm = document.querySelector('.tab-content.active .checklist-form');
  if (!activeForm) {
    alert('No active form found.');
    return;
  }

  const checklistTitle = activeForm.querySelector('.checklist-title')?.textContent || 'Checklist';
  const lang = 'en'; // отправляем только на английском

  // Сбор данных
  let message = `🧾 <b>${checklistTitle}</b>\n\n`;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  message += `📅 Date: ${day}/${month}\n\n`;

  const inputBlocks = activeForm.querySelectorAll('.input-block');
  inputBlocks.forEach(block => {
    const label = block.querySelector('.check-label');
    const labelText = label?.dataset[lang] || label?.textContent || '';
    const select = block.querySelector('select');
    if (select) {
      const value = select.value || '—';
      message += `• ${labelText}: ${value}\n`;
    } else {
      const textarea = block.querySelector('textarea');
      if (textarea && textarea.value.trim()) {
        message += `💬 Comment: ${textarea.value.trim()}\n`;
      }
    }
  });

  // Отправка в Telegram
  const token = '8307377112:AAEb7d6w3tBypnqclQpJ5mBdSMG5SwoMWXc';
  const chat_id = '-4961000707';

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      text: message,
      parse_mode: 'HTML'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        alert('✅ Checklist sent to Telegram!');
      } else {
        throw new Error(data.description);
      }
    })
    .catch(err => {
      alert('❌ Error sending message: ' + err.message);
      console.error(err);
    });
}

// === DOM Ready ===
document.addEventListener('DOMContentLoaded', () => {
  switchLanguage('en'); // по умолчанию
});