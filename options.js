const fields = {
  firstName: "First name",
  lastName: "Last name",
  fullName: "Full name (optional override)",
  email: "Email address",
  phone: "Phone number",
  location: "City / location",
  linkedin: "LinkedIn URL",
  github: "GitHub URL",
  website: "Portfolio / website URL",
  company: "Current company",
  title: "Current job title",
};
const $ = (id) => document.getElementById(id);
for (const [key, title] of Object.entries(fields)) {
  const label = document.createElement("label");
  label.textContent = title;
  const input = document.createElement("input");
  input.id = key;
  input.type =
    key === "email"
      ? "email"
      : ["linkedin", "github", "website"].includes(key)
        ? "url"
        : "text";
  label.append(input);
  $("profile-fields").append(label);
}
for (const field of globalThis.ashbyExtraFields) {
  const label = document.createElement("label");
  label.textContent = field.label;
  const input = document.createElement(
    field.options ? "select" : field.type === "textarea" ? "textarea" : "input",
  );
  input.id = field.key;
  if (field.options) {
    for (const value of ["", ...field.options]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value || "Leave blank / complete manually";
      input.append(option);
    }
  } else if (input.tagName === "INPUT") input.type = field.type || "text";
  if (input.type === "number") {
    input.min = "0";
    input.step = "0.1";
  }
  const equivalents = document.createElement("small");
  equivalents.textContent =
    "Matches: " +
    field.questions.join(" • ") +
    (field.selectionOptions
      ? ". Enter one matching option per line: " +
        field.selectionOptions.join(" • ")
      : "");
  label.append(input, equivalents);
  $(field.section + "-fields").append(label);
}
const allKeys = [
  ...Object.keys(fields),
  ...globalThis.ashbyExtraFields.map((x) => x.key),
];
function profileValue(key, value) {
  if (key !== "surveyAgeRange") return value || "";
  return (
    {
      "18-20": "Under 30",
      "21-29": "Under 30",
      "Prefer not to disclose": "I prefer not to answer",
    }[value] ||
    value ||
    ""
  );
}
function addAnswer(question = "", answer = "", aliases = []) {
  const row = document.createElement("div");
  row.className = "answer";
  const qLabel = document.createElement("label");
  qLabel.textContent = "Exact question";
  const q = document.createElement("input");
  q.className = "question";
  q.value = question;
  qLabel.append(q);
  const aLabel = document.createElement("label");
  aLabel.textContent = "Your answer";
  const a = document.createElement("textarea");
  a.className = "response";
  a.value = answer;
  aLabel.append(a);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "secondary";
  remove.textContent = "Remove";
  remove.onclick = () => row.remove();
  const variantsLabel = document.createElement("label");
  variantsLabel.textContent = "Equivalent questions (one per line)";
  const variants = document.createElement("textarea");
  variants.className = "aliases";
  variants.value = aliases.join("\n");
  variantsLabel.append(variants);
  row.append(qLabel, variantsLabel, aLabel, remove);
  $("answers").append(row);
}
$("add").onclick = () => addAnswer();
(async () => {
  try {
    const { profile = {} } = await chrome.storage.local.get("profile");
    for (const key of allKeys) $(key).value = profileValue(key, profile[key]);
    for (const item of (profile.custom || []).filter((item) => !item.scope))
      addAnswer(item.question, item.answer, item.aliases || []);
  } catch (e) {
    $("status").textContent = e.message;
  }
})();
$("form").onsubmit = async (event) => {
  event.preventDefault();
  const profile = Object.fromEntries(
    allKeys.map((key) => [key, $(key).value.trim()]),
  );
  profile.custom = Array.from(document.querySelectorAll(".answer"))
    .map((row) => ({
      question: row.querySelector(".question").value.trim(),
      answer: row.querySelector(".response").value.trim(),
      aliases: row
        .querySelector(".aliases")
        .value.split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    }))
    .filter((row) => row.question && row.answer);
  const keys = profile.custom.flatMap((x) =>
    [x.question, ...x.aliases].map((q) => globalThis.ashbyNormalize(q)),
  );
  if (new Set(keys).size !== keys.length) {
    $("status").textContent =
      "Remove duplicate questions or variants before saving.";
    return;
  }
  try {
    await chrome.storage.local.set({ profile });
    $("status").textContent =
      "Saved. Open an Ashby application and click the extension to preview fields.";
  } catch (e) {
    $("status").textContent = e.message;
  }
};
$("clear").onclick = async () => {
  if (!confirm("Delete your saved profile and answers from this browser?"))
    return;
  try {
    await chrome.storage.local.remove("profile");
    $("form").reset();
    $("answers").replaceChildren();
    $("status").textContent = "Saved profile deleted.";
  } catch (e) {
    $("status").textContent = e.message;
  }
};
