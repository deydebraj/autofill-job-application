// Injected only after the user opens the extension and asks to preview.
(() => {
  if (globalThis.ashbyHelper?.version === "0.11.0") return;
  const normalize = globalThis.ashbyNormalize;
  const aliases = {
    fullName: ["name", "full name", "your name"],
    firstName: ["first name", "given name"],
    lastName: ["last name", "family name", "surname"],
    email: [
      "email",
      "email address",
      "e-mail",
      "e-mail address",
      "your email",
      "your email address",
    ],
    phone: [
      "phone",
      "phone number",
      "mobile",
      "mobile phone",
      "mobile number",
      "telephone",
      "telephone number",
    ],
    linkedin: [
      "linkedin",
      "linkedin url",
      "linkedin profile",
      "linkedin profile url",
    ],
    github: ["github", "github url", "github profile"],
    website: [
      "website",
      "website url",
      "personal website",
      "personal website url",
      "portfolio",
      "portfolio url",
    ],
    location: ["location", "current location", "city", "city of residence"],
    company: ["company", "company name", "current company", "current employer"],
    title: [
      "job title",
      "current title",
      "current job title",
      "current role",
      "current position",
    ],
  };
  const equivalentOptions = [
    ["man", "male"],
    ["woman", "female"],
    ["i prefer not to answer", "prefer not to disclose"],
    ["under 30", "18-20", "21-29"],
  ];
  const extras = globalThis.ashbyExtraFields || [];
  let pending = new Map();
  let previewUrl;
  function label(el) {
    const labelled = (el.getAttribute("aria-labelledby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent || "")
      .join(" ");
    return (
      labelled ||
      el.getAttribute("aria-label") ||
      Array.from(el.labels || [])
        .map((l) => l.textContent)
        .join(" ") ||
      el
        .closest(".ashby-application-form-field-entry, fieldset")
        ?.querySelector(".ashby-application-form-question-title")
        ?.textContent ||
      el.placeholder ||
      el.name ||
      ""
    ).trim();
  }
  function visible(el) {
    return (
      !!el.getClientRects().length &&
      getComputedStyle(el).visibility !== "hidden" &&
      !el.closest('[inert], [aria-hidden="true"]')
    );
  }
  function supported(el) {
    return (
      !el.disabled &&
      !el.readOnly &&
      !el.matches(":disabled") &&
      !el.matches(
        '[role="combobox"], [aria-autocomplete], [aria-haspopup="listbox"], .ashby-application-form-input-date',
      ) &&
      (el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        (el.tagName === "INPUT" &&
          ["text", "email", "tel", "url", "number"].includes(el.type)))
    );
  }
  function answerFor(text, profile) {
    const key = normalize(text);
    // Old scoped answers are not promoted into generic answers.
    const custom = (profile.custom || []).filter(
      (x) =>
        !x.scope &&
        [x.question, ...(x.aliases || [])].some((q) => normalize(q) === key),
    );
    if (custom.length === 1) return String(custom[0].answer || "").trim();
    if (custom.length > 1) return ""; // Ambiguous mappings need correction.
    const extra = extras.find((x) =>
      x.questions.some((q) => normalize(q) === key),
    );
    if (extra) return String(profile[extra.key] || "").trim();
    const field = Object.keys(aliases).find((k) =>
      aliases[k].some((alias) => normalize(alias) === key),
    );
    if (field === "fullName")
      return String(
        profile.fullName ||
          [profile.firstName, profile.lastName].filter(Boolean).join(" "),
      ).trim();
    return field ? String(profile[field] || "").trim() : "";
  }
  function isOptional(text) {
    return extras.some(
      (f) =>
        (f.optional || f.section === "demographics") &&
        f.questions.some((q) => normalize(q) === normalize(text)),
    );
  }
  function resolvedValue(el, answer) {
    if (el.tagName !== "SELECT") return answer;
    const matches = Array.from(el.options).filter(
      (o) =>
        !o.disabled &&
        o.value &&
        (normalize(o.textContent) === normalize(answer) ||
          normalize(o.value) === normalize(answer)),
    );
    return matches.length === 1 ? matches[0].value : null;
  }
  function groupLabel(group) {
    const title = group.querySelector(
      ":scope > .ashby-application-form-question-title, :scope > legend",
    );
    return title?.textContent.trim() || group.getAttribute("aria-label") || "";
  }
  function sameOption(left, right) {
    const a = normalize(left);
    const b = normalize(right);
    return (
      a === b ||
      equivalentOptions.some(
        (group) =>
          group.some((option) => normalize(option) === a) &&
          group.some((option) => normalize(option) === b),
      )
    );
  }
  function checkboxAnswers(answer, field, options) {
    const answers = (
      Array.isArray(answer) ? answer : String(answer || "").split(/[\n;]/)
    )
      .map((value) => String(value).trim())
      .filter(Boolean);
    if (!answers.length) return [];
    const targets = [];
    for (const value of answers) {
      const matches = options.filter((option) => {
        const optionLabel = label(option);
        const aliases = field?.selectionOptionAliases?.[optionLabel] || [];
        return (
          sameOption(optionLabel, value) ||
          aliases.some((alias) => sameOption(alias, value))
        );
      });
      if (matches.length !== 1 || targets.includes(matches[0])) return null;
      targets.push(matches[0]);
    }
    return targets;
  }
  function radiosIn(group, name) {
    return Array.from(group.querySelectorAll('input[type="radio"]')).filter(
      (el) => el.name === name,
    );
  }
  function scan(profile) {
    pending.clear();
    previewUrl = location.href;
    const rows = [];
    const seenGroups = new Set();
    for (const group of document.querySelectorAll(
      ".ashby-application-form-input-yesno",
    )) {
      if (!visible(group)) continue;
      const container = group.closest(".ashby-application-form-field-entry");
      const text =
        container
          ?.querySelector(".ashby-application-form-question-title")
          ?.textContent.trim() || "";
      const options = Array.from(
        group.querySelectorAll("button[data-option][aria-pressed]"),
      );
      const answer = answerFor(text, profile);
      const matches = options.filter(
        (o) => normalize(o.textContent) === normalize(answer),
      );
      const reason = !text
        ? "Unlabelled Yes/No question — complete manually"
        : options.some((o) => o.getAttribute("aria-pressed") === "true")
          ? "Already filled — preserved"
          : !answer
            ? "No saved answer"
            : matches.length !== 1
              ? "No unique matching option"
              : matches[0].disabled
                ? "Complete manually"
                : "";
      const id = crypto.randomUUID();
      rows.push({
        id,
        label: text || "(Yes/No question)",
        answer: reason ? "" : answer,
        reason,
        optional: isOptional(text),
      });
      if (!reason)
        pending.set(id, {
          kind: "yesno",
          group,
          container,
          label: text,
          el: matches[0],
          options,
        });
    }
    for (const el of document.querySelectorAll(
      'input, textarea, select, button[role="combobox"]',
    )) {
      if (el.closest(".ashby-application-form-input-yesno")) continue;
      if (el.type === "checkbox") {
        const group = el.closest(
          '.ashby-application-form-input-checkbox-group, fieldset, [role="group"], [role="checkboxgroup"]',
        );
        if (!group || seenGroups.has(group) || !visible(group)) continue;
        seenGroups.add(group);
        const text = groupLabel(group);
        const field = extras.find((x) =>
          x.questions.some((q) => normalize(q) === normalize(text)),
        );
        const options = Array.from(
          group.querySelectorAll('input[type="checkbox"]'),
        );
        const answer = answerFor(text, profile);
        const targets = checkboxAnswers(answer, field, options);
        const alreadyFilled = options.some((option) => option.checked);
        const reason = !text
          ? "Unlabelled checkbox group — complete manually"
          : alreadyFilled
            ? "Already filled — preserved"
            : !answer
              ? "No saved answer"
              : !targets?.length
                ? "No unique matching option"
                : targets.some((option) => option.matches(":disabled"))
                  ? "Complete manually"
                  : "";
        const id = crypto.randomUUID();
        const optional = isOptional(text);
        rows.push({
          id,
          label: text || "(Checkbox group)",
          answer: reason ? "" : answer,
          reason,
          optional,
          suggestion: reason === "Complete manually" ? answer : "",
        });
        if (!reason)
          pending.set(id, {
            kind: "checkbox",
            group,
            label: text,
            options,
            targets,
            optionLabels: targets.map(label),
          });
        continue;
      }
      if (el.type === "radio") {
        const group = el.closest('fieldset, [role="radiogroup"]');
        if (!group || seenGroups.has(group) || !visible(group)) continue;
        seenGroups.add(group);
        const text = groupLabel(group);
        const options = radiosIn(group, el.name);
        const answer = answerFor(text, profile);
        const matches = options.filter((o) => sameOption(label(o), answer));
        let reason = !text
          ? "Unlabelled radio group — complete manually"
          : options.some((o) => o.checked)
            ? "Already filled — preserved"
            : !answer
              ? "No saved answer"
              : matches.length !== 1
                ? "No unique matching option"
                : matches[0].matches(":disabled")
                  ? "Complete manually"
                  : "";
        const id = crypto.randomUUID();
        const optional = isOptional(text);
        rows.push({
          id,
          label: text || "(Radio group)",
          answer: reason ? "" : answer,
          reason,
          optional,
        });
        if (!reason)
          pending.set(id, {
            kind: "radio",
            group,
            name: el.name,
            el: matches[0],
            label: text,
            optionLabel: label(matches[0]),
            options,
          });
        continue;
      }
      if (
        !visible(el) ||
        el.type === "hidden" ||
        (["submit", "button", "reset"].includes(el.type) &&
          el.getAttribute("role") !== "combobox")
      )
        continue;
      const text = label(el) || "(Unlabelled field)";
      const answer = answerFor(text, profile);
      let reason = "";
      if (!supported(el)) reason = "Complete manually";
      else if (el.value.trim()) reason = "Already filled — preserved";
      else if (!answer) reason = "No saved answer";
      const value = reason ? null : resolvedValue(el, answer);
      if (!reason && value === null) reason = "No unique matching option";
      if (!reason && el.maxLength > 0 && value.length > el.maxLength)
        reason = "Answer exceeds field limit";
      const id = crypto.randomUUID();
      rows.push({
        id,
        label: text,
        answer: reason ? "" : answer,
        reason,
        optional: isOptional(text),
        suggestion: reason === "Complete manually" ? answer : "",
      });
      if (!reason)
        pending.set(id, { el, label: text, value, original: el.value });
    }
    return rows;
  }
  function fill(ids) {
    if (location.href !== previewUrl)
      throw new Error("Page changed. Preview the application again.");
    let filled = 0,
      skipped = 0;
    for (const id of ids) {
      const item = pending.get(id);
      if (!item) {
        skipped++;
        continue;
      }
      if (item.kind === "yesno") {
        const { el, group, container, options } = item;
        const current = Array.from(
          group.querySelectorAll("button[data-option][aria-pressed]"),
        );
        if (
          !el.isConnected ||
          !group.isConnected ||
          !visible(group) ||
          el.disabled ||
          container
            .querySelector(".ashby-application-form-question-title")
            ?.textContent.trim() !== item.label ||
          current.length !== options.length ||
          current.some(
            (o, i) =>
              o !== options[i] || o.getAttribute("aria-pressed") === "true",
          )
        ) {
          skipped++;
          continue;
        }
        // Ashby uses buttons with no type attribute. Block native form submission,
        // while allowing the click event to reach React's delegated handlers.
        const preventSubmit = (event) => event.preventDefault();
        el.addEventListener("click", preventSubmit, {
          capture: true,
          once: true,
        });
        try {
          el.click();
        } finally {
          el.removeEventListener("click", preventSubmit, true);
        }
        if (el.getAttribute("aria-pressed") === "true") filled++;
        else skipped++;
        continue;
      }
      if (item.kind === "radio") {
        const { el, group, name, options } = item;
        const current = radiosIn(group, name);
        if (
          !group.isConnected ||
          !el.isConnected ||
          !visible(group) ||
          el.matches(":disabled") ||
          groupLabel(group) !== item.label ||
          label(el) !== item.optionLabel ||
          current.length !== options.length ||
          current.some((o, i) => o !== options[i] || o.checked)
        ) {
          skipped++;
          continue;
        }
        el.click(); // Native radio activation notifies React through its click/change handlers.
        if (el.checked) filled++;
        else skipped++;
        continue;
      }
      if (item.kind === "checkbox") {
        const { group, options, targets, optionLabels } = item;
        const current = Array.from(
          group.querySelectorAll('input[type="checkbox"]'),
        );
        if (
          !group.isConnected ||
          !visible(group) ||
          groupLabel(group) !== item.label ||
          current.length !== options.length ||
          current.some(
            (option, index) => option !== options[index] || option.checked,
          ) ||
          targets.some(
            (option, index) =>
              !option.isConnected ||
              option.matches(":disabled") ||
              label(option) !== optionLabels[index],
          )
        ) {
          skipped++;
          continue;
        }
        for (const option of targets) option.click();
        if (targets.every((option) => option.checked)) filled++;
        else skipped++;
        continue;
      }
      const { el, value, original } = item;
      if (
        !el.isConnected ||
        !visible(el) ||
        !supported(el) ||
        el.value !== original ||
        label(el) !== item.label
      ) {
        skipped++;
        continue;
      }
      const proto =
        el.tagName === "SELECT"
          ? HTMLSelectElement.prototype
          : el.tagName === "TEXTAREA"
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      if (el.value === value) filled++;
      else skipped++;
    }
    pending.clear();
    return { filled, skipped };
  }
  globalThis.ashbyHelper = { version: "0.11.0", scan, fill };
})();
