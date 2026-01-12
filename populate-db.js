
// Native fetch is available in Node 18+
// If native fetch is available (Node 18+), we don't need require.

async function populate() {
    console.log("Starting DB population...");
    for (let i = 0; i < 9; i++) { // Run 9 times x 10 questions = 90 + existing 20 = 110
        try {
            console.log(`Batch ${i + 1}/9...`);
            const res = await fetch('http://localhost:3000/api/cron/refresh-questions');
            const data = await res.json();
            if (res.ok) {
                console.log(`Success! Added ${data.questions?.length} questions.`);
            } else {
                console.error("Failed:", data);
            }
        } catch (e) {
            console.error("Error:", e.message);
        }
        // Wait 2 seconds to be nice to Grok API
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("Done!");
}

populate();
