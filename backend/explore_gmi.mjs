/**
 * explore_gmi.mjs
 * Testing GMI Cloud Serverless Endpoint (OpenAI-compatible).
 */

import fetch from 'node-fetch';
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = fetch.Headers;
  globalThis.Request = fetch.Request;
  globalThis.Response = fetch.Response;
}

const GMI_API_KEY = process.env.GMI_API_KEY;

if (!GMI_API_KEY) {
  console.error("❌ GMI_API_KEY not set in .env");
  process.exit(1);
}

// GMI Cloud provides an OpenAI-compatible API endpoint
const GMI_BASE_URL = 'https://api.gmi-serving.com/v1'; // Standard OpenAI compatible URL
// Let's check their model list first
async function getModels() {
  try {
    const res = await fetch(`${GMI_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${GMI_API_KEY}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
    const data = await res.json();
    console.log("✅ Models available:", data.data.map(m => m.id));
    return data.data[0]?.id || 'llama-3-70b-instruct'; // Fallback guess
  } catch (err) {
    console.error("❌ Failed to fetch models:", err.message);
    return null;
  }
}

async function testChat(modelId) {
  const prompt = "I want to go to some nice beaches this summer. Give me top 5 recommendations and one followup question to enhance that list.";
  
  console.log(`\n💬 Prompt: ${prompt}`);
  console.log(`🤖 Model: ${modelId}`);
  console.log("⏳ Waiting for response...");

  const res = await fetch(`${GMI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GMI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!res.ok) {
    console.error(`❌ Chat failed: HTTP ${res.status}`, await res.text());
    return;
  }

  const data = await res.json();
  console.log("\n✅ Response:\n");
  console.log(data.choices[0].message.content);
}

async function main() {
  const modelId = await getModels();
  if (modelId) {
    await testChat(modelId);
  }
}

main();
