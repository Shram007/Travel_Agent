import fetch from 'node-fetch';

const GMI_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhYjRkNWQ3LWU2ODQtNGMxMC1hMDA2LTgwMjJlZDQ0NGE1YyIsInNjb3BlIjoiaWVfbW9kZWwiLCJjbGllbnRJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.04vD4rmx43iA7KUTjAJOG6RHrfB_FY2_xVa2-3RTNGk";
const GMI_BASE_URL = 'https://api.gmi-serving.com/v1';

async function list() {
  try {
    const res = await fetch(`${GMI_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${GMI_API_KEY}` }
    });
    const data = await res.json();
    console.log(data.data.map(m => m.id).join('\n'));
  } catch (err) {
    console.error(err);
  }
}

list();
