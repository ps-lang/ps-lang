import Navigation from "@/components/navigation"

export default function ExamplesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-editorial text-4xl font-bold text-ink">Examples</h1>
            <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">COLLECTION</span>
          </div>

          <p className="font-editorial text-ink-light text-xl mb-8">
            Explore real-world examples of ps-lang programs, from simple algorithms to complex AI collaboration
            patterns.
          </p>

          <div className="rubber-band mb-8"></div>

          <div className="grid gap-8">
            {/* Data Processing Example */}
            <div className="paper-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-editorial text-2xl font-bold text-ink">Data Processing</h2>
                <span className="border border-stone-300 px-2 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">BEGINNER</span>
              </div>

              <p className="font-editorial text-ink-light mb-4">
                Process a list of student grades and calculate statistics.
              </p>

              <div className="paper-card p-4 mb-4">
                <pre className="font-typewriter text-ink text-sm overflow-x-auto">
                  {`DEFINE grade_analyzer:
  INPUT: grades as list of numbers
  
  PROCESS:
    SET total = 0
    SET count = 0
    SET highest = grades[0]
    SET lowest = grades[0]
    
    FOR each grade IN grades:
      SET total = total + grade
      SET count = count + 1
      
      IF grade > highest:
        SET highest = grade
      
      IF grade < lowest:
        SET lowest = grade
    
    SET average = total / count
    
    SET statistics = {
      "average": average,
      "highest": highest,
      "lowest": lowest,
      "total_students": count
    }
  
  OUTPUT: statistics

EXECUTE grade_analyzer WITH [85, 92, 78, 96, 88, 73, 91]`}
                </pre>
              </div>
            </div>

            {/* AI Collaboration Example */}
            <div className="paper-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-editorial text-2xl font-bold text-ink">AI Collaboration</h2>
                <span className="border border-stone-300 px-2 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">ADVANCED</span>
              </div>

              <p className="font-editorial text-ink-light mb-4">
                A program designed for human-AI collaborative text analysis.
              </p>

              <div className="paper-card p-4 mb-4">
                <pre className="font-typewriter text-ink text-sm overflow-x-auto">
                  {`DEFINE collaborative_text_analyzer:
  INPUT: 
    text_content as string
    analysis_type as string
    ai_assistant as AI_Agent
  
  PROCESS:
    // Human preprocessing
    SET cleaned_text = REMOVE_SPECIAL_CHARS(text_content)
    SET word_count = COUNT_WORDS(cleaned_text)
    
    // AI analysis request
    IF analysis_type equals "sentiment":
      ASK ai_assistant: "Analyze sentiment of: " + cleaned_text
      SET ai_result = WAIT_FOR_RESPONSE(ai_assistant)
    
    ELSE IF analysis_type equals "summary":
      ASK ai_assistant: "Summarize in 3 sentences: " + cleaned_text
      SET ai_result = WAIT_FOR_RESPONSE(ai_assistant)
    
    // Human validation
    DISPLAY ai_result TO human
    ASK human: "Is this analysis accurate? (yes/no)"
    SET human_approval = GET_USER_INPUT()
    
    IF human_approval equals "no":
      ASK human: "Please provide corrections:"
      SET corrections = GET_USER_INPUT()
      SET final_result = MERGE(ai_result, corrections)
    ELSE:
      SET final_result = ai_result
  
  OUTPUT: {
    "original_word_count": word_count,
    "analysis_type": analysis_type,
    "ai_analysis": ai_result,
    "human_validated": human_approval,
    "final_result": final_result
  }

EXECUTE collaborative_text_analyzer WITH 
  "The weather today is absolutely beautiful...", 
  "sentiment", 
  GPT_ASSISTANT`}
                </pre>
              </div>
            </div>

            {/* Algorithm Example */}
            <div className="paper-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-editorial text-2xl font-bold text-ink">Search Algorithm</h2>
                <span className="border border-stone-300 px-2 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">INTERMEDIATE</span>
              </div>

              <p className="font-editorial text-ink-light mb-4">
                Binary search implementation with clear step-by-step logic.
              </p>

              <div className="paper-card p-4 mb-4">
                <pre className="font-typewriter text-ink text-sm overflow-x-auto">
                  {`DEFINE binary_search:
  INPUT: 
    sorted_list as list of numbers
    target as number
  
  PROCESS:
    SET left_index = 0
    SET right_index = LENGTH(sorted_list) - 1
    SET found = false
    SET position = -1
    
    WHILE left_index <= right_index AND found equals false:
      SET middle_index = (left_index + right_index) / 2
      SET middle_value = sorted_list[middle_index]
      
      IF middle_value equals target:
        SET found = true
        SET position = middle_index
      
      ELSE IF middle_value < target:
        SET left_index = middle_index + 1
      
      ELSE:
        SET right_index = middle_index - 1
    
    IF found equals true:
      OUTPUT: "Found at position " + position
    ELSE:
      OUTPUT: "Not found in list"

EXECUTE binary_search WITH [1, 3, 5, 7, 9, 11, 13, 15], 7`}
                </pre>
              </div>
            </div>
          </div>

          <div className="rubber-band my-8"></div>

          <div className="text-center">
            <h3 className="font-editorial text-2xl font-bold text-ink mb-4">Want to contribute?</h3>
            <p className="font-editorial text-ink-light mb-6">
              Share your ps-lang examples with the community and help others learn.
            </p>
            <a
              href="/contribute"
              className="border border-stone-900 px-6 py-3 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wide inline-block"
            >
              Submit Example
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
