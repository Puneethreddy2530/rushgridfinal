# RushGrid : 🔗 https://rushgridfinal.vercel.app/
RushGrid- an adaptive multi-agent urban traffic routing simulator powered by A* , Bi-A* and Dynamic A* algorithms with real-time predictive re-routing, guided by our Ai co-pilot RushBot, built to help city planners , everyday travelers and millennials to save their time and work.
🏎️ RushGrid: Adaptive Multi-Agent Dynamic Routing Visualizer
Powered by the PathFuel Engine v1.0 and guided by our AI co-pilot RushBot,
RushGrid demonstrates how modern pathfinding algorithms, real-time adaptation, and smart UI/UX design can tackle the chaos of urban congestion — one route at a time.

🔗 [Live Demo](https://rushgrid-app.vercel.app)

🧠 **Concept Overview**
RushGrid is an interactive traffic simulation web app that visualizes multiple autonomous agents (vehicles) navigating a live, adaptive city grid.
Each agent reacts dynamically to congestion, blockages, and emergencies using intelligent routing algorithms — proving how adaptive heuristics outperform static algorithms like Dijkstra in real time.

At its core, RushGrid is a perfect fusion of:
💡 Algorithmic intelligence — A*, Bi-A*, Dynamic A*, and Dijkstra for comparison
⚙️ Adaptive system design — self-learning edge weights and predictive rerouting
🎨 Immersive Red Bull-inspired UI — neon-lit visuals, dark energy aesthetic
🤖 Conversational AI (RushBot) — a built-in assistant that narrates, explains, and executes voice/text commands
🧩 Core Algorithmic Architecture

🧭 PathFuel Engine v1.0
A* – Primary pathfinding algorithm for all agents
Bi-A* – Optimized bidirectional search for long-range routing
Dynamic A* – Instant rerouting when road weights or traffic conditions change
CH + Landmarks – Conceptual preprocessing for microsecond-level queries

Agent Personalities:
🟥 Aggressive – prioritizes time over safety
🟨 Balanced – mixes both
🟩 Cautious – avoids volatile routes

Dijkstra Module: baseline comparison for speed, cost, and explored nodes

🌐 **System Features**
🔥 1. Predictive Traffic Heatmap
Animated red→yellow→green overlay forecasts congestion spread using weighted decay.
Dynamically updates as vehicles move.

⚡ 2. Rerouting Efficiency Score + Leaderboard
Measures each agent’s reaction time and adaptation quality.
Ranks agents live on a performance leaderboard.

🌍 3. Energy / Emission Estimator
Calculates estimated CO₂ / fuel usage = distance × average speed.
Displays “Red Bull Efficiency Bar” showing overall network optimization.

🧩 4. Self-Learning Weights
Frequently congested roads automatically gain higher base cost.
Mimics lightweight reinforcement learning.

🤖 5. AI-Tuned Algorithm Selector
PathFuel Engine dynamically switches between A*, Bi-A*, Dynamic A* depending on network volatility.

🚨 6. Emergency Response Mode
Flags one agent as an emergency vehicle.
Other agents detect this and cooperatively clear the route in real time.

🗣️ RushBot — Your In-Simulation Co-Pilot
RushBot acts as a voice + text assistant that brings the simulation to life.

**Modes:**
🎙 **Narration Mode — Describes live rerouting and congestion events.
“Agent 3 rerouting using Bi-A* due to congestion at D6.”

💬 *Explain Mode — Explains algorithms in simple language.
“Dynamic A* updates paths instantly when edge weights change.”

⚙️ *Command Mode — Executes natural-language commands:
“Add traffic between A2–A4” | “Spawn emergency vehicle.”*

📈 **Analysis Mode — Answers queries like:
“Which road is busiest?” | “Show predicted congestion.”*

🧠 **Scenario Mode — Trigger pre-set conditions:
“Run time-lapse ×5” | “Activate Emergency Mode.”*

🎯 **RushBot’s closing line:
“Simulation complete. All agents optimized. RushGrid engine powering down... ⚡”*

🎨 **UI / UX Design**
Theme: Red Bull-inspired — energetic, high-contrast, futuristic.

**Element	Color**
Background	#0d0d0d
Neon Red	#d50032
Electric Blue	#3b4cca
Metallic Silver	#cccccc

**Fonts**: Orbitron (headings) | Inter (body)

**Main Screens**
Landing Page – Lottie.js particle intro + cinematic scroll reveal
Simulation Grid – Interactive 20×20 matrix (Canvas/SVG)
Click to block or unblock roads
Drag to spawn agents
Animated red dots rerouting live
Analytics Panel – Real-time charts (Recharts / Chart.js) showing average speed, CO₂, and reroute frequency

**Frameworks & Tools**
Vite + React + TailwindCSS
Framer Motion for transitions
LottieFiles for intro animation
Recharts / Chart.js for analytics
Leaflet / OpenStreetMap (optional map integration)

**🧰 Tech Stack & Toolchain**
Category	Tools Used
Frontend	React, Vite, TailwindCSS
AI / Copilot	GitHub Copilot, Vercel AI SDK
Animation	Framer Motion, LottieFiles
Analytics	Recharts, Chart.js
Design	Figma, Khroma, Icons8, Haikei
Voice / Media	Runway, Pika Labs, ElevenLabs
Hosting / Deployment	Vercel
Data (Optional)	OpenTraffic, CityFlow




🧮 **How It Works**
The PathFuel Engine computes optimal routes using A* variants.
The UI grid visualizes nodes ↔ edges in real time.
When a user or RushBot adds congestion, Dynamic A* recomputes paths.
Efficiency metrics update automatically in the Analytics Panel.
The Predictive Heatmap forecasts future congestion using time-weighted averages.
RushBot provides live commentary, explanation, and control.


🌍**Future Enhancements**
🔗 Live GPS / IoT sensor data integration
🚁 3D drone traffic simulation
🧠 Reinforcement-learning agents for fully autonomous adaptation
🌐 Multi-city routing dataset support

🏁**Conclusion**

RushGrid isn’t just a visual demo — it’s a story of adaptive intelligence.
By combining pathfinding algorithms, AI-driven UX, and a beautiful, kinetic interface, it shows how computation and design can merge to create a living, thinking simulation.

⚡ Simulation complete. All agents optimized.

## 👥 Authors
[@Lalitya31](https://github.com/Lalitya31)  
[@Puneethreddy2530](https://github.com/Puneethreddy2530)

