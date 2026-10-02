(() => {
globalThis.ashbyNormalize = value => String(value || '').normalize('NFKC').toLowerCase()
  .replace(/[’‘]/g,"'").replace(/[*:]/g,'').replace(/\s+/g,' ').trim().replace(/[?.!]+$/,'').trim();
globalThis.ashbyExtraFields = [
  {
    "key": "otherLink",
    "label": "Other link",
    "questions": [
      "Other"
    ],
    "type": "url",
    "section": "common"
  },
  {
    "key": "gender",
    "label": "Gender",
    "questions": [
      "Gender"
    ],
    "options": [
      "Male",
      "Female",
      "Decline to self-identify"
    ],
    "section": "demographics"
  },
  {
    "key": "race",
    "label": "Race",
    "questions": [
      "Race"
    ],
    "options": [
      "Hispanic or Latino",
      "White (Not Hispanic or Latino)",
      "Black or African American (Not Hispanic or Latino)",
      "Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)",
      "Asian (Not Hispanic or Latino)",
      "American Indian or Alaska Native (Not Hispanic or Latino)",
      "Two or More Races (Not Hispanic or Latino)",
      "Decline to self-identify"
    ],
    "section": "demographics"
  },
  {
    "key": "veteran",
    "label": "Veteran Status",
    "questions": [
      "Veteran Status"
    ],
    "options": [
      "I identify as one or more of the classifications of protected veteran listed above",
      "I am not a protected veteran",
      "I decline to self-identify for protected veteran status"
    ],
    "section": "demographics"
  },
  {
    "key": "cityTimezone",
    "label": "City and time zone",
    "questions": [
      "Where are you located? (City and timezone)",
      "What is your current city and time zone?",
      "Current city and timezone"
    ],
    "section": "common"
  },
  {
    "key": "workAuthorizationUS",
    "label": "Legally authorized to work in the United States?",
    "questions": [
      "Are you legally authorized to work in the United States?",
      "Are you legally authorized to work in the United States of America?",
      "Are you authorized to work in the US?",
      "Are you legally authorized to work in the U.S.?",
      "Do you have authorization to work in the United States?"
    ],
    "options": [
      "Yes",
      "No"
    ],
    "section": "common"
  },
  {
    "key": "visaSponsorship",
    "label": "Will you now or in the future require visa sponsorship?",
    "questions": [
      "Will you now or in the future require visa sponsorship?",
      "Will you now or in the future require sponsorship for employment visa status (e.g., H-1B, O-1, etc.)?",
      "Will you now or in the future require visa sponsorship for employment in the United States of America?",
      "Will you now or in the future require sponsorship to work in the United States?",
      "Do you now or will you in the future require visa sponsorship?"
    ],
    "options": [
      "Yes",
      "No",
      "Not sure"
    ],
    "section": "common"
  },
  {
    "key": "relevantWork",
    "label": "GitHub, portfolio, or other relevant work link",
    "questions": [
      "Link to your GitHub, portfolio, or other relevant work",
      "Link to your portfolio or GitHub",
      "GitHub or portfolio URL"
    ],
    "type": "url",
    "section": "common"
  },
  {
    "key": "startupExperience",
    "label": "Have you worked in a fast-moving startup or similar environment before?",
    "questions": [
      "Have you worked in a fast-moving startup or similar environment before?",
      "Do you have experience working at a startup?",
      "Have you worked at a startup before?"
    ],
    "options": [
      "Yes",
      "No"
    ],
    "section": "common"
  },
  {
    "key": "earliestStart",
    "label": "Earliest possible start date (shown for manual date-picker entry)",
    "questions": [
      "Earliest possible start date",
      "Earliest start date",
      "Available start date",
      "What is your earliest available start date?"
    ],
    "type": "date",
    "section": "common"
  },
  {
    "key": "pronouns",
    "label": "Pronouns (optional)",
    "questions": [
      "Pronouns",
      "What are your pronouns?",
      "Preferred pronouns"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "preferredName",
    "label": "Preferred name",
    "questions": [
      "Preferred name",
      "What name do you go by?"
    ],
    "section": "common"
  },
  {
    "key": "legalFullName",
    "label": "Legal full name",
    "questions": [
      "Legal name",
      "Legal full name",
      "Full legal name"
    ],
    "section": "common"
  },
  {
    "key": "country",
    "label": "Country of residence",
    "questions": [
      "Country",
      "Country of residence",
      "What country do you currently reside in?"
    ],
    "section": "common"
  },
  {
    "key": "timezone",
    "label": "Time zone",
    "questions": [
      "Timezone",
      "Time zone",
      "Current time zone",
      "What time zone are you in?"
    ],
    "section": "common"
  },
  {
    "key": "noticePeriod",
    "label": "Notice period",
    "questions": [
      "Notice period",
      "Current notice period",
      "What is your notice period?",
      "How much notice do you need to give your current employer?"
    ],
    "section": "common"
  },
  {
    "key": "startAvailability",
    "label": "Start availability (text, e.g. two weeks after offer)",
    "questions": [
      "When can you start?",
      "When would you be available to start?",
      "What is your availability to start?"
    ],
    "section": "common"
  },
  {
    "key": "yearsTotal",
    "label": "Total professional experience (years)",
    "questions": [
      "Years of professional experience",
      "Total years of experience",
      "How many years of professional experience do you have?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "yearsSoftware",
    "label": "Software engineering experience (years)",
    "questions": [
      "Years of software engineering experience",
      "How many years of software engineering experience do you have?",
      "How many years of professional software development experience do you have?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "yearsFrontend",
    "label": "Frontend experience (years)",
    "questions": [
      "Years of frontend experience",
      "How many years of frontend development experience do you have?",
      "How many years of front-end development experience do you have?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "yearsReact",
    "label": "React experience (years)",
    "questions": [
      "Years of React experience",
      "How many years of experience do you have with React?",
      "How many years of React experience do you have?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "yearsTypeScript",
    "label": "TypeScript experience (years)",
    "questions": [
      "Years of TypeScript experience",
      "How many years of experience do you have with TypeScript?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "yearsJavaScript",
    "label": "JavaScript experience (years)",
    "questions": [
      "Years of JavaScript experience",
      "How many years of experience do you have with JavaScript?"
    ],
    "type": "number",
    "section": "common"
  },
  {
    "key": "willingRelocate",
    "label": "Open to relocation (general)",
    "questions": [
      "Are you willing to relocate?",
      "Are you open to relocation?",
      "Willing to relocate"
    ],
    "options": [
      "Yes",
      "No"
    ],
    "section": "common"
  },
  {
    "key": "projectDemo",
    "label": "Demo link to your proudest personal project",
    "questions": [
      "Demo link to the personal project you are most proud of",
      "Link to a demo of your proudest personal project"
    ],
    "type": "url",
    "section": "common"
  },
  {
    "key": "surveyAgeRange",
    "label": "Optional survey — age range",
    "questions": [
      "What is your age range?"
    ],
    "options": [
      "18-20",
      "21-29",
      "30-39",
      "40-49",
      "50-59",
      "60 or older",
      "Prefer not to disclose"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "surveyEthnicity",
    "label": "Optional survey — ethnicity (exact option text)",
    "questions": [
      "What ethnicity do you identify as?"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "surveyGender",
    "label": "Optional survey — gender identity",
    "questions": [
      "What gender do you identify as?"
    ],
    "options": [
      "Female",
      "Male",
      "Non-binary",
      "Prefer not to disclose"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "surveyLGBTQ",
    "label": "Optional survey — LGBTQIA+ identity",
    "questions": [
      "Do you identify as LGBTQIA+?"
    ],
    "options": [
      "Yes",
      "No",
      "Prefer not to disclose"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "surveyVeteran",
    "label": "Optional survey — veteran (not protected-veteran classification)",
    "questions": [
      "Do you identify as a veteran?"
    ],
    "options": [
      "I am a veteran",
      "I am not a veteran",
      "I prefer not to disclose"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "surveyDisability",
    "label": "Optional survey — disability or health condition",
    "questions": [
      "Do you consider to have a disability or health condition?",
      "Do you have a disability?"
    ],
    "options": [
      "Yes",
      "No",
      "Prefer not to disclose"
    ],
    "section": "demographics",
    "optional": true
  },
  {
    "key": "applicationSource",
    "label": "How did you hear about this opportunity?",
    "questions": [
      "How did you hear about this opportunity?",
      "How did you hear about us?",
      "Where did you hear about this role?",
      "How did you find this job?"
    ],
    "section": "application"
  },
  {
    "key": "applicationSourceOther",
    "label": "Other source details",
    "questions": [
      "If other, please specify:",
      "If other, please specify how you heard about us"
    ],
    "section": "application"
  },
  {
    "key": "applicationMotivation",
    "label": "Interest in the role",
    "questions": [
      "Why are you interested in this role?",
      "What interests you about this position?",
      "Why are you applying for this position?"
    ],
    "section": "application",
    "type": "textarea"
  },
  {
    "key": "applicationSummary",
    "label": "Relevant experience summary",
    "questions": [
      "Tell us about yourself",
      "Briefly describe your relevant experience",
      "What makes you a good fit for this role?"
    ],
    "section": "application",
    "type": "textarea"
  },
  {
    "key": "applicationAI",
    "label": "How you use AI",
    "questions": [
      "How are you currently leveraging AI?",
      "How do you use AI in your work?",
      "Describe how you use AI tools in your workflow"
    ],
    "section": "application",
    "type": "textarea"
  },
  {
    "key": "applicationAdditional",
    "label": "Additional information",
    "questions": [
      "Additional information",
      "Anything else you would like us to know?",
      "Is there anything else you would like to share?"
    ],
    "section": "application",
    "type": "textarea"
  },
  {
    "key": "expectedSalary",
    "label": "Expected salary (include currency and pay period)",
    "questions": [
      "Salary expectations",
      "What are your salary expectations?",
      "Expected salary",
      "Desired salary"
    ],
    "section": "application"
  },
  {
    "key": "onsiteAvailable",
    "label": "Available to work on-site",
    "questions": [
      "Are you available to work on-site?",
      "Are you willing to work on-site?"
    ],
    "section": "common",
    "options": [
      "Yes",
      "No"
    ]
  },
  {
    "key": "hybridAvailable",
    "label": "Available for a hybrid work arrangement",
    "questions": [
      "Are you willing to work a hybrid schedule?",
      "Are you comfortable with a hybrid work arrangement?"
    ],
    "section": "common",
    "options": [
      "Yes",
      "No"
    ]
  },
  {
    "key": "relocationAvailability",
    "label": "Time needed to relocate",
    "questions": [
      "If relocating, estimated time needed for relocation",
      "How much time would you need to relocate?"
    ],
    "section": "common"
  },
  {
    "key": "plannedLeave",
    "label": "Planned leave within the next three months",
    "questions": [
      "Do you have any holidays/leave scheduled within the next 3 months?",
      "Do you have any planned leave in the next three months?"
    ],
    "section": "common",
    "type": "textarea"
  }
];
})();
