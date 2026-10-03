# Job Application Helper — version 0.11.0

A generic Chrome extension for filling common Ashby and Greeenhouse job application questions from a locally saved profile.

## Demo Video

https://youtu.be/eoX5LU5WGPA

## Update an existing installation

1. Close the profile settings tab.
2. Unzip this download and replace the files in the SAME extension folder you originally loaded.
3. Open `chrome://extensions` and click **Reload** on the extension card. Confirm version **0.11.0**.
4. Refresh your application tab.
5. Open the extension from Chrome's puzzle-piece menu → **Edit profile** → review the generic fields → **Save profile**.

Do not uninstall first: keeping the same extension folder preserves your saved common details. Old employer-specific fields and scoped custom answers are not used or displayed. New generic replacements start blank. Saving the new profile removes the retired fields from the stored profile.

## First installation

1. Unzip the download.
2. Open `chrome://extensions` and enable Developer mode.
3. Select **Load unpacked** and choose the folder containing `manifest.json`.
4. Open the extension → **Edit profile** → enter your answers → **Save profile**.
5. Open a form on `https://jobs.ashbyhq.com`, or the Ashby careers page linked to the job, and select **Apply**.
6. Click **Preview fields**, review selections, then **Fill selected fields**.
7. Finish manual fields, review validation and submit yourself.

## Generic profile

- Personal details and links: name, email, phone, location, professional links, current employer and title.
- Common questions: legal/preferred name, country/time zone, work authorization, sponsorship, experience by skill, startup experience, notice period, availability, relocation and work arrangements.
- Application answers: referral source, interest in the role, relevant experience, AI usage, salary expectations and additional information.
- Optional demographic answers: left blank unless supplied; saved answers start unchecked in previews.
- Other reusable answers: a question, equivalent wording and your own answer. No employer names or scope controls are built into the profile.

The catalog has 51 extra fields with 122 question wordings, plus 11 basic profile details. Each extra field shows the labels it matches. These are curated mappings, not a claim that every wording appeared in the sampled public forms.

## Matching behavior

Matching normalizes capitalization, whitespace, trailing punctuation, required markers and apostrophe style. Common profile fields accept equivalent labels such as **Name** or **Full name** for a saved first/last name, and **Email** or **Email address** for email. Gender identity recognizes both **What gender do you identify as?** and **What is your gender identity?**, and matches equivalent choices such as **Male/Man**, **Female/Woman**, and **Prefer not to disclose/I prefer not to answer**. Age range recognizes **What is your current age?**; saved **18-20** and **21-29** answers map to the form's **Under 30** option, and old **Prefer not to disclose** answers map to **I prefer not to answer**. Equivalent questions must be explicitly listed; no AI or fuzzy inference is used. Unknown questions remain blank. Custom answers override a built-in match; ambiguous custom mappings are skipped.

The Ashby job application example also has reusable profile fields for the intended work country, renewals-management experience, CRM tools, coaching/developing direct reports, and coaching a discount request. Existing sponsorship wording and role-interest answers are matched to their equivalent prompts. Country autocomplete remains a manual selection; the saved country is shown as a suggestion. Age uses the form's radio group; ethnicity and community selections use checkbox groups. Enter only the exact demographic choices you want filled, one per line, in the optional profile fields.

Education is matched against the listed radio choices. Sponsorship and salary-range alignment use Yes/No answers. The conditional desired-pay-range details have a separate text profile field.

US work authorization is kept separate from sponsorship. Experience is kept separate by skill. Current-only sponsorship, different-country work rights and city-specific relocation are not inferred from more general answers. Legal and display names are separate.

Reusable narrative and salary answers need your review on each application. Include currency and pay period in salary answers. Generic questions match their listed wording; prompts naming an employer or imposing additional constraints may require manual completion.

## Supported controls and limits

Text inputs, textareas, native selects, labelled radio groups, labelled checkbox groups and Ashby Yes/No buttons are supported. Existing entries and choices are preserved. Optional demographic answers start unchecked in the preview; select the checkbox for a demographic answer you want to fill. Inputs changed since preview are skipped. The extension never clicks Submit.

Resume/cover-letter uploads, custom dropdowns, date pickers, standalone checkboxes and location autocomplete remain manual. Where a saved answer exists, manual controls show it as a suggestion. The Ashby careers page's application iframe is supported after selecting **Apply**. Other embedded forms, cross-origin iframes and company-domain forms are not supported.

Keep the popup open between preview and fill. Preview again after changing the form or saved profile. Always review website validation and the final answers.

## Privacy

Uses local extension storage, activeTab, scripting and host access to `jobs.ashbyhq.com` so the extension can fill applications embedded by Ashby's careers page. No backend, analytics, AI service or network request is added by the extension. Local storage is not encrypted by the extension. Filled values become available to the application website, which may autosave them. Delete saved data from the profile page.

## Validation and development

Focused jsdom checks passed all 122 catalog question wordings and the mapped fields on the sample Ashby applications, including radio and checkbox groups, Yes/No buttons, narrative inputs, and manual autocomplete suggestions. JavaScript syntax, manifest, and whitespace checks passed.

jsdom does not render layout or verify real React integration. Live Chrome autofill remains unverified. A separate Playwright test is included but requires a local Chromium installation.

```sh
npm install --no-save jsdom playwright
node tests/generic.cjs
npx playwright install chromium
node tests/engine.cjs
```

No dependencies or build are needed to install the extension itself. After code changes, reload the extension and refresh the application tab.
