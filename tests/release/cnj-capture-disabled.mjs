import { readFileSync, readdirSync } from "node:fs";

const publicScripts = [
  "app/web/assets/checklists/checklist-cnj-interativo.js",
  "app/web/blog/js/checklist-cnj-interativo.js"
].map((path) => ({ path, source: readFileSync(path, "utf8") }));
const publicHtml = readFileSync("app/web/assets/checklists/checklist-cnj-interativo.html", "utf8");
const appsScript = readFileSync("ops/checklists/checklist-cnj-capture.gs", "utf8");
const findings = [];

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

const forbiddenPublicScript = [
  ["fetch", /\bfetch\s*\(/],
  ["XMLHttpRequest", /\bXMLHttpRequest\b/],
  ["sendBeacon", /\bsendBeacon\b/],
  ["captureEndpoint", /captureEndpoint/],
  ["CHECKLIST_CONFIG", /CHECKLIST_CONFIG/],
  ["metadata.pageUrl", /metadata\.pageUrl/]
];

for (const { path, source } of publicScripts) {
  for (const [label, pattern] of forbiddenPublicScript) {
    if (pattern.test(source)) findings.push(`${path} contém ${label}`);
  }
}

for (const [label, pattern] of [
  ["captureEndpoint", /captureEndpoint/],
  ["CHECKLIST_CONFIG", /CHECKLIST_CONFIG/],
  ["Apps Script origin", /script\.google(?:usercontent)?\.com/]
]) {
  if (pattern.test(publicHtml)) findings.push("HTML CNJ contém " + label);
}

for (const path of walkFiles("app/web")) {
  if (!/\.(?:html|js|css|xml|txt|json)$/i.test(path)) continue;
  const source = readFileSync(path, "utf8");
  for (const [label, pattern] of [
    ["Apps Script URL", /script\.google(?:usercontent)?\.com/i],
    ["captureEndpoint", /captureEndpoint/i],
    ["metadata.pageUrl", /metadata\.pageUrl/i]
  ]) {
    if (pattern.test(source)) findings.push(`${path} contém ${label}`);
  }
}

if (!/disabledResponse_|disabled:\s*true/.test(appsScript)) {
  findings.push("Apps Script não está explicitamente desativado");
}
for (const [label, pattern] of [
  ["SpreadsheetApp", /\bSpreadsheetApp\b/],
  ["UrlFetchApp", /\bUrlFetchApp\b/],
  ["metadata.pageUrl", /metadata\.pageUrl/],
  ["allowedOrigins", /allowedOrigins/],
  ["CAPTURE_ENABLED=true", /CAPTURE_ENABLED\s*=\s*true/]
]) {
  if (pattern.test(appsScript)) findings.push(`Apps Script contém ${label}`);
}

if (findings.length) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log("CNJ capture guard: PASS — frontend local e Apps Script desativado");
