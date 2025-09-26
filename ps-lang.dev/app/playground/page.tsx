"use client"

import Navigation from "@/components/navigation"
import { useState } from "react"

export default function PlaygroundPage() {
  const [code, setCode] = useState(`DEFINE greeting_system:
  INPUT: user_name as string
  
  PROCESS:
    IF user_name is empty:
      SET message = "Hello, World!"
    ELSE:
      SET message = "Hello, " + user_name + "!"
    
  OUTPUT: message
  
EXECUTE greeting_system WITH "Developer"`)

  const [output, setOutput] = useState("Hello, Developer!")

  const runCode = () => {
    // Simulate code execution
    setOutput("Program executed successfully!\nOutput: Hello, Developer!")
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-editorial text-4xl font-bold text-ink">Playground</h1>
            <span className="ink-stamp text-stamp-blue">Interactive</span>
          </div>

          <p className="font-editorial text-ink-light text-xl mb-8">
            Write and test ps-lang programs directly in your browser. Experiment with syntax and see results in
            real-time.
          </p>

          <div className="rubber-band mb-8"></div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-typewriter font-bold text-ink">Code Editor</h2>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    className="paper-card px-4 py-2 font-typewriter font-bold text-ink hover:text-stamp-red transition-colors"
                  >
                    Run Code
                  </button>
                  <button className="font-typewriter text-ink-light hover:text-ink transition-colors">Clear</button>
                </div>
              </div>

              <div className="paper-card p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-typewriter text-sm text-ink bg-transparent border-none outline-none resize-none"
                  placeholder="Write your ps-lang code here..."
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              <h2 className="font-typewriter font-bold text-ink">Output</h2>

              <div className="paper-card p-4">
                <pre className="font-typewriter text-sm text-ink-light h-96 overflow-auto whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          </div>

          <div className="rubber-band my-8"></div>

          {/* Example Programs */}
          <div className="space-y-6">
            <h2 className="font-editorial text-2xl font-bold text-ink">Example Programs</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() =>
                  setCode(`DEFINE fibonacci:
  INPUT: n as number
  
  PROCESS:
    IF n <= 1:
      OUTPUT: n
    ELSE:
      SET a = 0
      SET b = 1
      FOR i FROM 2 TO n:
        SET temp = a + b
        SET a = b
        SET b = temp
      OUTPUT: b

EXECUTE fibonacci WITH 10`)
                }
                className="paper-card p-4 text-left hover:shadow-lg transition-shadow"
              >
                <h3 className="font-typewriter font-bold text-ink mb-2">Fibonacci</h3>
                <p className="font-editorial text-ink-light text-sm">Calculate Fibonacci numbers</p>
              </button>

              <button
                onClick={() =>
                  setCode(`DEFINE sort_numbers:
  INPUT: numbers as list
  
  PROCESS:
    FOR i FROM 0 TO LENGTH(numbers) - 1:
      FOR j FROM 0 TO LENGTH(numbers) - i - 2:
        IF numbers[j] > numbers[j + 1]:
          SET temp = numbers[j]
          SET numbers[j] = numbers[j + 1]
          SET numbers[j + 1] = temp
  
  OUTPUT: numbers

EXECUTE sort_numbers WITH [64, 34, 25, 12, 22, 11, 90]`)
                }
                className="paper-card p-4 text-left hover:shadow-lg transition-shadow"
              >
                <h3 className="font-typewriter font-bold text-ink mb-2">Bubble Sort</h3>
                <p className="font-editorial text-ink-light text-sm">Sort a list of numbers</p>
              </button>

              <button
                onClick={() =>
                  setCode(`DEFINE password_checker:
  INPUT: password as string
  
  PROCESS:
    SET score = 0
    SET feedback = []
    
    IF LENGTH(password) >= 8:
      SET score = score + 1
    ELSE:
      ADD "Use at least 8 characters" TO feedback
    
    IF CONTAINS_UPPERCASE(password):
      SET score = score + 1
    ELSE:
      ADD "Include uppercase letters" TO feedback
    
    IF CONTAINS_NUMBERS(password):
      SET score = score + 1
    ELSE:
      ADD "Include numbers" TO feedback
  
  OUTPUT: {
    "strength": score,
    "suggestions": feedback
  }

EXECUTE password_checker WITH "mypassword123"`)
                }
                className="paper-card p-4 text-left hover:shadow-lg transition-shadow"
              >
                <h3 className="font-typewriter font-bold text-ink mb-2">Password Checker</h3>
                <p className="font-editorial text-ink-light text-sm">Validate password strength</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
