export type Topic = "linear" | "quadratic" | "exponents" | "fractions" | "word-problems";

export const TOPICS: { id: Topic; label: string }[] = [
  { id: "linear", label: "Linear equations" },
  { id: "quadratic", label: "Quadratic equations" },
  { id: "exponents", label: "Exponents" },
  { id: "fractions", label: "Fractions" },
  { id: "word-problems", label: "Word problems" },
];

export type Question = {
  id: string;
  topic: Topic;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "lin-1",
    topic: "linear",
    prompt: "Solve for x: 2x + 5 = 13",
    choices: ["x = 4", "x = 9", "x = 3.5", "x = 6"],
    correctIndex: 0,
  },
  {
    id: "lin-2",
    topic: "linear",
    prompt: "Solve for x: 3(x - 2) = 12",
    choices: ["x = 4", "x = 6", "x = 2", "x = 10"],
    correctIndex: 1,
  },
  {
    id: "quad-1",
    topic: "quadratic",
    prompt: "Solve for x: x^2 - 9 = 0",
    choices: ["x = 3 only", "x = -3 only", "x = 3 or x = -3", "x = 9 or x = -9"],
    correctIndex: 2,
  },
  {
    id: "quad-2",
    topic: "quadratic",
    prompt: "Solve for x: x^2 + 5x + 6 = 0",
    choices: ["x = 2 or x = 3", "x = -2 or x = -3", "x = -1 or x = -6", "x = 1 or x = 6"],
    correctIndex: 1,
  },
  {
    id: "exp-1",
    topic: "exponents",
    prompt: "Simplify: x^3 * x^4",
    choices: ["x^7", "x^12", "x^1", "2x^7"],
    correctIndex: 0,
  },
  {
    id: "exp-2",
    topic: "exponents",
    prompt: "Simplify: (x^2)^3",
    choices: ["x^5", "x^6", "x^9", "x^8"],
    correctIndex: 1,
  },
  {
    id: "frac-1",
    topic: "fractions",
    prompt: "Simplify: 2/4 + 1/4",
    choices: ["3/8", "3/4", "1/2", "2/3"],
    correctIndex: 1,
  },
  {
    id: "frac-2",
    topic: "fractions",
    prompt: "Simplify: (2/3) * (3/4)",
    choices: ["1/2", "6/12", "2/4", "5/7"],
    correctIndex: 0,
  },
  {
    id: "word-1",
    topic: "word-problems",
    prompt:
      "A ticket costs $8. You have $50. How many tickets can you buy, and how much is left over?",
    choices: ["6 tickets, $2 left", "5 tickets, $10 left", "6 tickets, $0 left", "7 tickets, -$6"],
    correctIndex: 0,
  },
  {
    id: "word-2",
    topic: "word-problems",
    prompt: "A train travels 60 miles in 1.5 hours. What is its average speed?",
    choices: ["30 mph", "40 mph", "45 mph", "90 mph"],
    correctIndex: 1,
  },
];

export function getQuestionsByTopic(topic: Topic): Question[] {
  return DIAGNOSTIC_QUESTIONS.filter((q) => q.topic === topic);
}
