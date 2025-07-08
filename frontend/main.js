let currentEditIndex = null;
const baseUrl = "http://localhost:8000";


async function loadRules() {
  const res = await fetch(`${baseUrl}/rules`);
  const rules = await res.json();
  const tbody = document.querySelector("#rulesTable tbody");
  tbody.innerHTML = "";
  rules.forEach((rule, index) => {
    const row = document.createElement("tr");
    row.className = index % 2 === 0 ? "bg-white" : "bg-gray-50";
    row.innerHTML = `<td class="px-3 py-2">${index + 1}</td>
      <td class="px-3 py-2">${rule.description || "No description"}</td>
      <td class="px-3 py-2">
        <button onclick="toggleActive(${index})" class="focus:outline-none group" aria-label="Change status">
          <span class="relative inline-block w-10 h-6 align-middle select-none transition">
            <span class="absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-200 ${rule.active ? 'bg-green-400' : 'bg-gray-300'}"></span>
            <span class="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border border-gray-300 shadow transform transition-transform duration-200 ${rule.active ? 'translate-x-4' : ''}"></span>
          </span>
        </button>
      </td>
      <td class="px-3 py-2 space-x-1">
        <button onclick="editRule(${index})" class="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Edit</button>
        <button onclick="deleteRule(${index})" class="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Remove</button>
        <button onclick="copyRule(${index})" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">Copy</button>
      </td>`;
    tbody.appendChild(row);

    const subrow = document.createElement("tr");
    subrow.className = index % 2 === 0 ? "bg-white" : "bg-gray-50";
    subrow.innerHTML = `<td colspan="4" class="px-3 py-1 text-xs text-gray-500 font-mono">${rule.filter || "<empty>"}</td>`;
    tbody.appendChild(subrow);
  });
}

function fillForm(rule) {
  document.getElementById("description").value = rule.description || "";
  document.getElementById("filter").value = rule.filter || "";
  document.getElementById("urlReplace_old").value = rule.url_replace?.old || "";
  document.getElementById("urlReplace_new").value = rule.url_replace?.new || "";
  document.getElementById("isActive").checked = rule.active !== false;

  document.getElementById("requestHeaders").value =
    rule?.request_mod?.headers
      ? JSON.stringify(rule.request_mod.headers, null, 2)
      : "";
  document.getElementById("requestBodyReplace").value =
    rule?.request_mod?.body_replace
      ? JSON.stringify(rule.request_mod.body_replace, null, 2)
      : "";
  document.getElementById("requestFullBodyReplace").value =
    rule?.request_mod?.full_body_replace || "";

  document.getElementById("responseHeaders").value =
    rule?.response_mod?.headers
      ? JSON.stringify(rule.response_mod.headers, null, 2)
      : "";
  document.getElementById("responseBodyReplace").value =
    rule?.response_mod?.body_replace
      ? JSON.stringify(rule.response_mod.body_replace, null, 2)
      : "";
  document.getElementById("responseFullBodyReplace").value =
    rule?.response_mod?.full_body_replace || "";
}

function openModal() {
  clearForm();
  document.getElementById("modal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

document.getElementById("openModalButton").onclick = openModal;
document.getElementById("closeModalButton").onclick = closeModal;

async function editRule(index) {
  const res = await fetch(`${baseUrl}/rules`);
  const rules = await res.json();
  const rule = rules[index];
  openModal();
  fillForm(rule);
  currentEditIndex = index;
  document.getElementById("formTitle").innerText = `Edit Rule #${index + 1}`;
  document.getElementById("submitButton").innerText = "Update Rule";
}

async function copyRule(index) {
  const res = await fetch(`${baseUrl}/rules`);
  const rules = await res.json();
  const rule = rules[index];
  openModal();
  fillForm(rule);
  currentEditIndex = null;
  document.getElementById("formTitle").innerText = `Copy Rule #${index + 1}`;
  document.getElementById("submitButton").innerText = "Add Rule";
}

function clearForm() {
  currentEditIndex = null;
  document.getElementById("formTitle").innerText = "New Rule";
  document.getElementById("submitButton").innerText = "Add Rule";
  document
    .querySelectorAll("input, textarea")
    .forEach((e) => (e.value = ""));
  document.getElementById("isActive").checked = true;
}

async function deleteRule(index) {
  if (!confirm("Are you sure you want to delete this rule?")) return;
  await fetch(`${baseUrl}/rules/${index}`, {
    method: "DELETE",
  });
  loadRules();
}

async function toggleActive(index) {
  const res = await fetch(`${baseUrl}/rules`);
  const rules = await res.json();
  const rule = rules[index];
  rule.active = !rule.active;
  await fetch(`${baseUrl}/rules/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rule),
  });
  loadRules();
}

async function submitRule() {
  const rule = {
    description: document.getElementById("description").value,
    filter: document.getElementById("filter").value,
  };
  rule.active = document.getElementById("isActive").checked;
  const urlReplaceOld = document.getElementById("urlReplace_old").value;
  const urlReplaceNew = document.getElementById("urlReplace_new").value;
  if (urlReplaceOld && urlReplaceNew) rule.url_replace = { old: urlReplaceOld, new: urlReplaceNew };
  const reqHeaders = document.getElementById("requestHeaders").value;
  const reqBodyReplace =
    document.getElementById("requestBodyReplace").value;
  const reqFullBody = document.getElementById(
    "requestFullBodyReplace"
  ).value;
  const resHeaders = document.getElementById("responseHeaders").value;
  const resBodyReplace = document.getElementById(
    "responseBodyReplace"
  ).value;
  const resFullBody = document.getElementById(
    "responseFullBodyReplace"
  ).value;
  if (reqHeaders || reqBodyReplace || reqFullBody) {
    rule.request_mod = {};
    if (reqHeaders) rule.request_mod.headers = JSON.parse(reqHeaders);
    if (reqBodyReplace)
      rule.request_mod.body_replace = JSON.parse(reqBodyReplace);
    if (reqFullBody) rule.request_mod.full_body_replace = reqFullBody;
  }
  if (resHeaders || resBodyReplace || resFullBody) {
    rule.response_mod = {};
    if (resHeaders) rule.response_mod.headers = JSON.parse(resHeaders);
    if (resBodyReplace)
      rule.response_mod.body_replace = JSON.parse(resBodyReplace);
    if (resFullBody) rule.response_mod.full_body_replace = resFullBody;
  }
  if (currentEditIndex !== null) {
    await fetch(`${baseUrl}/rules/${currentEditIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
  } else {
    await fetch(`${baseUrl}/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
  }
  clearForm();
  closeModal();
  loadRules();
}

// Optional: close modal on ESC key
document.addEventListener("keydown", (e) => {
  if (
    !document.getElementById("modal").classList.contains("hidden") &&
    e.key === "Escape"
  ) {
    closeModal();
  }
});

loadRules();
