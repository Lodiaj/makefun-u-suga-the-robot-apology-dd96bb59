// The Robot Apology: a two-line robot confession.
// Line one owns one specific mistake — the robot shredded a passport
// because it was sitting in the pile marked old bills. Line two draws
// the lesson from that exact mistake: a document's place in a pile says
// nothing about what it is worth, so the robot now reads the cover
// before it shreds anything. The program writes the two lines to
// /output/entry.txt, where the sealed scorer checks the file is 1 to
// 400 characters of real UTF-8 text.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const APOLOGY =
  "I'm sorry I shredded your passport because it was sitting in the pile marked old bills.\n" +
  "I learned a document's place in a pile says nothing about what it is worth, so now I read the cover before I shred anything.";

const DESTINATION = "/output/entry.txt";
const LIMIT = 400;

// The gate counts code points (not UTF-16 units) and requires 1-400
// characters of real text. Count with the spread operator so the
// apostrophes count as one character each, exactly as the gate counts
// them. Both lines must be exactly one sentence each, and the lesson
// in line two must name a changed behaviour, not a generic promise.
function validateApology(text: string, limit: number): string {
  const length = [...text].length;
  if (text.trim() === "") {
    throw new Error("apology is blank");
  }
  if (length > limit) {
    throw new Error(`apology is ${length} characters; the gate allows 1-${limit}`);
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    throw new Error(`apology must be exactly two lines, got ${lines.length}`);
  }
  for (const line of lines) {
    if (line.trim() === "") {
      throw new Error("apology has an empty line");
    }
    const sentences = line.split(".").filter((part) => part.trim() !== "");
    if (sentences.length !== 1) {
      throw new Error(`each line must be exactly one sentence: ${line}`);
    }
  }
  return text;
}

const apology = validateApology(APOLOGY, LIMIT);
const length = [...apology].length;

mkdirSync("/output", { recursive: true });
writeFileSync(DESTINATION, apology, "utf8");

// Read the file back and confirm it is byte-identical to the validated
// text, so a partial write can never pass silently.
const written = readFileSync(DESTINATION, "utf8");
if (written !== apology) {
  throw new Error("entry.txt on disk differs from the validated apology");
}
console.log(`apology (${length} chars) written to ${DESTINATION}`);
console.log(apology);
