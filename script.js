const roles = {
  ru: ["Бариста", "Официант", "Кассир"],
  en: ["Barista", "Waiter", "Cashier"],
  vi: ["Barista", "Phục vụ", "Thu ngân"]
};

const namesByRole = {
  Barista: ["Anna", "Ivan", "Linh"],
  Waiter: ["Oleg", "Tuan"],
  Cashier: ["Maria", "Phong"]
};

const checklistData = {
  Barista: [
    {
      ru: "Протереть сиропы",
      en: "Wipe syrup bottles",
      vi: "Lau sạch các chai siro"
    },
    {
      ru: "Чистота стол",
      en: "Wipe the table clean",
      vi: "Lau bàn cho sạch sẽ"
    },
    {
      ru: "Чистота поверхность бара",
      en: "Clean the bar surface",
      vi: "Lau bề mặt quầy bar"
    },
    {
      ru: "Оборудование с моющим",
      en: "Wash equipment with detergent",
      vi: "Rửa thiết bị bằng nước rửa chén"
    },
    {
      ru: "Раковина",
      en: "Clean the sink",
      vi: "Rửa bồn rửa chén"
    },
    {
      ru: "Выкинуть остатки еды",
      en: "Throw away leftover food",
      vi: "Bỏ thức ăn thừa"
    },
    {
      ru: "Посуду вытереть",
      en: "Dry the dishes",
      vi: "Lau khô chén đĩa"
    },
    {
      ru: "Коврики помыть",
      en: "Wash anti-slip mats",
      vi: "Rửa thảm chống trượt"
    },
    {
      ru: "Кофемашина",
      en: "Clean the coffee machine",
      vi: "Vệ sinh máy pha cà phê"
    },
    {
      ru: "Отключить термопот",
      en: "Turn off the thermal pot",
      vi: "Tắt bình thủy điện"
    },
    {
      ru: "Вынести мусор",
      en: "Take out the trash",
      vi: "Đổ rác"
    },
    {
      ru: "Протереть всё",
      en: "Wipe everything down",
      vi: "Lau chùi mọi thứ"
    },
    {
      ru: "Тряпки на кухню",
      en: "Bring cleaning cloths to the kitchen",
      vi: "Đem khăn lau xuống bếp"
    }
  ]
};

let currentLang = "ru";

function switchLanguage(lang) {
  currentLang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key]) {
      el.textContent = translations[key][lang];
    }
  });

  updateRoleOptions();
  updateNamesAndChecklist();
}

function updateRoleOptions() {
  const roleSelect = document.getElementById("role");
  roleSelect.innerHTML = "";

  roles[currentLang].forEach((role, index) => {
    const option = document.createElement("option");
    option.value = Object.keys(namesByRole)[index];
    option.textContent = role;
    roleSelect.appendChild(option);
  });
}

function updateNamesAndChecklist() {
  const role = document.getElementById("role").value;
  const nameSelect = document.getElementById("name");
  const checklistBlock = document.getElementById("checklist");

  nameSelect.innerHTML = "";
  (namesByRole[role] || []).forEach(name => {
    const opt = document.createElement("option");
    opt.textContent = name;
    opt.value = name;
    nameSelect.appendChild(opt);
  });

  checklistBlock.innerHTML = "";
  (checklistData[role] || []).forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "checklist-item";

    const label = document.createElement("label");
    label.textContent = item[currentLang];

    const select = document.createElement("select");
    ["—", translations.done[currentLang], translations.notDone[currentLang]].forEach(text => {
      const opt = document.createElement("option");
      opt.textContent = text;
      opt.value = text;
      select.appendChild(opt);
    });

    div.appendChild(label);
    div.appendChild(select);
    checklistBlock.appendChild(div);
  });
}

const translations = {
  role: {
    ru: "Должность",
    en: "Position",
    vi: "Chức vụ"
  },
  name: {
    ru: "Имя",
    en: "Name",
    vi: "Tên"
  },
  date: {
    ru: "Дата",
    en: "Date",
    vi: "Ngày"
  },
  submit: {
    ru: "Отправить",
    en: "Submit",
    vi: "Gửi"
  },
  done: {
    ru: "Сделано",
    en: "Done",
    vi: "Đã làm"
  },
  notDone: {
    ru: "Не сделано",
    en: "Not done",
    vi: "Chưa làm"
  }
};

function sendChecklist() {
  alert("Данные отправлены (заглушка)");
}

// Автоинициализация
document.addEventListener("DOMContentLoaded", () => {
  switchLanguage(currentLang);
});