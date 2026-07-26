/* =========================================================
   GAMETHON — The Living AI Universe
   Core Offline AI Brain & RAG Vector Engine
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

class GamethonAIBrain {
  constructor() {
    this.memoryStore = []; // Simulated local RAG vector store
    this.isOllamaAvailable = false;
    this.checkOllamaHealth();
  }

  // Check if Ollama is running on localhost:11434
  async checkOllamaHealth() {
    try {
      const res = await fetch("http://localhost:11434/api/tags", { method: "GET" });
      if (res.ok) {
        this.isOllamaAvailable = true;
        console.log("[GAMETHON AI] Local Ollama service detected!");
      }
    } catch (e) {
      this.isOllamaAvailable = false;
      console.log("[GAMETHON AI] Running in Standalone Offline Simulation mode.");
    }
  }

  // RAG Memory Insertion
  addMemory(category, text, metadata = {}) {
    const memoryItem = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      category,
      text,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.memoryStore.push(memoryItem);
    return memoryItem;
  }

  // RAG Memory Retrieval (Keyword/Cosine Similarity matching simulation)
  queryMemory(query, category = null, limit = 3) {
    const keywords = query.toLowerCase().split(" ");
    let results = this.memoryStore.filter(item => !category || item.category === category);
    
    results = results.map(item => {
      let score = 0;
      keywords.forEach(kw => {
        if (item.text.toLowerCase().includes(kw)) score += 1;
      });
      return { ...item, score };
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  // Universal Prompt Execution (Ollama + Intelligent Fallback Generator)
  async generateResponse(systemPrompt, userPrompt, context = {}) {
    // 1. Fetch relevant RAG memories
    const memories = this.queryMemory(userPrompt, context.category || null);
    const ragContextText = memories.map(m => `- ${m.text}`).join("\n");

    const fullPrompt = `${systemPrompt}\nContext:\n${ragContextText}\nUser: ${userPrompt}`;

    // 2. Try Ollama local endpoint if available
    if (this.isOllamaAvailable) {
      try {
        const response = await fetch(window.GAMETHON.Config.OLLAMA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: window.GAMETHON.Config.DEFAULT_LLM_MODEL,
            prompt: fullPrompt,
            stream: false
          })
        });
        const data = await response.json();
        if (data && data.response) {
          return data.response.trim();
        }
      } catch (err) {
        console.warn("[GAMETHON AI] Ollama call failed, using local rule fallback.", err);
      }
    }

    // 3. High-Quality Offline Generative Rule-Engine Fallback
    return this.generateOfflineFallback(systemPrompt, userPrompt, context);
  }

  // Offline Procedural Generative Engine
  generateOfflineFallback(systemPrompt, userPrompt, context) {
    const p = userPrompt.toLowerCase();

    // Boxing Commentary / Coach
    if (context.game === "boxing") {
      if (p.includes("hook") || p.includes("punch")) {
        return "Coach: 'Great speed on that left hook! Now slip right and deliver a body blow!'";
      }
      if (p.includes("stamina") || p.includes("tired")) {
        return "Coach: 'Keep your guard high and breathe! Don't waste energy throwing wild swings!'";
      }
      return "Commentator: 'An incredible exchange in center ring! Both fighters trading heavy blows!'";
    }

    // Janani's Mansion NPC Dialogue
    if (context.game === "cursed_mansion") {
      if (context.npc === "Janani") {
        return "Queen Janani: 'You think you can escape my realm? Every hallway belongs to my memory...'";
      }
      if (context.npc === "Granny") {
        return "Granny: 'I heard a glass break near the library... I am coming for you!'";
      }
      return "Grandpa: 'Get out of my mansion!'";
    }

    // AI Detective Simulator
    if (context.game === "detective") {
      return "Suspect: 'I was in the east wing until 9 PM. Ask the butler if you don't believe me!'";
    }

    // General Assistant Response
    return `[AI Engine]: Analyzing "${userPrompt}" — Adaptive AI opponent calibrated for optimal challenge level. System performance nominal.`;
  }
}

window.GAMETHON.AIBrain = new GamethonAIBrain();
