// One-line definitions for jargon. Reference in explanations with [[term]] or [[term|shown text]].
export const glossary: Record<string, string> = {
  cache: 'A small, very fast memory next to the CPU that holds copies of data it is likely to need soon.',
  prefetch: 'Loading data into the cache before the program asks for it, so it is already there when needed.',
  'markov model': 'A prediction method that guesses what comes next based only on what just happened.',
  socket: 'An endpoint a program opens to send and receive data over a network, like a phone line for software.',
  tcp: 'A network protocol that guarantees data arrives complete and in order, at the cost of extra overhead.',
  udp: 'A lightweight network protocol that sends data fast but does not guarantee it arrives.',
  fsm: 'Finite state machine: a design that is always in one of a fixed set of states and moves between them on rules.',
  pwm: 'Pulse-width modulation: switching power on and off quickly to control things like motor speed.',
  idct: 'Inverse discrete cosine transform: the math step that turns compressed image data back into pixels.',
  microcontroller: 'A tiny computer on a single chip, built to control hardware directly.',
  'build time': 'When the site is generated into plain files, before anyone visits it, as opposed to while a visitor is on the page.',
  'commit sha': 'A unique ID for one exact snapshot of a code repository in Git.',
  island: 'A small interactive piece of a page that loads JavaScript, while the rest of the page stays plain HTML.',
  'syntax highlighting': 'Coloring code by its parts (keywords, strings, comments) so it is easier to read.',
  frontmatter: 'A block of settings at the top of a content file, written as key: value pairs.',
  schema: 'A definition of what shape data must have, so wrong or missing fields are caught early.',
  api: 'A defined way for one program to ask another program to do something.',
  llm: 'Large language model: an AI system that reads and writes text, like Claude.',
  'structured output': 'Asking an AI model to reply in an exact data format, such as JSON with fixed fields, instead of free text.',
  'line range': 'A start and end line number that points at a specific chunk of a file.',
  'react hook': 'A React function (like useState or useEffect) that lets a component remember values or react to changes.',
  dom: 'The live tree of elements a browser builds from a web page, which code can read and change.',
};

export function lookupTerm(term: string): string | undefined {
  return glossary[term.toLowerCase()];
}
