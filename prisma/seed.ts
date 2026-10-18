import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Clean existing data ──────────────────────────────
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();

  // ═══════════════════════════════════════════════════════
  // COURSE 1: PYTHON FUNDAMENTALS
  // ═══════════════════════════════════════════════════════
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

  // --- Lesson 1: Hello World ---
  const l1 = await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "hello-world",
      title: "Hello, World!",
      order: 1,
      estimatedMin: 5,
      content: `# Hello, World! 👋

Welcome to your **first Python lesson**! Python is famous for being readable and beginner-friendly.

## Your first program

The classic first program in any language is printing **"Hello, World!"**. In Python, this is just one line:

\`\`\`python
print("Hello, World!")
\`\`\`

The \`print()\` function displays whatever you put inside the parentheses.

## Why is this important?

\`print()\` is your best friend when debugging. Every time you want to see what's going on inside your program, you'll use \`print()\`.

> 💡 **Fun fact:** The "Hello, World!" tradition started in 1972 with the C programming language.

## Try it yourself

In the editor on the right, type:

\`\`\`python
print("Hello, World!")
print("My name is Python learner")
print(2 + 2)
\`\`\``,
    },
  });

  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: l1.id,
      title: "Quick check",
      description: "Test your understanding of print()",
    },
  });
  
  await prisma.question.create({
    data: {
      quizId: quiz1.id,
      prompt: 'What does `print("Hello")` do?',
      type: "MULTIPLE_CHOICE",
      explanation: '`print()` displays text to the console.',
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

  // --- Lesson 2: Variables & Data Types ---
  await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "variables-data-types",
      title: "Variables & Data Types",
      order: 2,
      estimatedMin: 10,
      content: `# Variables & Data Types

Variables are containers for storing data. Python is dynamically typed — you don't declare the type.

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
| \`str\` | \`"hello"\` | Text (String) |
| \`int\` | \`42\` | Whole numbers |
| \`float\` | \`3.14\` | Decimal numbers |
| \`bool\` | \`True\`, \`False\` | True/False values |
| \`list\` | \`[1, 2, 3]\` | Ordered collection |
| \`dict\` | \`{"a": 1}\` | Key-value pairs |

## Type Conversion (Casting)

\`\`\`python
x = "10"       # String
y = int(x)     # Now an integer (10)
z = float(y)   # Now a float (10.0)
\`\`\``,
    },
  });

  // --- Lesson 3: Conditions ---
  const l3 = await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "conditions",
      title: "Conditions (if / elif / else)",
      order: 3,
      estimatedMin: 12,
      content: `# Conditions (if / elif / else)

Programs need to make decisions. Python uses \`if\`, \`elif\`, and \`else\`.

## Basic syntax

\`\`\`python
age = 18

if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")
\`\`\`

## Comparison operators

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal |
| \`<=\` | Less than or equal |

## Logical operators

\`\`\`python
x = 10
if x > 0 and x < 100:
    print("Between 0 and 100")

if x == 5 or x == 10:
    print("Either 5 or 10")

if not x == 20:
    print("Not 20")
\`\`\``,
    },
  });

  const quiz3 = await prisma.quiz.create({
    data: {
      lessonId: l3.id,
      title: "Condition Logic",
      description: "Test your if/else knowledge",
    },
  });

  await prisma.question.create({
    data: {
      quizId: quiz3.id,
      prompt: "What will this print?",
      codeSnippet: `x = 5\nif x > 10:\n    print("A")\nelif x > 3:\n    print("B")\nelse:\n    print("C")`,
      type: "PREDICT_OUTPUT",
      explanation: "x is 5. The first condition (x > 10) is False. The second (x > 3) is True, so it prints 'B'.",
      order: 1,
      choices: {
        create: [
          { text: "A", isCorrect: false, order: 1 },
          { text: "B", isCorrect: true, order: 2 },
          { text: "C", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // --- Lesson 4: Loops ---
  await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "loops",
      title: "Loops (for & while)",
      order: 4,
      estimatedMin: 15,
      content: `# Loops (for & while)

Loops let you repeat code without rewriting it.

## \`for\` loops

Use \`for\` when you know how many times to repeat (e.g., over a list).

\`\`\`python
# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop with a range
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4
\`\`\`

## \`while\` loops

Use \`while\` when repeating until a condition is met.

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## \`break\` and \`continue\`

\`\`\`python
for i in range(10):
    if i == 5:
        break       # Stops the loop entirely
    print(i)

for i in range(5):
    if i == 2:
        continue    # Skips this iteration
    print(i)
\`\`\`

> ⚠️ **Warning:** Make sure your \`while\` loop eventually becomes False, or it will run forever!`,
    },
  });

  // --- Lesson 5: Functions ---
  const l5 = await prisma.lesson.create({
    data: {
      courseId: fundamentals.id,
      slug: "functions",
      title: "Functions",
      order: 5,
      estimatedMin: 12,
      content: `# Functions

Functions are reusable blocks of code. They take inputs (parameters) and can return an output.

## Defining a function

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

## Multiple parameters

\`\`\`python
def add(a, b):
    return a + b

print(add(3, 4))  # 7
\`\`\`

## Default parameters

\`\`\`python
def greet(name="World"):
    return f"Hello, {name}!"

print(greet())         # Hello, World!
print(greet("Alice"))  # Hello, Alice!
\`\`\`

## Return values

If a function has no \`return\` statement, it returns \`None\`.

\`\`\`python
def say_hi():
    print("Hi!")

result = say_hi()  # Prints "Hi!", result is None
\`\`\``,
    },
  });

  const quiz5 = await prisma.quiz.create({
    data: {
      lessonId: l5.id,
      title: "Function Basics",
    },
  });
  
  await prisma.question.create({
    data: {
      quizId: quiz5.id,
      prompt: "What is the output of this code?",
      codeSnippet: `def multiply(x, y=2):\n    return x * y\n\nprint(multiply(5))`,
      type: "PREDICT_OUTPUT",
      explanation: "The function multiplies x by y. Since y defaults to 2, multiply(5) returns 5 * 2 = 10.",
      order: 1,
      choices: {
        create: [
          { text: "5", isCorrect: false, order: 1 },
          { text: "10", isCorrect: true, order: 2 },
          { text: "None", isCorrect: false, order: 3 },
          { text: "Error", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // ═══════════════════════════════════════════════════════
  // COURSE 2: DATA STRUCTURES & ALGORITHMS
  // ═══════════════════════════════════════════════════════
  const ds = await prisma.course.create({
    data: {
      slug: "data-structures-algorithms",
      title: "Data Structures & Algorithms",
      description:
        "Master lists, stacks, queues, trees, graphs, and sorting algorithms. The essential tools for solving real problems.",
      level: "INTERMEDIATE",
      order: 2,
      published: true,
      icon: "Layers",
    },
  });

  // --- Lesson 1: Lists ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "lists",
      title: "Lists (Insert, Delete, Sort)",
      order: 1,
      estimatedMin: 15,
      content: `# Lists (Insert, Delete, Sort)

Lists are ordered, mutable collections — the most used data structure in Python.

## Creating a list

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
\`\`\`

## Adding items (Insert)

\`\`\`python
fruits = ["apple", "banana"]

# Add to the end
fruits.append("cherry")          # ["apple", "banana", "cherry"]

# Insert at a specific index
fruits.insert(1, "orange")       # ["apple", "orange", "banana", "cherry"]

# Combine two lists
fruits.extend(["date", "fig"])   # [... "date", "fig"]
\`\`\`

## Deleting items

\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]

# Remove by value
fruits.remove("banana")    # ["apple", "cherry", "date"]

# Remove by index (and get the removed item)
last = fruits.pop()        # last = "date", fruits = ["apple", "cherry"]

# Remove by index (del)
del fruits[0]              # ["cherry"]

# Clear the whole list
fruits.clear()             # []
\`\`\`

## Sorting

\`\`\`python
nums = [3, 1, 4, 1, 5, 9, 2]

# Sort in place (modifies the list)
nums.sort()                # [1, 1, 2, 3, 4, 5, 9]

# Sort in reverse
nums.sort(reverse=True)    # [9, 5, 4, 3, 2, 1, 1]

# Get a sorted copy (does not modify the original)
sorted_nums = sorted(nums)

# Sort with a custom key (e.g., by string length)
words = ["apple", "pie", "banana"]
words.sort(key=len)        # ["pie", "apple", "banana"]
\`\`\`

## Slicing

\`\`\`python
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nums[2:5]      # [2, 3, 4]
nums[:3]       # [0, 1, 2]
nums[7:]       # [7, 8, 9]
nums[::2]      # [0, 2, 4, 6, 8]
nums[::-1]     # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] (reversed)
\`\`\``,
    },
  });

  // --- Lesson 2: Dictionaries ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "dictionaries",
      title: "Dictionaries",
      order: 2,
      estimatedMin: 12,
      content: `# Dictionaries

Dictionaries store key-value pairs. They're perfect for looking up data by a unique key.

## Creating a dictionary

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "Paris"
}
\`\`\`

## Accessing and modifying

\`\`\`python
# Access by key
print(person["name"])       # Alice

# Safe access with .get() — returns None if key is missing
print(person.get("email"))  # None

# Add or update
person["email"] = "alice@example.com"

# Delete
del person["age"]
\`\`\`

## Looping through a dict

\`\`\`python
for key in person:
    print(key, "=", person[key])

for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## When to use a dict vs a list?

| Use case | Structure |
|----------|-----------|
| Ordered sequence of items | \`list\` |
| Lookup by unique key (like a phone book) | \`dict\` |
| Count occurrences | \`dict\` |
\`\`\``,
    },
  });

  // --- Lesson 3: Stacks ---
  const l3ds = await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "stacks",
      title: "Stacks (LIFO)",
      order: 3,
      estimatedMin: 10,
      content: `# Stacks (LIFO)

A **Stack** is a data structure that follows **LIFO**: Last In, First Out.

Think of a stack of plates: you add to the top and remove from the top.

## Implementing a stack with a list

\`\`\`python
stack = []

# Push (add to top)
stack.append(1)
stack.append(2)
stack.append(3)
# stack = [1, 2, 3]

# Pop (remove from top)
top = stack.pop()   # top = 3, stack = [1, 2]

# Peek (see top without removing)
if stack:
    print(stack[-1])  # 2

# Check if empty
if not stack:
    print("Stack is empty")
\`\`\`

## Real-world uses of stacks

1. **Undo/Redo** in text editors
2. **Browser back button** (history)
3. **Matching parentheses** in code
4. **Recursive function calls** (the call stack)

> 💡 **Key insight:** Every function call in Python is pushed onto a call stack. That's why "stack overflow" (infinite recursion) crashes programs.`,
    },
  });

  const quiz3ds = await prisma.quiz.create({
    data: {
      lessonId: l3ds.id,
      title: "Stack Operations",
    },
  });
  
  await prisma.question.create({
    data: {
      quizId: quiz3ds.id,
      prompt: "After these operations, what is on top of the stack?",
      codeSnippet: `s = []\ns.append("A")\ns.append("B")\ns.append("C")\ns.pop()\ns.append("D")`,
      type: "PREDICT_OUTPUT",
      explanation: "A, B, C are pushed. Then pop() removes C. Then D is pushed. Top is now D.",
      order: 1,
      choices: {
        create: [
          { text: "A", isCorrect: false, order: 1 },
          { text: "B", isCorrect: false, order: 2 },
          { text: "C", isCorrect: false, order: 3 },
          { text: "D", isCorrect: true, order: 4 },
        ],
      },
    },
  });

  // --- Lesson 4: Queues ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "queues",
      title: "Queues (FIFO)",
      order: 4,
      estimatedMin: 10,
      content: `# Queues (FIFO)

A **Queue** follows **FIFO**: First In, First Out. Like a line at a coffee shop.

## Using \`collections.deque\`

\`\`\`python
from collections import deque

queue = deque()

# Enqueue (add to back)
queue.append("Alice")
queue.append("Bob")
queue.append("Charlie")

# Dequeue (remove from front)
first = queue.popleft()   # "Alice"
\`\`\`

> ⚠️ **Don't use a normal list for queues!** \`list.pop(0)\` is O(n) because it shifts all items. \`deque.popleft()\` is O(1).

## Real-world uses of queues

- **Task schedulers** (print jobs)
- **Breadth-first search (BFS)** in graphs
- **Message queues** (RabbitMQ, Kafka)
- **Request handling** in web servers`,
    },
  });

  // --- Lesson 5: Linked Lists ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "linked-lists",
      title: "Linked Lists",
      order: 5,
      estimatedMin: 15,
      content: `# Linked Lists

A **Linked List** is a chain of **nodes**, where each node has:
- A **value**
- A **pointer (next)** to the next node

Unlike a Python list, items are not stored in contiguous memory.

## Building a linked list

\`\`\`python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

# Build the list: 1 -> 2 -> 3 -> None
n1 = Node(1)
n2 = Node(2)
n3 = Node(3)
n1.next = n2
n2.next = n3
\`\`\`

## Traversing a linked list

\`\`\`python
current = n1
while current:
    print(current.value)
    current = current.next
# Prints 1, 2, 3
\`\`\`

## Linked list vs Python list

| Operation | Python List | Linked List |
|-----------|-------------|-------------|
| Access by index | **O(1)** | O(n) |
| Insert at front | O(n) | **O(1)** |
| Insert at end | O(1)* | O(n) |
| Memory | Contiguous | Scattered |

> *Python lists amortize the cost of growing — usually fast in practice.

## Reverse a linked list (classic interview question!)

\`\`\`python
def reverse(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev
\`\`\``,
    },
  });

  // --- Lesson 6: Trees ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "trees-bst",
      title: "Trees (Binary Search Tree)",
      order: 6,
      estimatedMin: 20,
      content: `# Trees (Binary Search Tree)

A **Binary Search Tree (BST)** is a tree where for every node:
- **Left subtree** values are **smaller**
- **Right subtree** values are **larger**

## Building a BST

\`\`\`python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return TreeNode(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

# Build a tree
root = None
for v in [8, 3, 10, 1, 6, 14, 4, 7]:
    root = insert(root, v)
\`\`\`

## Searching (O(log n) average)

\`\`\`python
def search(root, target):
    if root is None:
        return False
    if root.value == target:
        return True
    if target < root.value:
        return search(root.left, target)
    return search(root.right, target)

print(search(root, 6))   # True
print(search(root, 99))  # False
\`\`\`

## Traversals

### In-order (sorted output)
\`\`\`python
def inorder(node):
    if not node:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)
\`\`\`

The result is sorted: \`1 3 4 6 7 8 10 14\`

### Pre-order (root → left → right)
### Post-order (left → right → root)

## Why BSTs matter

- **Fast lookups** in databases
- **Sorted iteration**
- **Used in** file systems, priority queues, and many algorithms`,
    },
  });

  // --- Lesson 7: Graphs ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "graphs",
      title: "Graphs",
      order: 7,
      estimatedMin: 20,
      content: `# Graphs

A **Graph** is a set of **nodes (vertices)** connected by **edges**. Graphs model relationships: friendships, roads, web links, etc.

## Types of graphs

- **Directed**: edges have direction (A → B)
- **Undirected**: edges are bidirectional (A — B)
- **Weighted**: edges have a cost

## Building a graph (Adjacency List)

\`\`\`python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"]
}
\`\`\`

## BFS — Breadth-First Search

Visit nodes level by level (uses a **queue**).

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        node = queue.popleft()
        print(node, end=" ")
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

bfs(graph, "A")  # A B C D
\`\`\`

## DFS — Depth-First Search

Visit nodes by going deep first (uses a **stack** or recursion).

\`\`\`python
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    print(node, end=" ")
    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)

dfs(graph, "A")  # A B D C
\`\`\`

## Real-world uses

- **Social networks** (friend suggestions)
- **Maps** (shortest path)
- **Recommendation engines** (users who liked X also liked...)
- **Web crawlers**`,
    },
  });

  // --- Lesson 8: Sorting ---
  await prisma.lesson.create({
    data: {
      courseId: ds.id,
      slug: "sorting",
      title: "Sorting Algorithms",
      order: 8,
      estimatedMin: 18,
      content: `# Sorting Algorithms

Sorting is a classic problem. Python has \`.sort()\` built-in (Timsort, O(n log n)), but understanding how sorting works is essential.

## Bubble Sort (O(n²))

Simple but slow. Compares adjacent items and swaps them.

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([5, 2, 9, 1, 5, 6]))  # [1, 2, 5, 5, 6, 9]
\`\`\`

## Merge Sort (O(n log n))

Divide and conquer: split, sort each half, merge.

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

## Comparison table

| Algorithm | Time (avg) | Space | Stable? |
|-----------|-----------|-------|---------|
| Bubble | O(n²) | O(1) | ✅ |
| Insertion | O(n²) | O(1) | ✅ |
| Merge | O(n log n) | O(n) | ✅ |
| Quick | O(n log n) | O(log n) | ❌ |
| Python sort | O(n log n) | O(n) | ✅ |

## When to use what?

- **Small data** (< 100 items): any algorithm works
- **Large data**: use Python's built-in \`.sort()\` or \`.sorted()\`
- **Learning**: implement them all to understand the trade-offs`,
    },
  });

  // ═══════════════════════════════════════════════════════
  // COURSE 3: ADVANCED PYTHON & OOP
  // ═══════════════════════════════════════════════════════
  const advanced = await prisma.course.create({
    data: {
      slug: "advanced-python",
      title: "Advanced Python & OOP",
      description:
        "Classes, inheritance, decorators, generators, file I/O, and error handling. Build complete, professional applications.",
      level: "ADVANCED",
      order: 3,
      published: true,
      icon: "Rocket",
    },
  });

  // --- Lesson 1: Classes & Objects ---
  await prisma.lesson.create({
    data: {
      courseId: advanced.id,
      slug: "classes-objects",
      title: "Classes & Objects",
      order: 1,
      estimatedMin: 15,
      content: `# Classes & Objects

**Object-Oriented Programming (OOP)** lets you group data and behavior together.

## Defining a class

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

# Create an object (instance)
my_dog = Dog("Rex", 3)
print(my_dog.bark())      # Rex says Woof!
print(my_dog.name)        # Rex
print(my_dog.age)         # 3
\`\`\`

## \`__init__\` — the constructor

Called automatically when you create an object. Use it to set up the initial state.

## \`self\` — a reference to the current object

Every method must take \`self\` as its first parameter. It's how the method knows which object it belongs to.

## Methods vs functions

| Function | Method |
|----------|--------|
| Standalone | Belongs to a class |
| \`def foo(): ...\` | \`def foo(self): ...\` |`,
    },
  });

  // --- Lesson 2: Inheritance ---
  await prisma.lesson.create({
    data: {
      courseId: advanced.id,
      slug: "inheritance",
      title: "Inheritance",
      order: 2,
      estimatedMin: 12,
      content: `# Inheritance

A class can inherit attributes and methods from a parent class. This lets you avoid duplicating code.

## Basic inheritance

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement")

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Meow!"

# Polymorphism: same interface, different behavior
for animal in [Dog("Rex"), Cat("Whiskers")]:
    print(animal.speak())
\`\`\`

## Using \`super()\`

Call the parent's \`__init__\` to add extra initialization.

\`\`\`python
class Puppy(Dog):
    def __init__(self, name, age):
        super().__init__(name)     # Call Dog's init
        self.age = age

    def speak(self):
        return super().speak() + " 🐶"
\`\`\``,
    },
  });

  // --- Lesson 3: Error Handling ---
  await prisma.lesson.create({
    data: {
      courseId: advanced.id,
      slug: "error-handling",
      title: "Error Handling",
      order: 3,
      estimatedMin: 12,
      content: `# Error Handling

Real programs break. Python's \`try / except\` lets you handle errors gracefully.

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

## \`finally\` — always runs

\`\`\`python
try:
    file = open("data.txt")
    print(file.read())
except FileNotFoundError:
    print("File not found")
finally:
    file.close()   # Always runs, even if there was an error
\`\`\`

## Raising your own errors

\`\`\`python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
\`\`\``,
    },
  });

  // --- Lesson 4: File I/O ---
  await prisma.lesson.create({
    data: {
      courseId: advanced.id,
      slug: "file-io",
      title: "File I/O",
      order: 4,
      estimatedMin: 10,
      content: `# File I/O

Read and write files using Python's \`open()\` function.

## Reading a file

\`\`\`python
# With 'with', the file closes automatically
with open("data.txt", "r") as f:
    content = f.read()
    print(content)
\`\`\`

## Writing a file

\`\`\`python
with open("output.txt", "w") as f:
    f.write("Hello, file!\\n")
    f.write("Second line")
\`\`\`

## File modes

| Mode | Meaning |
|------|---------|
| \`r\` | Read (default) |
| \`w\` | Write (overwrites) |
| \`a\` | Append |
| \`rb\` | Read binary (images, PDFs) |
| \`wb\` | Write binary |

> ⚠️ **Always use \`with\`** — it guarantees the file is closed even if an error occurs.`,
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