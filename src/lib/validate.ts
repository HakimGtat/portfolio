// Guards against explanations drifting away from the code they describe.
export interface StepRef {
  title: string;
  file: string;
  lines: [number, number];
}

export function validateSteps(
  steps: StepRef[],
  lineCounts: Map<string, number>,
  explanationCommit: string,
  projectCommit: string,
): string[] {
  const errors: string[] = [];
  if (explanationCommit !== projectCommit) {
    errors.push(
      `explanation was written for commit ${explanationCommit}, but the project is pinned to ${projectCommit}. Re-run npm run explain.`,
    );
  }
  steps.forEach((step, i) => {
    const where = `step ${i + 1} ("${step.title}")`;
    const total = lineCounts.get(step.file);
    if (total === undefined) {
      errors.push(`${where} points at ${step.file}, which is not in the project's files list.`);
      return;
    }
    const [start, end] = step.lines;
    if (start > end) errors.push(`${where} has start line ${start} after end line ${end}.`);
    if (end > total) errors.push(`${where} ends at line ${end}, but ${step.file} has ${total} lines.`);
  });
  return errors;
}
