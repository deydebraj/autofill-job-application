const $ = (id) => document.getElementById(id);
let tabId;
let frameId;
$("profile").onclick = () => chrome.runtime.openOptionsPage();
async function run(func, args = []) {
  const results = await chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    func,
    args,
  });
  return results[0].result;
}
$("preview").onclick = async () => {
  $("fill").hidden = true;
  $("fields").replaceChildren();
  $("preview").disabled = true;
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const url = new URL(tab.url);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("Open the application form on a web page and select Apply first.");
    tabId = tab.id;
    const directApplication =
      url.pathname.split("/").filter(Boolean).at(-1) === "application";
    const { profile } = await chrome.storage.local.get("profile");
    if (!profile)
      throw new Error("Save your profile first using Edit profile.");
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["fields.js", "engine.js"],
    });
    if (directApplication) {
      frameId = 0;
    } else {
      const frames = await chrome.scripting.executeScript({
        target: { tabId, allFrames: true },
        func: () => ({
          pathname: location.pathname,
        }),
      });
      const applicationFrame = frames.find(
        ({ result }) =>
          result.pathname.split("/").filter(Boolean).at(-1) === "application",
      );
      frameId = applicationFrame ? applicationFrame.frameId : 0;
    }
    const rows = await run(
      (profile) => globalThis.ashbyHelper.scan(profile),
      [profile],
    );
    let available = 0;
    for (const row of rows) {
      const card = document.createElement("label");
      card.className = "field";
      if (!row.reason) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !row.optional;
        checkbox.value = row.id;
        card.append(checkbox);
        available++;
      }
      const body = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = row.label;
      const detail = document.createElement("small");
      detail.textContent =
        (row.reason
          ? row.reason +
            (row.suggestion ? " — saved value: " + row.suggestion : "")
          : "") ||
        row.answer + (row.optional ? " — optional; check to include" : "");
      body.append(title, detail);
      card.append(body);
      $("fields").append(card);
    }
    $("fill").hidden = !available;
    $("status").textContent = rows.length
      ? `${available} fields ready. Review selections. Optional demographic answers start unchecked.`
      : "No fields found. Open the application form and try again.";
  } catch (error) {
    $("status").textContent = error.message;
  } finally {
    $("preview").disabled = false;
  }
};
$("fill").onclick = async () => {
  $("fill").disabled = true;
  try {
    const ids = Array.from(
      document.querySelectorAll("#fields input:checked"),
    ).map((el) => el.value);
    const result = await run((ids) => globalThis.ashbyHelper.fill(ids), [ids]);
    $("status").textContent =
      `Filled ${result.filled} fields. Skipped ${result.skipped}. Review the form, including any validation messages, before submitting.`;
    $("fill").hidden = true;
  } catch (error) {
    $("status").textContent = `${error.message} Preview again to retry.`;
  } finally {
    $("fill").disabled = false;
  }
};
