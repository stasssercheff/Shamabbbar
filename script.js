<script>
  const names = {
    barista: ["Анна", "Игорь", "Сон"],
    waiter: ["Маша", "Киет", "Таня"],
    cashier: ["Ольга", "Нгуен", "Виктор"],
    order: ["Алекс", "Тху", "Лин"]
  };

  const checklistData = {
    barista: [
      ["Протереть сиропы", "Lau sạch các chai siro", "Wipe syrup bottles"],
      ["Чистота стол", "Lau bàn cho sạch sẽ", "Wipe the table clean"],
      ["Чистота поверхность бара", "Lau bề mặt quầy bar", "Clean the bar surface"],
      ["Оборудование с моющим", "Rửa thiết bị bằng nước rửa chén", "Wash equipment with detergent"],
      ["Раковина", "Rửa bồn rửa chén", "Clean the sink"],
      ["Выкинуть остатки еды", "Bỏ thức ăn thừa", "Throw away leftover food"],
      ["Посуду вытереть", "Lau khô chén đĩa", "Dry the dishes"],
      ["Коврики помыть", "Rửa thảm chống trượt", "Wash anti-slip mats"],
      ["Кофемашина", "Vệ sinh máy pha cà phê", "Clean the coffee machine"],
      ["Отключить термопот", "Tắt bình thủy điện", "Turn off the thermal pot"],
      ["Вынести мусор", "Đổ rác", "Take out the trash"],
      ["Протереть всё", "Lau chùi mọi thứ", "Wipe everything down"],
      ["Тряпки на кухню", "Đem khăn lau xuống bếp", "Bring cleaning cloths to the kitchen"]
    ]
  };

  const langMap = { ru: 0, vi: 1, en: 2 };
  let currentLang = 'ru';

  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Обновление всех label'ов
    document.querySelectorAll('[data-ru]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Обновление option внутри всех select'ов
    document.querySelectorAll('select option').forEach(opt => {
      if (opt.dataset.ru) {
        opt.textContent = opt.dataset[lang];
      }
    });

    generateChecklist();
  }

  function updateNames() {
    const position = document.getElementById("position").value;
    const nameSelect = document.getElementById("name");
    nameSelect.innerHTML = '<option value="">—</option>';
    if (names[position]) {
      names[position].forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
      });
    }
    generateChecklist();
  }

  function generateChecklist() {
    const position = document.getElementById("position").value;
    const container = document.getElementById("checklist-container");
    container.innerHTML = "";
    if (!checklistData[position]) return;

    checklistData[position].forEach(([ru, vi, en]) => {
      const block = document.createElement("div");
      block.className = "input-block";

      const label = document.createElement("label");
      label.className = "check-label";
      label.textContent = [ru, vi, en][langMap[currentLang]];
      block.appendChild(label);

      const select = document.createElement("select");
      select.className = "input-field";

      const option1 = document.createElement("option");
      option1.value = "";
      option1.textContent = "—";

      const option2 = document.createElement("option");
      option2.value = "yes";
      option2.dataset.ru = "Сделано";
      option2.dataset.en = "Done";
      option2.dataset.vi = "Xong";
      option2.textContent = option2.dataset[currentLang];

      const option3 = document.createElement("option");
      option3.value = "no";
      option3.dataset.ru = "Не сделано";
      option3.dataset.en = "Not done";
      option3.dataset.vi = "Chưa làm";
      option3.textContent = option3.dataset[currentLang];

      select.appendChild(option1);
      select.appendChild(option2);
      select.appendChild(option3);

      block.appendChild(select);
      container.appendChild(block);
    });
  }

  function setToday() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    document.getElementById("current-date").value = `${dd}/${mm}/${yyyy}`;
  }

  function submitChecklist() {
    alert("Отправка реализуется отдельно");
  }

  document.addEventListener("DOMContentLoaded", () => {
    setToday();
    switchLanguage(currentLang);
  });
</script>