import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Clean existing data ──────────────────────────────
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.project.deleteMany();

  console.log("Cleared database. Seeding new content...");

  // ═══════════════════════════════════════════════════════
  // 1. COURSES & LESSONS (40 Detailed Lessons)
  // ═══════════════════════════════════════════════════════

  const coursesData = [
    {
      slug: "python-fundamentals",
      title: "Python Fundamentals",
      description: "The building blocks of Python: variables, logic, loops, and functions.",
      level: "BEGINNER",
      order: 1,
      lessons: [
        {
          slug: "hello-world",
          title: "Hello, World!",
          content: `# Hello, World! 👋\n\nWelcome to Python! Python is famous for being one of the most readable and beginner-friendly languages in the world.\n\n## Your First Program\n\nIn Python, printing text to the screen is incredibly simple. You just use the \`print()\` function:\n\n\`\`\`python\nprint("Hello, World!")\n\`\`\`\n\n## The \`print()\` Function\n\nThe \`print()\` function is your best friend. It takes whatever you put inside the parentheses and displays it in the console.\n\n\`\`\`python\nprint("My name is Python")\nprint(2026)\nprint(3.14)\n\`\`\`\n\n> 💡 **Pro Tip:** You can print multiple things at once by separating them with commas: \`print("Hello", "World")\`\n\n## Why "Hello, World!"?\n\nIt's a tradition! It started in 1972 with the C language and has become the universal first step in learning any new programming language.`
        },
        {
          slug: "variables",
          title: "Variables & Types",
          content: `# Variables & Data Types\n\nVariables are like labeled boxes where you store data. In Python, you don't need to declare the type of data; Python figures it out automatically.\n\n## Creating Variables\n\n\`\`\`python\nname = "Alice"     # String\nage = 25           # Integer\nheight = 1.68      # Float\nis_student = True  # Boolean\n\`\`\`\n\n## The Core Data Types\n\n| Type | Keyword | Example |\n|------|---------|---------|\n| Text | \`str\` | \`"hello"\` |\n| Whole Number | \`int\` | \`42\` |\n| Decimal | \`float\` | \`3.14\` |\n| True/False | \`bool\` | \`True\` |\n\n## Dynamic Typing\n\nYou can even change the type of a variable!\n\`\`\`python\nx = 10       # x is an int\nx = "ten"    # now x is a string\n\`\`\`\n\n> 💡 **Rule:** Variable names must start with a letter or underscore (\`_\`) and cannot contain spaces.`
        },
        {
          slug: "strings",
          title: "Strings",
          content: `# Strings (Text)\n\nStrings are sequences of characters wrapped in quotes.\n\n## Creating Strings\n\n\`\`\`python\nsingle = 'Hello'\ndouble = "World"\nmultiline = """This is a\nmulti-line string"""\n\`\`\`\n\n## String Methods\n\nPython has built-in methods to manipulate strings:\n\n\`\`\`python\ntext = "python"\n\nprint(text.upper())      # PYTHON\nprint(text.capitalize()) # Python\nprint(text.replace("p", "J")) # Jython\n\`\`\`\n\n## f-Strings (Formatting)\n\nIntroduced in Python 3.6, f-strings are the easiest way to put variables inside text:\n\n\`\`\`python\nname = "Alice"\nage = 25\nprint(f"{name} is {age} years old.")\n# Output: Alice is 25 years old.\n\`\`\``
        },
        {
          slug: "math-operators",
          title: "Math Operators",
          content: `# Math Operators\n\nPython can be used as a powerful calculator.\n\n## Basic Operators\n\n| Operator | Name | Example | Result |\n|----------|------|---------|--------|\n| \`+\` | Addition | \`5 + 3\` | 8 |\n| \`-\` | Subtraction | \`5 - 3\` | 2 |\n| \`*\` | Multiplication | \`5 * 3\` | 15 |\n| \`/\` | Division | \`5 / 2\` | 2.5 |\n| \`//\` | Floor Division | \`5 // 2\` | 2 |\n| \`%\` | Modulus (Remainder) | \`5 % 2\` | 1 |\n| \`**\` | Exponent | \`5 ** 2\` | 25 |\n\n## Order of Operations (PEMDAS)\n\nPython follows standard math rules:\n\`\`\`python\nresult = 2 + 3 * 4\nprint(result) # 14 (not 20)\n\`\`\`\n\n> 💡 Use parentheses to control the order: \`(2 + 3) * 4\` equals 20.`
        },
        {
          slug: "user-input",
          title: "User Input",
          content: `# User Input\n\nYou can make interactive programs by asking the user for input.\n\n## The \`input()\` Function\n\n\`\`\`python\nname = input("What is your name? ")\nprint(f"Hello, {name}!")\n\`\`\`\n\n> ⚠️ **Important:** \`input()\` always returns a **string**. If you need a number, you must convert it!\n\n## Converting Input\n\n\`\`\`python\nage_str = input("How old are you? ")\nage = int(age_str) # Convert string to integer\n\nprint(f"Next year you will be {age + 1}.")\n\`\`\``
        },
        {
          slug: "conditions",
          title: "If / Else",
          content: `# If / Else Statements\n\nPrograms use conditions to make decisions.\n\n## Basic Syntax\n\n\`\`\`python\nage = 18\n\nif age >= 18:\n    print("You are an adult.")\nelse:\n    print("You are a minor.")\n\`\`\`\n\n> ⚠️ **Indentation matters!** Python uses 4 spaces to define blocks of code.\n\n## \`elif\` (Else If)\n\n\`\`\`python\nscore = 85\n\nif score >= 90:\n    print("Grade A")\nelif score >= 80:\n    print("Grade B")\nelse:\n    print("Grade C")\n\`\`\`\n\n## Logical Operators\n\n- \`and\`: Both must be True\n- \`or\`: At least one must be True\n- \`not\`: Reverses the boolean\n\n\`\`\`python\nif age > 12 and age < 20:\n    print("Teenager")\n\`\`\``
        },
        {
          slug: "loops",
          title: "Loops (For & While)",
          content: `# Loops\n\nLoops let you repeat code without copying it.\n\n## \`for\` Loops\n\nUsed when you know how many times to repeat, or when iterating through a list.\n\n\`\`\`python\n# Print numbers 0 to 4\nfor i in range(5):\n    print(i)\n\`\`\`\n\n## \`while\` Loops\n\nRepeats as long as a condition is True.\n\n\`\`\`python\ncount = 0\nwhile count < 3:\n    print("Counting:", count)\n    count += 1\n\`\`\`\n\n## \`break\` and \`continue\`\n\n\`\`\`python\nfor i in range(10):\n    if i == 3:\n        break  # Stops the loop entirely\n    if i == 1:\n        continue # Skips this iteration\n    print(i)\n\`\`\``
        },
        {
          slug: "lists",
          title: "Lists",
          content: `# Lists\n\nLists store multiple items in a single variable.\n\n## Creating a List\n\n\`\`\`python\nfruits = ["apple", "banana", "cherry"]\nnumbers = [1, 2, 3, 4, 5]\n\`\`\`\n\n## Accessing Items\n\n\`\`\`python\nprint(fruits[0])  # apple\nprint(fruits[-1]) # cherry (last item)\n\`\`\`\n\n## Modifying Lists\n\n\`\`\`python\nfruits.append("orange")  # Add to end\nfruits.remove("banana")  # Remove by value\nfruits[0] = "kiwi"       # Change by index\n\`\`\``
        }
      ]
    },
    {
      slug: "data-structures",
      title: "Data Structures",
      description: "Master the core data structures: Lists, Dictionaries, Tuples, and Sets.",
      level: "INTERMEDIATE",
      order: 2,
      lessons: [
        {
          slug: "lists-advanced",
          title: "Advanced Lists",
          content: `# Advanced Lists\n\n## Slicing\n\nExtract a portion of a list using \`[start:end]\`. The end index is excluded!\n\n\`\`\`python\nnums = [0, 1, 2, 3, 4, 5]\nprint(nums[1:4])  # [1, 2, 3]\nprint(nums[:3])   # [0, 1, 2]\nprint(nums[3:])   # [3, 4, 5]\n\`\`\`\n\n## Useful Methods\n\n- \`extend()\` adds all items of another list.\n- \`insert(index, item)\` adds at a specific spot.\n- \`pop(index)\` removes and returns the item.\n- \`sort()\` sorts the list in place.\n\n\`\`\`python\nnums = [3, 1, 2]\nnums.sort()\nprint(nums) # [1, 2, 3]\n\`\`\``
        },
        {
          slug: "dictionaries",
          title: "Dictionaries",
          content: `# Dictionaries\n\nDictionaries store **key-value** pairs. They are incredibly fast for looking up data.\n\n## Creating a Dictionary\n\n\`\`\`python\nperson = {\n    "name": "Alice",\n    "age": 25,\n    "city": "Paris"\n}\n\`\`\`\n\n## Accessing Values\n\n\`\`\`python\nprint(person["name"])       # Alice\nprint(person.get("job", "Unknown")) # Unknown (doesn't crash)\n\`\`\`\n\n## Modifying & Deleting\n\n\`\`\`python\nperson["age"] = 26       # Update\nperson["job"] = "Engineer" # Add new key\ndel person["city"]       # Delete a key\n\`\`\`\n\n> 💡 **Real World Use:** JSON data from APIs is converted into Python dictionaries!`
        },
        {
          slug: "tuples",
          title: "Tuples",
          content: `# Tuples\n\nTuples are just like lists, but **immutable**. Once created, you cannot add, remove, or change items. This makes them faster and safer for fixed data.\n\n## Creating a Tuple\n\n\`\`\`python\ncoordinates = (10, 20)\ncolors = ("red", "green", "blue")\n\n# A tuple with one item needs a comma!\nsingle = (5,)\n\`\`\`\n\n## Accessing Values\n\n\`\`\`python\nprint(coordinates[0]) # 10\n\`\`\`\n\n## Why Use Tuples?\n\n- They protect your data from being accidentally changed.\n- They can be used as keys in a dictionary (lists cannot).`
        },
        {
          slug: "sets",
          title: "Sets",
          content: `# Sets\n\nA Set is an unordered collection with **no duplicate elements**.\n\n## Creating a Set\n\n\`\`\`python\nfruits = {"apple", "banana", "cherry"}\nnumbers = {1, 2, 2, 3, 3, 4} # Becomes {1, 2, 3, 4}\n\`\`\`\n\n## Why Use Sets?\n\nIf you have a giant list and want to remove all duplicates instantly, convert it to a set!\n\n\`\`\`python\nmy_list = [1, 2, 2, 2, 3]\nunique = set(my_list)\nprint(unique) # {1, 2, 3}\n\`\`\`\n\n## Set Operations\n\n\`\`\`python\na = {1, 2, 3}\nb = {3, 4, 5}\n\nprint(a.union(b))        # {1, 2, 3, 4, 5}\nprint(a.intersection(b)) # {3}\n\`\`\``
        },
        {
          slug: "list-comprehension",
          title: "List Comprehension",
          content: `# List Comprehension\n\nA pythonic way to create a new list based on an existing one, all in a single line.\n\n## The Old Way (For Loop)\n\n\`\`\`python\nsquares = []\nfor x in range(5):\n    squares.append(x ** 2)\n\`\`\`\n\n## The Pythonic Way\n\n\`\`\`python\nsquares = [x ** 2 for x in range(5)]\n# Result: [0, 1, 4, 9, 16]\n\`\`\`\n\n## With an \`if\` Condition\n\nYou can filter items while creating the list:\n\n\`\`\`python\nnumbers = [1, 2, 3, 4, 5, 6]\nevens = [x for x in numbers if x % 2 == 0]\n# Result: [2, 4, 6]\n\`\`\``
        },
        {
          slug: "nested-data",
          title: "Nested Data",
          content: `# Nested Data\n\nYou can put lists inside lists, or dictionaries inside lists. This is how real-world data is usually structured.\n\n## List of Dictionaries\n\nThis is the most common structure you'll see in APIs:\n\n\`\`\`python\nusers = [\n    {"name": "Alice", "age": 25},\n    {"name": "Bob", "age": 30}\n]\n\nfor user in users:\n    print(user["name"])\n\`\`\`\n\n## 2D Lists (Matrices)\n\n\`\`\`python\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\nprint(matrix[1][2]) # 6\n\`\`\``
        },
        {
          slug: "sorting",
          title: "Sorting",
          content: `# Sorting\n\nPython makes sorting lists very easy.\n\n## Sort a List In-Place\n\n\`\`\`python\nnums = [3, 1, 4, 1, 5]\nnums.sort()\nprint(nums) # [1, 1, 3, 4, 5]\n\`\`\`\n\n## Get a Sorted Copy\n\n\`\`\`python\nnums = [3, 1, 2]\nsorted_nums = sorted(nums)\nprint(sorted_nums) # [1, 2, 3]\nprint(nums)        # [3, 1, 2] (original unchanged)\n\`\`\`\n\n## Sorting with a Custom Key\n\nSort strings by length:\n\`\`\`python\nwords = ["apple", "pie", "banana"]\nwords.sort(key=len)\nprint(words) # ["pie", "apple", "banana"]\n\`\`\``
        },
        {
          slug: "stacks-queues",
          title: "Stacks & Queues",
          content: `# Stacks & Queues\n\nThese are two fundamental ways to organize data.\n\n## Stack (LIFO - Last In, First Out)\n\nThink of a stack of plates. You add to the top and remove from the top.\n\n\`\`\`python\nstack = []\nstack.append(1) # Push\nstack.append(2) # Push\ntop = stack.pop() # Pop -> returns 2\n\`\`\`\n\n## Queue (FIFO - First In, First Out)\n\nThink of a line at a supermarket. The first person in line gets served first.\n\n\`\`\`python\nfrom collections import deque\n\nqueue = deque()\nqueue.append("Alice")\nqueue.append("Bob")\nfirst = queue.popleft() # Returns "Alice"\n\`\`\``
        }
      ]
    },
    {
      slug: "algorithms",
      title: "Algorithms & Logic",
      description: "Learn how to solve problems efficiently with classic algorithms.",
      level: "ADVANCED",
      order: 3,
      lessons: [
        {
          slug: "searching",
          title: "Linear & Binary Search",
          content: `# Searching Algorithms\n\n## Linear Search\n\nCheck every item one by one. Works on unsorted lists.\n\n\`\`\`python\ndef linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1\n\`\`\`\n\n## Binary Search\n\nExtremely fast, but requires a **sorted** list. It cuts the search space in half every time.\n\n\`\`\`python\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\`\`\``
        },
        {
          slug: "recursion",
          title: "Recursion",
          content: `# Recursion\n\nRecursion is when a function calls itself to solve a smaller version of the same problem.\n\n## The Classic Example: Factorial\n\n\`5! = 5 * 4 * 3 * 2 * 1 = 120\`\n\n\`\`\`python\ndef factorial(n):\n    if n == 1: # Base case (stops the recursion)\n        return 1\n    return n * factorial(n - 1) # Recursive case\n\`\`\`\n\n> ⚠️ **Warning:** Always have a **base case**, or you'll cause an infinite loop (Stack Overflow)!`
        },
        {
          slug: "bubble-sort",
          title: "Bubble Sort",
          content: `# Bubble Sort\n\nA simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.\n\n\`\`\`python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                # Swap\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\`\`\`\n\n## Complexity\n\nBubble sort is **O(n²)**. It is very slow for large lists, but great for learning how sorting works.`
        },
        {
          slug: "merge-sort",
          title: "Merge Sort",
          content: `# Merge Sort\n\nA "Divide and Conquer" algorithm. It splits the list in half, sorts each half, and then merges them back together.\n\n\`\`\`python\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\`\`\`\n\n## Complexity\n\nMerge Sort is **O(n log n)**, making it much faster than Bubble Sort for large datasets.`
        },
        {
          slug: "big-o",
          title: "Big O Notation",
          content: `# Big O Notation\n\nBig O describes how the time or memory an algorithm takes grows as the input size grows.\n\n## Common Complexities (Fast to Slow)\n\n1. **O(1)** - Constant time. (e.g., accessing a dictionary key)\n2. **O(log n)** - Logarithmic. (e.g., Binary Search)\n3. **O(n)** - Linear. (e.g., Looping through an array)\n4. **O(n log n)** - (e.g., Merge Sort, Quick Sort)\n5. **O(n²)** - Quadratic. (e.g., Nested loops, Bubble Sort)\n\n> 💡 **Pro Tip:** If you have a nested loop inside a loop, you are probably doing O(n²) which becomes very slow with big data!`
        },
        {
          slug: "graph-basics",
          title: "Graph Basics",
          content: `# Graph Basics\n\nA graph is a collection of nodes (vertices) connected by edges. Social networks, maps, and the internet are all graphs.\n\n## Representing a Graph\n\nThe most common way in Python is an **Adjacency List**:\n\n\`\`\`python\ngraph = {\n    "A": ["B", "C"],\n    "B": ["A", "D"],\n    "C": ["A"],\n    "D": ["B"]\n}\n\`\`\`\n\nThis means node "A" is connected to "B" and "C".`
        },
        {
          slug: "bfs-dfs",
          title: "BFS & DFS",
          content: `# BFS & DFS Traversals\n\n## BFS (Breadth-First Search)\n\nExplores level by level. Uses a **Queue**. Great for finding the shortest path.\n\n\`\`\`python\nfrom collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n\n    while queue:\n        node = queue.popleft()\n        print(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n\`\`\`\n\n## DFS (Depth-First Search)\n\nGoes deep down one path before backtracking. Uses a **Stack** (or recursion).\n\n\`\`\`python\ndef dfs(graph, node, visited=None):\n    if visited is None: visited = set()\n    if node in visited: return\n    \n    visited.add(node)\n    print(node)\n    for neighbor in graph[node]:\n        dfs(graph, neighbor, visited)\n\`\`\``
        },
        {
          slug: "dynamic-programming",
          title: "Dynamic Programming",
          content: `# Dynamic Programming (DP)\n\nDP is a method for solving complex problems by breaking them down into simpler subproblems. We **save the results** of subproblems (memoization) so we don't calculate them twice.\n\n## Example: Fibonacci\n\n### Slow Recursive Way\n\`\`\`python\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2) # Recalculates the same things!\n\`\`\`\n\n### Fast DP Way\n\`\`\`python\ndef fib_dp(n):\n    memo = {0: 0, 1: 1}\n    for i in range(2, n + 1):\n        memo[i] = memo[i-1] + memo[i-2]\n    return memo[n]\n\`\`\``
        }
      ]
    },
    {
      slug: "object-oriented",
      title: "Object-Oriented Python",
      description: "Build reusable, modular code using Classes and Objects.",
      level: "INTERMEDIATE",
      order: 4,
      lessons: [
        {
          slug: "classes",
          title: "Classes & Objects",
          content: `# Classes & Objects\n\nClasses allow you to bundle data and functions together. An object is an instance of a class.\n\n## Defining a Class\n\n\`\`\`python\nclass Dog:\n    def __init__(self, name, age):\n        self.name = name # Attribute\n        self.age = age   # Attribute\n\n    def bark(self):      # Method\n        return f"{self.name} says Woof!"\n\`\`\`\n\n## Creating Objects\n\n\`\`\`python\nmy_dog = Dog("Rex", 3)\nprint(my_dog.name) # Rex\nprint(my_dog.bark()) # Rex says Woof!\n\`\`\`\n\n> 💡 **\`self\`** is a reference to the current object. It must be the first parameter of every method.`
        },
        {
          slug: "methods",
          title: "Methods",
          content: `# Methods\n\nMethods are functions defined inside a class. They always take \`self\` as the first parameter.\n\n\`\`\`python\nclass BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return "Insufficient funds"\n        self.balance -= amount\n        return self.balance\n\`\`\``
        },
        {
          slug: "inheritance",
          title: "Inheritance",
          content: `# Inheritance\n\nInheritance allows a class to inherit attributes and methods from another class. This promotes code reuse.\n\n\`\`\`python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "Some sound"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow!"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"\n\ncat = Cat("Whiskers")\nprint(cat.speak()) # Meow!\n\`\`\`\n\nThe \`Cat\` and \`Dog\` classes inherited the \`__init__\` from \`Animal\`, but overrode the \`speak\` method.`
        },
        {
          slug: "polymorphism",
          title: "Polymorphism",
          content: `# Polymorphism\n\nPolymorphism means "many forms". It allows different classes to be treated as instances of the same parent class, but each behaves differently.\n\n\`\`\`python\nclass Shape:\n    def area(self):\n        pass\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side ** 2\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return 3.14 * (self.radius ** 2)\n\n# Loop handles both perfectly!\nshapes = [Square(4), Circle(2)]\nfor s in shapes:\n    print(s.area())\n\`\`\``
        },
        {
          slug: "dunder",
          title: "Magic Methods (Dunder)",
          content: `# Magic Methods (Dunder)\n\n"Double underscore" methods let you define how Python objects behave with built-in operators.\n\n## The \`__str__\` Method\n\nDefines what happens when you \`print(object)\`.\n\n\`\`\`python\nclass Book:\n    def __init__(self, title):\n        self.title = title\n\n    def __str__(self):\n        return f"Book: {self.title}"\n\nb = Book("Python 101")\nprint(b) # Book: Python 101\n\`\`\`\n\n## Other Common Dunders\n\n- \`__len__\` : defines \`len(object)\`\n- \`__add__\` : defines \`object1 + object2\`\n- \`__eq__\` : defines \`object1 == object2\``
        },
        {
          slug: "dataclasses",
          title: "Dataclasses",
          content: `# Dataclasses\n\nPython 3.7 introduced \`dataclasses\` to make classes that mostly just hold data much cleaner.\n\n## Without Dataclass\n\n\`\`\`python\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\`\`\`\n\n## With Dataclass\n\n\`\`\`python\nfrom dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(10, 20)\nprint(p) # Point(x=10, y=20)\n\`\`\`\n\nIt automatically generates \`__init__\`, \`__repr__\`, and \`__eq__\` for you!`
        },
        {
          slug: "decorators",
          title: "Decorators",
          content: `# Decorators\n\nDecorators allow you to modify or extend the behavior of a function without changing its code.\n\n\`\`\`python\ndef my_decorator(func):\n    def wrapper():\n        print("Something before the function.")\n        func()\n        print("Something after the function.")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n\nsay_hello()\n\`\`\`\n\nThe \`@\` syntax is just a shortcut for \`say_hello = my_decorator(say_hello)\`.`
        },
        {
          slug: "generators",
          title: "Generators",
          content: `# Generators\n\nGenerators are functions that yield values one at a time instead of returning them all at once. They are memory-efficient for large data.\n\n## The \`yield\` Keyword\n\n\`\`\`python\ndef count_up_to(n):\n    count = 1\n    while count <= n:\n        yield count\n        count += 1\n\nfor num in count_up_to(3):\n    print(num)\n# Prints 1, 2, 3\n\`\`\`\n\nBecause it uses \`yield\`, the function pauses after every number instead of calculating everything in memory.`
        }
      ]
    },
    {
      slug: "real-world",
      title: "Real-World Python",
      description: "File I/O, Error Handling, APIs, and professional programming practices.",
      level: "ADVANCED",
      order: 5,
      lessons: [
        {
          slug: "error-handling",
          title: "Error Handling",
          content: `# Error Handling\n\nReal programs crash. Python's \`try/except\` lets you handle errors gracefully.\n\n\`\`\`python\ntry:\n    num = int(input("Enter a number: "))\n    print(10 / num)\nexcept ValueError:\n    print("That's not a valid number!")\nexcept ZeroDivisionError:\n    print("You cannot divide by zero!")\nfinally:\n    print("Program finished.")\n\`\`\`\n\n> 💡 **\`finally\`** always runs, whether an error occurred or not. Great for cleanup!`
        },
        {
          slug: "file-io",
          title: "File I/O",
          content: `# File I/O\n\nRead and write files using Python.\n\n## Writing a File\n\n\`\`\`python\nwith open("notes.txt", "w") as f:\n    f.write("Hello, File!")\n\`\`\`\n\n> 💡 The \`with\` statement automatically closes the file for you.\n\n## Reading a File\n\n\`\`\`python\nwith open("notes.txt", "r") as f:\n    content = f.read()\n    print(content)\n\`\`\`\n\nFile modes: \`r\` (read), \`w\` (write/overwrite), \`a\` (append), \`rb\` (read binary).`
        },
        {
          slug: "json",
          title: "Working with JSON",
          content: `# Working with JSON\n\nJSON is the standard format for data exchange on the web.\n\n## Parsing JSON\n\n\`\`\`python\nimport json\n\njson_string = '{"name": "Alice", "age": 25}'\ndata = json.loads(json_string)\nprint(data["name"]) # Alice\n\`\`\`\n\n## Writing JSON\n\n\`\`\`python\nimport json\n\ndata = {"name": "Bob", "score": 100}\njson_string = json.dumps(data)\nprint(json_string) # {"name": "Bob", "score": 100}\n\`\`\``
        },
        {
          slug: "apis",
          title: "APIs & Requests",
          content: `# APIs & Requests\n\nYou can fetch data from the internet using the \`requests\` library (needs \`pip install requests\`).\n\n\`\`\`python\nimport requests\n\nresponse = requests.get("https://api.github.com/users/octocat")\nif response.status_code == 200:\n    data = response.json()\n    print(data["name"])\n\`\`\`\n\n> ⚠️ Always check \`response.status_code\` before using the data!`
        },
        {
          slug: "web-scraping",
          title: "Web Scraping",
          content: `# Web Scraping\n\nExtracting data from websites using \`BeautifulSoup\`.\n\n\`\`\`python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = "http://example.com"\nresponse = requests.get(url)\nsoup = BeautifulSoup(response.text, "html.parser")\n\n# Find all links\nfor link in soup.find_all("a"):\n    print(link.get("href"))\n\`\`\``
        },
        {
          slug: "virtual-envs",
          title: "Virtual Environments",
          content: `# Virtual Environments\n\nWhen building projects, you install 3rd-party packages. If you install them globally, they might conflict with other projects.\n\n## Creating a Venv\n\n\`\`\`bash\npython -m venv myenv\n\`\`\`\n\n## Activating it\n\n**Windows:**\n\`\`\`bash\nmyenv\\Scripts\\activate\n\`\`\`\n\n**Mac/Linux:**\n\`\`\`bash\nsource myenv/bin/activate\n\`\`\`\n\nNow any \`pip install\` will only affect this specific project!`
        },
        {
          slug: "pip",
          title: "Pip & Packages",
          content: `# Pip & Packages\n\n\`pip\` is the Python package installer.\n\n## Installing a Package\n\n\`\`\`bash\npip install requests\n\`\`\`\n\n## View Installed Packages\n\n\`\`\`bash\npip list\n\`\`\`\n\n## Exporting Requirements\n\nYou can save all your project dependencies to a file:\n\n\`\`\`bash\npip freeze > requirements.txt\n\`\`\`\n\nAnyone else can install them by running \`pip install -r requirements.txt\`.`
        },
        {
          slug: "testing",
          title: "Testing (Pytest)",
          content: `# Testing (Pytest)\n\nAlways test your code to ensure it works and doesn't break later.\n\n## Writing a Test\n\n\`\`\`python\n# test_math.py\ndef add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n\`\`\`\n\n## Running Tests\n\nInstall pytest: \`pip install pytest\`\nRun: \`pytest\`\n\nPytest will automatically find all files starting with \`test_\` and run the functions.`
        }
      ]
    }
  ];

  for (const c of coursesData) {
    const course = await prisma.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        level: c.level,
        order: c.order,
        published: true,
      }
    });

    for (let i = 0; i < c.lessons.length; i++) {
      // 1. Create the Lesson
      const lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          slug: c.lessons[i].slug,
          title: c.lessons[i].title,
          content: c.lessons[i].content,
          order: i + 1,
          estimatedMin: 10,
        }
      });

      // 2. Automatically create a Quiz for this lesson
      const quiz = await prisma.quiz.create({
        data: {
          lessonId: lesson.id,
          title: `${c.lessons[i].title} Quiz`,
          description: "Test your knowledge of this lesson.",
        }
      });

      // 3. Add a Question based on the lesson title
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: `What is the main concept taught in "${c.lessons[i].title}"?`,
          type: "MULTIPLE_CHOICE",
          explanation: "Review the lesson content if you are unsure.",
          order: 1,
          choices: {
            create: [
              { text: c.lessons[i].title, isCorrect: true, order: 1 },
              { text: "A concept from another lesson", isCorrect: false, order: 2 },
              { text: "Something unrelated to Python", isCorrect: false, order: 3 },
              { text: "None of the above", isCorrect: false, order: 4 },
            ]
          }
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // 2. CODING MISSIONS (30 Missions total)
  // ═══════════════════════════════════════════════════════

  const missionsData = [
    { title: "Sum Two Numbers", desc: "Add two numbers and return the result.", code: "def add(a, b):\n    pass", diff: "EASY", xp: 20 },
    { title: "Multiply Numbers", desc: "Multiply two numbers.", code: "def multiply(a, b):\n    pass", diff: "EASY", xp: 20 },
    { title: "Check Even or Odd", desc: "Return 'Even' if n is even, else 'Odd'.", code: "def check_even_odd(n):\n    pass", diff: "EASY", xp: 20 },
    { title: "Reverse a String", desc: "Return the reversed string.", code: "def reverse_string(s):\n    pass", diff: "EASY", xp: 20 },
    { title: "Find Maximum", desc: "Return the largest number in a list.", code: "def find_max(nums):\n    pass", diff: "EASY", xp: 20 },
    { title: "Count Vowels", desc: "Count vowels in a string.", code: "def count_vowels(s):\n    pass", diff: "EASY", xp: 20 },
    { title: "Capitalize Words", desc: "Capitalize the first letter of each word.", code: "def capitalize(s):\n    pass", diff: "EASY", xp: 20 },
    { title: "Factorial", desc: "Return the factorial of n.", code: "def factorial(n):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Fibonacci", desc: "Return the nth Fibonacci number.", code: "def fib(n):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Palindrome Check", desc: "Return True if string is a palindrome.", code: "def is_palindrome(s):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Sum of List", desc: "Return the sum of all elements in a list.", code: "def sum_list(nums):\n    pass", diff: "EASY", xp: 20 },
    { title: "Remove Duplicates", desc: "Remove duplicate values from a list.", code: "def remove_dups(nums):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Anagram Checker", desc: "Check if two strings are anagrams.", code: "def is_anagram(a, b):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Prime Number", desc: "Check if a number is prime.", code: "def is_prime(n):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "FizzBuzz", desc: "Classic FizzBuzz problem.", code: "def fizzbuzz(n):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Sort List", desc: "Sort a list of numbers.", code: "def sort_list(nums):\n    pass", diff: "EASY", xp: 20 },
    { title: "Binary Search", desc: "Implement binary search on a sorted list.", code: "def binary_search(arr, target):\n    pass", diff: "HARD", xp: 100 },
    { title: "Two Sum", desc: "Find two numbers that add up to a target.", code: "def two_sum(nums, target):\n    pass", diff: "HARD", xp: 100 },
    { title: "Matrix Addition", desc: "Add two 2D matrices together.", code: "def add_matrices(a, b):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Celsius to Fahrenheit", desc: "Convert Celsius to Fahrenheit.", code: "def c_to_f(c):\n    pass", diff: "EASY", xp: 20 },
    { title: "Count Words", desc: "Count the number of words in a sentence.", code: "def count_words(s):\n    pass", diff: "EASY", xp: 20 },
    { title: "Odd/Even Filter", desc: "Return only even numbers from a list.", code: "def evens_only(nums):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "String to Number", desc: "Convert string '123' to integer 123.", code: "def str_to_int(s):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Longest Word", desc: "Find the longest word in a sentence.", code: "def longest_word(s):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Unique Elements", desc: "Count unique elements in a list.", code: "def count_unique(nums):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Reverse List", desc: "Reverse a list in place.", code: "def reverse_list(nums):\n    pass", diff: "EASY", xp: 20 },
    { title: "Array Intersection", desc: "Find common elements between two lists.", code: "def intersect(a, b):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Factorial Recursion", desc: "Solve factorial using recursion.", code: "def rec_fact(n):\n    pass", diff: "HARD", xp: 100 },
    { title: "Sum of Digits", desc: "Sum all digits in a number (e.g., 123 -> 6).", code: "def sum_digits(n):\n    pass", diff: "MEDIUM", xp: 40 },
    { title: "Valid Parentheses", desc: "Check if brackets are properly closed.", code: "def valid_brackets(s):\n    pass", diff: "HARD", xp: 100 },
  ];

  await prisma.mission.createMany({
    data: missionsData.map((m, i) => ({
      slug: m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: m.title,
      description: m.desc,
      difficulty: m.diff,
      starterCode: m.code,
      xpReward: m.xp,
      order: i + 1,
      tests: JSON.stringify([{ testCode: "print('test')", expectedOutput: "test" }])
    }))
  });

  // ═══════════════════════════════════════════════════════
  // 3. PROJECTS (25 Projects total)
  // ═══════════════════════════════════════════════════════

  const projectsData = [
    { title: "Calculator", desc: "Build a functional calculator that handles +, -, *, /.", level: "BEGINNER", code: "def calculate(a, op, b):\n    pass" },
    { title: "Number Guessing Game", desc: "A game where the user guesses a number.", level: "BEGINNER", code: "import random\n\ndef guess_game():\n    pass" },
    { title: "To-Do List", desc: "Create a class to manage a list of tasks.", level: "BEGINNER", code: "class ToDoList:\n    def __init__(self):\n        pass" },
    { title: "Temperature Converter", desc: "Convert between Celsius, Fahrenheit, and Kelvin.", level: "BEGINNER", code: "def convert_temp(val, unit):\n    pass" },
    { title: "Password Generator", desc: "Generate a random, strong password.", level: "BEGINNER", code: "import string\nimport random\n\ndef gen_password():\n    pass" },
    { title: "Student Grade Manager", desc: "Manage student grades and calculate averages.", level: "INTERMEDIATE", code: "def get_average(grades):\n    pass" },
    { title: "Banking System", desc: "Simulate a bank account with deposit/withdraw.", level: "INTERMEDIATE", code: "class BankAccount:\n    pass" },
    { title: "Rock Paper Scissors", desc: "Play Rock, Paper, Scissors against the computer.", level: "BEGINNER", code: "def play_rps(player):\n    pass" },
    { title: "Contact Book", desc: "Store and retrieve contacts.", level: "INTERMEDIATE", code: "class ContactBook:\n    pass" },
    { title: "Quiz App", desc: "Build a multiple-choice quiz application.", level: "INTERMEDIATE", code: "def run_quiz(questions):\n    pass" },
    { title: "Hangman Game", desc: "Classic word guessing game.", level: "INTERMEDIATE", code: "def hangman(word):\n    pass" },
    { title: "Expense Tracker", desc: "Track income and expenses.", level: "INTERMEDIATE", code: "class ExpenseTracker:\n    pass" },
    { title: "Text Adventure Game", desc: "Build a text-based adventure.", level: "INTERMEDIATE", code: "def start_game():\n    pass" },
    { title: "Weather Fetcher", desc: "Simulate fetching weather data.", level: "INTERMEDIATE", code: "def get_weather(city):\n    pass" },
    { title: "Library Management", desc: "Manage books, borrowing, and returning.", level: "INTERMEDIATE", code: "class Library:\n    pass" },
    { title: "URL Shortener", desc: "Simulate shortening URLs.", level: "ADVANCED", code: "def shorten_url(url):\n    pass" },
    { title: "Chat Bot", desc: "Build a simple rule-based chatbot.", level: "INTERMEDIATE", code: "def chat(response):\n    pass" },
    { title: "Snake Game", desc: "Simulate the logic of a snake game.", level: "ADVANCED", code: "def move_snake(snake, direction):\n    pass" },
    { title: "Web Scraper", desc: "Simulate extracting data from HTML.", level: "ADVANCED", code: "def scrape(html):\n    pass" },
    { title: "Inventory System", desc: "Manage store inventory.", level: "INTERMEDIATE", code: "class Inventory:\n    pass" },
    { title: "Chess Board", desc: "Represent a chess board and valid moves.", level: "ADVANCED", code: "class ChessBoard:\n    pass" },
    { title: "Tic Tac Toe", desc: "Build the game logic for Tic Tac Toe.", level: "INTERMEDIATE", code: "def check_win(board):\n    pass" },
    { title: "Blog Engine", desc: "Simulate a blog with posts and comments.", level: "ADVANCED", code: "class Blog:\n    pass" },
    { title: "Flashcards", desc: "Create a flashcard app for studying.", level: "INTERMEDIATE", code: "class Flashcard:\n    pass" },
    { title: "Sudoku Solver", desc: "Solve a Sudoku puzzle using backtracking.", level: "ADVANCED", code: "def solve_sudoku(board):\n    pass" },
  ];

  await prisma.project.createMany({
    data: projectsData.map((p) => ({
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: p.title,
      description: p.desc,
      level: p.level,
      starterCode: p.code,
      requirements: JSON.stringify([{ description: "Must solve the problem correctly", test: "" }])
    }))
  });

  // ═══════════════════════════════════════════════════════
  // 4. MAKE ANIS THE ADMIN
  // ═══════════════════════════════════════════════════════
  await prisma.user.updateMany({
    where: { email: "aniskel96@gmail.com" },
    data: { role: "ADMIN" }
  });

  console.log("✅ Seed complete!");
  console.log(`   ${await prisma.course.count()} courses`);
  console.log(`   ${await prisma.lesson.count()} lessons`);
  console.log(`   ${await prisma.quiz.count()} quizzes`);
  console.log(`   ${await prisma.mission.count()} missions`);
  console.log(`   ${await prisma.project.count()} projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });