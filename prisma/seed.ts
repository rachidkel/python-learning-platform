import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Clean existing data (in dev only) ─────────────────
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();

  // ─── Course 1: Python Fundamentals ─────────────────────
  const fundamentals = await prisma.course.create({
    data: {
      slug: "python-fundamentals",
      title: "Python Fundamentals",
      description:
        "Learn the building blocks of Python — variables, data types, conditions, loops, and functions — with hands-on exercises.",
      level: "BEGINNER",
      order: 1,
      published: true,
      icon: "BookOpen",
    },
  });

  await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "hello-world",
      title: "Hello, World!",
      order: 1,
      estimatedMin: 5,
            content: `# Hello, World! 👋

Welcome to your **first Python lesson**! Python is famous for being readable and beginner-friendly. By the end of this lesson, you'll have written your first program.

## Your first program

The classic first program in any language is printing **"Hello, World!"**. In Python, this is just one line:

\`\`\`python
print("Hello, World!")
\`\`\`

The \`print()\` function displays whatever you put inside the parentheses.

## Why is this important?

\`print()\` is your best friend when debugging. Every time you want to see what's going on inside your program, you'll use \`print()\`.

> 💡 **Fun fact:** The "Hello, World!" tradition started in 1972 with the C programming language. Every language since has followed suit.

## Try it yourself

In the editor on the right, type:

\`\`\`python
print("Hello, World!")
print("My name is Python learner")
print(2 + 2)
\`\`\`

Then click **Run** to see the output.

## What you learned

| Concept | Meaning |
|---------|---------|
| \`print()\` | Shows text or values on the screen |
| Strings | Text wrapped in quotes (\`"like this"\`) |
| Numbers | Just numbers — no quotes needed |`,
    },
  });

  const helloWorld = await prisma.lesson.findFirst({
    where: { slug: "hello-world" },
  });

  if (helloWorld) {
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: helloWorld.id,
        title: "Quick check",
        description: "Test your understanding of print()",
      },
    });

    await prisma.question.create({
      data: {
        quizId: quiz.id,
        prompt: 'What does `print("Hello")` do?',
        type: "MULTIPLE_CHOICE",
        explanation: '`print()` displays text (and other values) to the console.',
        order: 1,
        choices: {
          create: [
            { text: "Prints the word Hello to the console", isCorrect: true, order: 1 },
            { text: "Creates a variable named Hello", isCorrect: false, order: 2 },
            { text: "Deletes the word Hello", isCorrect: false, order: 3 },
            { text: "Nothing", isCorrect: false, order: 4 },
          ],
        },
      },
    });
  }

  await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "variables",
      title: "Variables & Data Types",
      order: 2,
      estimatedMin: 8,
      content: `# Variables & Data Types

Variables are containers for storing data. In Python, you don't need to declare a type — it's inferred.

## Creating variables

\`\`\`python
name = "Alice"
age = 25
height = 1.68
is_student = True
\`\`\`

## Common data types

| Type | Example | Description |
|------|---------|-------------|
| \`str\` | \`"hello"\` | Text |
| \`int\` | \`42\` | Whole numbers |
| \`float\` | \`3.14\` | Decimal numbers |
| \`bool\` | \`True\`, \`False\` | True/false values |

## Try it

\`\`\`python
name = "Python"
version = 3.13
print(f"Welcome to {name} {version}!")
\`\`\``,
    },
  });

  // ─── Course 2: Data Structures & OOP ───────────────────
  const intermediate = await prisma.course.create({
    data: {
      slug: "data-structures-oop",
      title: "Data Structures & OOP",
      description:
        "Master lists, dictionaries, and object-oriented programming. Build reusable, well-organized code.",
      level: "INTERMEDIATE",
      order: 2,
      published: true,
      icon: "Layers",
    },
  });

  await prisma.lesson.create({
    data: {
      courseId: intermediate.id,
      slug: "lists",
      title: "Lists",
      order: 1,
      estimatedMin: 10,
      content: `# Lists

Lists are ordered, mutable collections — perfect for storing sequences of items.

## Creating a list

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "two", 3.0, True]
\`\`\`

## Accessing items

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])     # apple
print(fruits[-1])    # cherry
print(fruits[1:3])   # ['banana', 'cherry']
\`\`\`

## Common methods

\`\`\`python
fruits.append("date")        # add to end
fruits.remove("banana")      # remove item
fruits.sort()                # sort alphabetically
print(len(fruits))           # count items
\`\`\``,
    },
  });

  // ─── Course 3: Real-World Python ────────────────────────
  const advanced = await prisma.course.create({
    data: {
      slug: "real-world-python",
      title: "Real-World Python",
      description:
        "Files, error handling, and building complete applications — the skills you need to ship real projects.",
      level: "ADVANCED",
      order: 3,
      published: true,
      icon: "Rocket",
    },
  });

  await prisma.lesson.create({
    data: {
      courseId: advanced.id,
      slug: "error-handling",
      title: "Error Handling",
      order: 1,
      estimatedMin: 12,
      content: `# Error Handling

Real programs break. Python's \`try/except\` lets you handle errors gracefully.

## Basic try/except

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("You can't divide by zero!")
\`\`\`

## Multiple excepts

\`\`\`python
try:
    value = int("abc")
except ValueError:
    print("That wasn't a number")
except Exception as e:
    print(f"Something else broke: {e}")
\`\`\`

## Try it

Write a program that asks for a number and safely prints its square root:

\`\`\`python
try:
    n = -4
    if n < 0:
        raise ValueError("Cannot take square root of a negative number")
    print(n ** 0.5)
except ValueError as e:
    print(f"Error: {e}")
\`\`\``,
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   ${await prisma.course.count()} courses`);
  console.log(`   ${await prisma.lesson.count()} lessons`);
  console.log(`   ${await prisma.quiz.count()} quizzes`);
  console.log(`   ${await prisma.question.count()} questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });