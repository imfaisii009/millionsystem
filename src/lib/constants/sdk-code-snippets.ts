/**
 * Code snippets for various frameworks showing how to use the IQ Quiz API
 * These are ready-to-paste examples that developers can copy into their projects
 */

export interface CodeSnippet {
    id: string;
    label: string;
    language: string;
    code: string;
}

const API_URL = 'https://millionsystem.com/api/v1/quiz';

export const CODE_SNIPPETS: CodeSnippet[] = [
    {
        id: 'nodejs',
        label: 'Node.js',
        language: 'javascript',
        code: `// Node.js - Fetch IQ Quiz Questions
const response = await fetch('${API_URL}');
const { questions } = await response.json();

// Each question has:
// - question: string (the question text)
// - options: string[] (4 answer choices)
// - correct_answer: number (index 0-3)
// - category: string (e.g., "Logical", "Numerical")

questions.forEach((q, i) => {
  console.log(\`Q\${i + 1}: \${q.question}\`);
  q.options.forEach((opt, j) => {
    const marker = j === q.correct_answer ? '✓' : ' ';
    console.log(\`  \${marker} \${opt}\`);
  });
});`
    },
    {
        id: 'vercel',
        label: 'Vercel',
        language: 'typescript',
        code: `// Vercel Edge Function / API Route
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('${API_URL}');
  const data = await res.json();

  // Transform or filter questions as needed
  const questions = data.questions.map(q => ({
    id: crypto.randomUUID(),
    text: q.question,
    choices: q.options,
    answer: q.correct_answer,
    type: q.category,
  }));

  return NextResponse.json({ questions });
}`
    },
    {
        id: 'supabase',
        label: 'Supabase Edge',
        language: 'typescript',
        code: `// Supabase Edge Function (Deno)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async () => {
  const response = await fetch('${API_URL}');
  const data = await response.json();

  return new Response(JSON.stringify({
    success: true,
    quiz: data.questions,
    total: data.count,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});`
    },
    {
        id: 'deno',
        label: 'Deno',
        language: 'typescript',
        code: `// Deno - Fetch and Display Quiz
const response = await fetch('${API_URL}');
const { questions } = await response.json();

console.log('IQ Quiz - 10 Questions\\n');

for (const [i, q] of questions.entries()) {
  console.log(\`\${i + 1}. \${q.question}\`);
  console.log(\`   Category: \${q.category}\`);
  q.options.forEach((opt: string, j: number) => {
    console.log(\`   \${String.fromCharCode(65 + j)}) \${opt}\`);
  });
  console.log(\`   Answer: \${String.fromCharCode(65 + q.correct_answer)}\\n\`);
}`
    },
    {
        id: 'cloudflare',
        label: 'Cloudflare',
        language: 'javascript',
        code: `// Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    const response = await fetch('${API_URL}');
    const data = await response.json();

    return new Response(JSON.stringify({
      questions: data.questions,
      count: data.count,
      cached: false,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600',
      },
    });
  },
};`
    },
    {
        id: 'lambda',
        label: 'AWS Lambda',
        language: 'javascript',
        code: `// AWS Lambda Handler
export const handler = async (event) => {
  const response = await fetch('${API_URL}');
  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      questions: data.questions,
      count: data.count,
    }),
  };
};`
    },
    {
        id: 'python',
        label: 'Python',
        language: 'python',
        code: `# Python - Using requests library
import requests

response = requests.get('${API_URL}')
data = response.json()

print(f"Loaded {data['count']} questions\\n")

for i, q in enumerate(data['questions'], 1):
    print(f"{i}. {q['question']}")
    print(f"   Category: {q['category']}")
    for j, opt in enumerate(q['options']):
        marker = "→" if j == q['correct_answer'] else " "
        print(f"   {marker} {chr(65+j)}) {opt}")
    print()`
    },
    {
        id: 'go',
        label: 'Go',
        language: 'go',
        code: `// Go - Fetch Quiz Questions
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Question struct {
    Question      string   \`json:"question"\`
    Options       []string \`json:"options"\`
    CorrectAnswer int      \`json:"correct_answer"\`
    Category      string   \`json:"category"\`
}

type Response struct {
    Questions []Question \`json:"questions"\`
    Count     int        \`json:"count"\`
}

func main() {
    resp, _ := http.Get("${API_URL}")
    defer resp.Body.Close()

    var data Response
    json.NewDecoder(resp.Body).Decode(&data)

    for i, q := range data.Questions {
        fmt.Printf("%d. %s\\n", i+1, q.Question)
    }
}`
    },
    {
        id: 'ruby',
        label: 'Ruby',
        language: 'ruby',
        code: `# Ruby - Fetch Quiz Questions
require 'net/http'
require 'json'

uri = URI('${API_URL}')
response = Net::HTTP.get(uri)
data = JSON.parse(response)

puts "IQ Quiz - #{data['count']} Questions\\n\\n"

data['questions'].each_with_index do |q, i|
  puts "#{i + 1}. #{q['question']}"
  puts "   Category: #{q['category']}"
  q['options'].each_with_index do |opt, j|
    marker = j == q['correct_answer'] ? '✓' : ' '
    puts "   #{marker} #{('A'.ord + j).chr}) #{opt}"
  end
  puts
end`
    },
    {
        id: 'php',
        label: 'PHP',
        language: 'php',
        code: `<?php
// PHP - Fetch Quiz Questions
$response = file_get_contents('${API_URL}');
$data = json_decode($response, true);

echo "IQ Quiz - {$data['count']} Questions\\n\\n";

foreach ($data['questions'] as $i => $q) {
    $num = $i + 1;
    echo "{$num}. {$q['question']}\\n";
    echo "   Category: {$q['category']}\\n";

    foreach ($q['options'] as $j => $opt) {
        $letter = chr(65 + $j);
        $marker = $j === $q['correct_answer'] ? '✓' : ' ';
        echo "   {$marker} {$letter}) {$opt}\\n";
    }
    echo "\\n";
}
?>`
    }
];
