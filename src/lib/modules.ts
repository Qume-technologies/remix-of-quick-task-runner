export type Field = { name: string; label: string; type?: "text" | "number" | "date" | "select" | "textarea" | "email"; options?: string[] };
export type ModuleConfig = { key: string; title: string; description: string; fields: Field[]; columns: string[]; statusField?: string; rows: Record<string, any>[]; kanban?: boolean; readOnly?: boolean; preview?: boolean };

const pick = <T,>(a: T[], i: number) => a[i % a.length];
const names = ["Priya Raman", "James Carter", "Aisha Khan", "Michael Chen", "Sofia Martinez", "David Okafor", "Emily Brooks", "Rahul Verma", "Grace Liu", "Daniel Park", "Olivia Reed", "Arjun Nair"];
const facilities = ["St. Mary's Medical Center", "Riverside Health", "Lakeview Rehab", "Northside Clinic", "Mercy General", "Oakwood Senior Care", "Summit Hospital", "Harbor Health"];
const cities = ["Dallas, TX", "Houston, TX", "Austin, TX", "Phoenix, AZ", "Atlanta, GA", "Charlotte, NC", "Tampa, FL", "Denver, CO"];
const stages = ["Lead", "Contacted", "Qualified", "Proposal", "Negotiation", "Won"];
const d = (i: number, base = "2026-") => `${base}${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 7) % 27) + 1).padStart(2, "0")}`;
const gen = (n: number, f: (i: number) => Record<string, any>) => Array.from({ length: n }, (_, i) => ({ id: i + 1, ...f(i) }));

export const MODULES: Record<string, ModuleConfig> = {
  directory: {
    key: "directory", title: "SriMatrix Directory", description: "Healthcare providers and facilities",
    fields: [
      { name: "facility", label: "Facility Name" }, { name: "contact", label: "Contact Person" }, { name: "email", label: "Email", type: "email" }, { name: "phone", label: "Phone" },
      { name: "facilityType", label: "Facility Type", type: "select", options: ["Hospital", "Clinic", "Rehab", "Senior Care", "Home Health"] },
      { name: "location", label: "Location" }, { name: "beds", label: "Beds", type: "number" },
      { name: "ownership", label: "Ownership", type: "select", options: ["Private", "Non-profit", "Government"] },
      { name: "region", label: "Priority Region", type: "select", options: ["South", "Southwest", "Southeast", "Mountain"] },
      { name: "stage", label: "Pipeline Stage", type: "select", options: stages },
    ],
    columns: ["facility", "contact", "location", "beds", "ownership", "region", "stage"], statusField: "stage",
    rows: gen(16, (i) => ({ facility: pick(facilities, i) + (i > 7 ? " East" : ""), contact: pick(names, i + 3), email: `contact${i}@facility.org`, phone: `(214) 555-0${100 + i}`, facilityType: pick(["Hospital", "Clinic", "Rehab", "Senior Care", "Home Health"], i), location: pick(cities, i), beds: 40 + ((i * 37) % 400), ownership: pick(["Private", "Non-profit", "Government"], i), region: pick(["South", "Southwest", "Southeast", "Mountain"], i), stage: pick(stages, i) })),
  },
  candidates: {
    key: "candidates", title: "Candidates", description: "Clinical talent and recruitment profiles",
    fields: [
      { name: "name", label: "Full Name" }, { name: "email", label: "Email", type: "email" }, { name: "phone", label: "Phone" },
      { name: "role", label: "Desired Role", type: "select", options: ["Registered Nurse", "LPN", "CNA", "Physical Therapist", "Respiratory Therapist", "Medical Technologist"] },
      { name: "skills", label: "Skills" }, { name: "education", label: "Education" }, { name: "experience", label: "Experience (yrs)", type: "number" },
      { name: "salary", label: "Expected Salary ($)", type: "number" }, { name: "availability", label: "Availability", type: "select", options: ["Immediate", "2 weeks", "1 month", "Negotiable"] },
      { name: "stage", label: "Pipeline Stage", type: "select", options: ["Sourced", "Screening", "Interview", "Offer", "Hired", "Rejected"] },
    ],
    columns: ["name", "role", "experience", "salary", "availability", "stage"], statusField: "stage",
    rows: gen(20, (i) => ({ name: pick(names, i) + (i > 11 ? " Jr." : ""), email: `cand${i}@mail.com`, phone: `(469) 555-0${120 + i}`, role: pick(["Registered Nurse", "LPN", "CNA", "Physical Therapist", "Respiratory Therapist", "Medical Technologist"], i), skills: pick(["ICU, BLS, ACLS", "ER, Triage", "Geriatrics, Wound care", "Ortho rehab", "Ventilator mgmt"], i), education: pick(["BSN", "ADN", "DPT", "MSN", "BS Medical Tech"], i), experience: 1 + (i % 14), salary: 55000 + ((i * 4300) % 50000), availability: pick(["Immediate", "2 weeks", "1 month", "Negotiable"], i), stage: pick(["Sourced", "Screening", "Interview", "Offer", "Hired", "Rejected"], i) })),
  },
  pipeline: {
    key: "pipeline", title: "Pipeline", description: "Facility pipeline and follow-ups", kanban: true,
    fields: [
      { name: "facility", label: "Facility" }, { name: "contact", label: "Contact" }, { name: "followUp", label: "Follow-up Date", type: "date" },
      { name: "priority", label: "Priority", type: "select", options: ["High", "Medium", "Low"] },
      { name: "stage", label: "Stage", type: "select", options: stages },
      { name: "status", label: "Follow-up Status", type: "select", options: ["Pending", "Completed", "Overdue"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["facility", "contact", "followUp", "priority", "stage", "status"], statusField: "stage",
    rows: gen(18, (i) => ({ facility: pick(facilities, i), contact: pick(names, i + 5), followUp: d(i), priority: pick(["High", "Medium", "Low"], i), stage: pick(stages, i), status: pick(["Pending", "Completed", "Overdue", "Pending"], i), notes: "Discuss staffing needs for Q1." })),
  },
  "job-offers": {
    key: "job-offers", title: "Job Offers", description: "Offer letters and documents", preview: true,
    fields: [
      { name: "candidate", label: "Candidate" }, { name: "position", label: "Position" }, { name: "facility", label: "Facility" },
      { name: "salary", label: "Annual Salary ($)", type: "number" }, { name: "startDate", label: "Start Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Accepted", "Declined"] },
      { name: "content", label: "Offer Letter Content", type: "textarea" },
    ],
    columns: ["candidate", "position", "facility", "salary", "startDate", "status"], statusField: "status",
    rows: gen(10, (i) => ({ candidate: pick(names, i), position: pick(["Registered Nurse", "Physical Therapist", "CNA", "LPN"], i), facility: pick(facilities, i), salary: 62000 + i * 2500, startDate: d(i), status: pick(["Draft", "Sent", "Accepted", "Declined"], i), content: `Dear ${pick(names, i)},\n\nWe are pleased to offer you the position at ${pick(facilities, i)}. Your employment will begin on the agreed start date, subject to credential verification.\n\nSincerely,\nSriMatrix Health HR` })),
  },
  mileage: {
    key: "mileage", title: "Mileage", description: "Mileage entries and reimbursements",
    fields: [
      { name: "employee", label: "Employee" }, { name: "date", label: "Date", type: "date" }, { name: "distance", label: "Distance", type: "number" },
      { name: "unit", label: "Unit", type: "select", options: ["mi", "km"] }, { name: "description", label: "Description" },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Rejected"] },
    ],
    columns: ["employee", "date", "distance", "unit", "description", "status"], statusField: "status",
    rows: gen(14, (i) => ({ employee: pick(names, i), date: d(i), distance: 8 + ((i * 13) % 90), unit: "mi", description: `Client visit – ${pick(facilities, i)}`, status: pick(["Pending", "Approved", "Rejected", "Approved"], i) })),
  },
  "hr-documents": {
    key: "hr-documents", title: "HR Documents", description: "Employee documents and policies", preview: true,
    fields: [
      { name: "title", label: "Document Title" }, { name: "category", label: "Category", type: "select", options: ["Policy", "Contract", "Credential", "Tax Form", "Training"] },
      { name: "employee", label: "Employee" }, { name: "fileName", label: "File Name" }, { name: "size", label: "Size" }, { name: "uploaded", label: "Uploaded", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Expiring", "Archived"] },
    ],
    columns: ["title", "category", "employee", "fileName", "size", "uploaded", "status"], statusField: "status",
    rows: gen(14, (i) => ({ title: pick(["Employee Handbook", "Employment Agreement", "RN License", "W-4 Form", "HIPAA Training", "BLS Certificate"], i), category: pick(["Policy", "Contract", "Credential", "Tax Form", "Training", "Credential"], i), employee: pick(names, i), fileName: `doc_${1000 + i}.pdf`, size: `${(0.2 + (i % 7) * 0.4).toFixed(1)} MB`, uploaded: d(i, "2025-"), status: pick(["Active", "Expiring", "Archived", "Active"], i) })),
  },
  immigration: {
    key: "immigration", title: "Immigration Cases", description: "Visa and USCIS case tracking",
    fields: [
      { name: "employee", label: "Employee" }, { name: "country", label: "Country of Citizenship" },
      { name: "visaType", label: "Visa Type", type: "select", options: ["H-1B", "H-1B Transfer", "TN", "EB-3", "EB-2", "OPT", "Green Card"] },
      { name: "uscisStage", label: "USCIS Stage", type: "select", options: ["PERM", "I-140", "I-485", "I-129", "RFE", "Approved"] },
      { name: "filingDate", label: "Filing Date", type: "date" }, { name: "expirationDate", label: "Expiration Date", type: "date" },
      { name: "status", label: "Case Status", type: "select", options: ["Open", "In Review", "RFE Received", "Approved", "Denied"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["employee", "visaType", "uscisStage", "filingDate", "expirationDate", "status"], statusField: "status",
    rows: gen(12, (i) => ({ employee: pick(names, i), country: pick(["India", "Philippines", "Nigeria", "Canada", "Kenya"], i), visaType: pick(["H-1B", "H-1B Transfer", "TN", "EB-3", "EB-2", "OPT", "Green Card"], i), uscisStage: pick(["PERM", "I-140", "I-485", "I-129", "RFE", "Approved"], i), filingDate: d(i, "2025-"), expirationDate: d(i + 3, "2028-"), status: pick(["Open", "In Review", "RFE Received", "Approved", "Denied"], i), notes: "Awaiting USCIS response." })),
  },
  accounts: {
    key: "accounts", title: "Accounts", description: "User accounts and roles",
    fields: [
      { name: "name", label: "Name" }, { name: "email", label: "Email", type: "email" }, { name: "role", label: "Role", type: "select", options: ["Super Admin", "Admin", "Recruiter", "HR", "Employee"] },
      { name: "phone", label: "Phone" }, { name: "position", label: "Position" }, { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }, { name: "profile", label: "Profile / Bio", type: "textarea" },
    ],
    columns: ["name", "email", "role", "phone", "position", "status"], statusField: "status",
    rows: gen(12, (i) => ({ name: pick(names, i), email: pick(names, i).toLowerCase().replace(" ", ".") + "@srimatrix.com", role: pick(["Super Admin", "Admin", "Recruiter", "HR", "Employee", "Employee"], i), phone: `(972) 555-0${140 + i}`, position: pick(["Director", "Recruiter", "HR Specialist", "Registered Nurse", "Therapist"], i), status: i % 6 === 5 ? "Inactive" : "Active", profile: "" })),
  },
  "email-credentials": {
    key: "email-credentials", title: "Email Credentials", description: "Sending accounts and signatures",
    fields: [
      { name: "email", label: "Email", type: "email" }, { name: "apiKey", label: "API Key" }, { name: "logo", label: "Logo Setting", type: "select", options: ["Show logo", "Hide logo"] }, { name: "signature", label: "Signature", type: "textarea" },
    ],
    columns: ["email", "apiKey", "logo", "signature"],
    rows: gen(4, (i) => ({ email: pick(["hr", "recruiting", "payroll", "noreply"], i) + "@srimatrix.com", apiKey: "sk_live_••••••••" + (4821 + i * 37), logo: i % 2 ? "Hide logo" : "Show logo", signature: "SriMatrix Health · Dallas, TX" })),
  },
  sessions: {
    key: "sessions", title: "Sessions", description: "Active login sessions", readOnly: true,
    fields: [{ name: "account", label: "Account" }, { name: "ip", label: "IP Address" }, { name: "userAgent", label: "User Agent" }, { name: "expires", label: "Expiration", type: "date" }, { name: "created", label: "Created", type: "date" }],
    columns: ["account", "ip", "userAgent", "expires", "created"],
    rows: gen(12, (i) => ({ account: pick(names, i), ip: `192.168.${i}.${20 + i * 3}`, userAgent: pick(["Chrome 131 / Windows", "Safari 18 / macOS", "Edge 130 / Windows", "Safari / iOS 18"], i), expires: d(i + 1, "2026-"), created: d(i, "2026-") })),
  },
  "activity-logs": {
    key: "activity-logs", title: "Activity Logs", description: "Audit trail of account actions", readOnly: true,
    fields: [{ name: "account", label: "Account" }, { name: "action", label: "Action" }, { name: "status", label: "Status", type: "select", options: ["Success", "Failed"] }, { name: "ip", label: "IP Address" }, { name: "details", label: "Details" }, { name: "created", label: "Created", type: "date" }],
    columns: ["account", "action", "status", "ip", "details", "created"], statusField: "status",
    rows: gen(20, (i) => ({ account: pick(names, i), action: pick(["LOGIN", "UPDATE_CANDIDATE", "SUBMIT_TIMESHEET", "APPROVE_TIMESHEET", "CREATE_INVOICE", "DELETE_DOCUMENT"], i), status: i % 7 === 3 ? "Failed" : "Success", ip: `10.0.${i}.${i * 5 + 2}`, details: "Action performed via web app", created: d(i, "2026-") })),
  },
};

export const NAMES = names;
export const FACILITIES = facilities;
