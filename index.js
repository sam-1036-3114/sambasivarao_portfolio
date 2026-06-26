/* ==========================================================================
   CYBERNETIC INTERACTIVE PORTFOLIO LOGIC
   Candidate: Gandikota Sambasiva Rao
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Web Audio Synth for Cyber System Feedback ---
    class CyberSynth {
        constructor() {
            this.ctx = null;
            this.bgmInterval = null;
            this.muted = true;
        }

        init() {
            if (this.ctx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }

        toggleMute() {
            this.muted = !this.muted;
            if (!this.muted) {
                this.init();
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                this.startBgm();
            } else {
                this.stopBgm();
            }
            return this.muted;
        }

        playChime(freq, type = 'sine', duration = 0.3, vol = 0.08) {
            if (this.muted || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.error("Audio error:", e);
            }
        }

        playSwell(startFreq, endFreq, duration = 0.8, vol = 0.12) {
            if (this.muted || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
                
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.error("Audio error:", e);
            }
        }

        startBgm() {
            if (this.bgmInterval) clearInterval(this.bgmInterval);
            // futuristic cyber synth sequence (minor pentatonic scale)
            const scale = [220, 246, 277, 329, 369, 440, 493, 554, 659];
            let noteIdx = 0;
            const arpeggio = [0, 3, 5, 2, 4, 6, 3, 5, 7, 5, 4, 1];
            
            this.bgmInterval = setInterval(() => {
                if (this.muted || !this.ctx) return;
                const freq = scale[arpeggio[noteIdx % arpeggio.length]];
                // triangle wave for smooth vintage cyber pad
                this.playChime(freq, 'triangle', 1.2, 0.015);
                noteIdx++;
            }, 750);
        }

        stopBgm() {
            if (this.bgmInterval) {
                clearInterval(this.bgmInterval);
                this.bgmInterval = null;
            }
        }
    }

    const synth = new CyberSynth();

    // Audio button trigger
    const audioBtn = document.getElementById('audio-control');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const isMuted = synth.toggleMute();
            audioBtn.querySelector('.audio-icon').textContent = isMuted ? '🔇' : '🔊';
            audioBtn.classList.toggle('active', !isMuted);
        });
    }


    // --- Automated Cyber Boot Console sequence ---
    const bootProgressBar = document.getElementById('boot-progress-bar');
    const bootProgressVal = document.getElementById('boot-progress-val');
    const bootLog = document.getElementById('boot-log');
    const launchBtn = document.getElementById('summon-btn');

    let bootPercent = 0;
    const bootLogsList = [
        "[OK] Initializing telemetry nodes...",
        "[OK] Routing database schemas (SQL/MongoDB)...",
        "[OK] Synced Azure & GCP cloud servers...",
        "[OK] Bootstrapping Generative AI frameworks...",
        "[OK] Loading local models and C assets...",
        "[OK] Threat-Mitigation Shields Active.",
        "[OK] System compilation success. Profile ready."
    ];
    let logIdx = 0;

    function runBootSequence() {
        const interval = setInterval(() => {
            bootPercent += Math.floor(Math.random() * 3) + 1;
            if (bootPercent >= 100) {
                bootPercent = 100;
                clearInterval(interval);
                // Final logs
                appendBootLog(bootLogsList[bootLogsList.length - 1]);
                
                // Show launch button
                setTimeout(() => {
                    launchBtn.classList.remove('hidden');
                    launchBtn.classList.add('visible');
                    launchBtn.removeAttribute('disabled');
                }, 400);
            }
            
            bootProgressBar.style.width = bootPercent + '%';
            bootProgressVal.textContent = bootPercent + '%';

            // Print log message periodically
            const logStep = Math.floor(100 / (bootLogsList.length - 1));
            if (bootPercent > (logIdx + 1) * logStep && logIdx < bootLogsList.length - 1) {
                appendBootLog(bootLogsList[logIdx]);
                logIdx++;
            }
        }, 80);
    }

    function appendBootLog(text) {
        if (!bootLog) return;
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'log-info';
        bootLog.appendChild(p);
        bootLog.scrollTop = bootLog.scrollHeight;
    }
    
    runBootSequence();


    // --- Global Background Canvas (Interactive Cyber-Grid Network) ---
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    
    let width = bgCanvas.width = window.innerWidth;
    let height = bgCanvas.height = window.innerHeight;
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.22)' : 'rgba(41, 121, 255, 0.18)';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // push particles
            if (mouse.x !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2.0;
                    this.y += Math.sin(angle) * force * 2.0;
                }
            }
        }
        draw() {
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            bgCtx.fillStyle = this.color;
            bgCtx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor((width * height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        bgCtx.clearRect(0, 0, width, height);
        
        // draw grid lines (static matrix grid feel)
        bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
        bgCtx.lineWidth = 0.5;
        bgCtx.beginPath();
        for (let x = 0; x < width; x += 100) {
            bgCtx.moveTo(x, 0);
            bgCtx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 100) {
            bgCtx.moveTo(0, y);
            bgCtx.lineTo(width, y);
        }
        bgCtx.stroke();

        // draw connected lines between nodes
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    bgCtx.beginPath();
                    bgCtx.moveTo(particles[i].x, particles[i].y);
                    bgCtx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (120 - dist) / 120 * 0.08;
                    bgCtx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    bgCtx.lineWidth = 0.6;
                    bgCtx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- Custom Cursor Particle Trail ---
    const cursorCanvas = document.getElementById('cursor-canvas');
    const curCtx = cursorCanvas.getContext('2d');
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    });

    let sparkles = [];
    
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.alpha = 1;
            this.decay = Math.random() * 0.035 + 0.02;
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(41, 121, 255, ';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }
        draw() {
            curCtx.beginPath();
            curCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            curCtx.fillStyle = this.color + this.alpha + ')';
            curCtx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.35) {
            sparkles.push(new Sparkle(e.clientX, e.clientY));
        }
    });

    function animateSparkles() {
        curCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            if (sparkles[i].alpha <= 0) {
                sparkles.splice(i, 1);
            } else {
                sparkles[i].draw();
            }
        }
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();


    // --- Interface Activation Transition ---
    const summonScreen = document.getElementById('summoning-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    
    launchBtn.addEventListener('click', () => {
        synth.init();
        synth.playSwell(180, 580, 1.0, 0.22);
        
        // spark blast
        const rect = launchBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 50; i++) {
            const sp = new Sparkle(cx, cy);
            sp.vx = (Math.random() - 0.5) * 6;
            sp.vy = (Math.random() - 0.5) * 6;
            sp.decay = Math.random() * 0.015 + 0.01;
            sparkles.push(sp);
        }

        setTimeout(() => {
            summonScreen.classList.remove('active');
            summonScreen.classList.add('hidden');
            dashboardScreen.classList.remove('hidden');
            setTimeout(() => {
                dashboardScreen.classList.add('visible');
                initNeuralSkillsGrid();
            }, 50);
        }, 600);
    });


    // --- Navigation Toggles ---
    const navButtons = document.querySelectorAll('.nav-rune-btn');
    const tabPanes = document.querySelectorAll('.tab-content-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = `tab-${btn.getAttribute('data-tab')}`;
            
            synth.playChime(493, 'sine', 0.15, 0.05);
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });

            if (tabId === 'tab-runes-power') {
                initNeuralSkillsGrid();
            } else if (tabId === 'tab-tome-quests') {
                const activeQuestPane = document.querySelector('.quest-pane.active');
                if (activeQuestPane.id === 'quest-azure') {
                    drawFitnessChart();
                } else if (activeQuestPane.id === 'quest-security') {
                    initFirewallGame();
                }
            } else if (tabId === 'tab-vault-artifacts') {
                initSonarSim();
                initSpringFlowDiagram();
                initLexiconGame();
            } else if (tabId === 'tab-scrying-pool') {
                initScryingPool();
                initVideoTimeline();
            }
        });
    });


    // ==========================================================================
    // TAB 1: CORE ENGINE (TECHNICAL SKILLS)
    // ==========================================================================
    const skillNodes = [
        { x: 80, y: 100, r: 25, label: "Languages", title: "Languages / Base Modules", desc: "Core backend and scripting languages.", items: ["Python (Fluent)", "Java (Spring Framework)", "C (Hardware / IoT logic)", "JavaScript (ES6+)", "HTML5 & CSS3"], color: "#cfd8dc" },
        { x: 220, y: 80, r: 25, label: "AI / ML", title: "AI & Machine Learning Engine", desc: "Predictive modeling, natural language, and generative workflows.", items: ["Machine Learning algorithms", "Generative AI systems", "Prompt Engineering", "NLP", "TensorFlow basics", "Scikit-Learn"], color: "#00f2fe" },
        { x: 120, y: 220, r: 25, label: "Web Dev", title: "Interface Construction", desc: "Designing responsive layout architectures and Web APIs.", items: ["HTML5", "CSS3 Grid/Flexbox", "Vanilla JavaScript (ES6+)", "UI/UX Layout principles", "Flask (Basics)"], color: "#2979ff" },
        { x: 260, y: 200, r: 25, label: "Databases", title: "Database Systems", desc: "Managing persistence layers, schemas, and queries.", items: ["SQL & MySQL schemas", "MongoDB (NoSQL documents)", "DBMS Normalization", "Transactions & Indexing"], color: "#00e676" },
        { x: 190, y: 320, r: 25, label: "Cloud & Dev", title: "Cloud Deployment & DevOps", desc: "Global server infrastructure and version control tools.", items: ["Microsoft Azure (AI tools)", "Google Cloud (GCP Foundations)", "Git & GitHub workflows", "VS Code & Jupyter Notebooks"], color: "#ff4081" }
    ];

    let neuralCanvas = document.getElementById('neural-net-canvas');
    let neuralCtx = neuralCanvas.getContext('2d');
    let neuralAnimationId = null;
    let hoveredNode = null;
    let selectedNode = null;

    function initNeuralSkillsGrid() {
        if (!neuralCanvas) return;
        const pRect = neuralCanvas.parentElement.getBoundingClientRect();
        neuralCanvas.width = pRect.width;
        neuralCanvas.height = 340;
        
        skillNodes.forEach(node => {
            node.cx = (node.x / 340) * neuralCanvas.width;
            node.cy = (node.y / 340) * neuralCanvas.height;
        });

        if (!neuralCanvas.dataset.listenersActive) {
            neuralCanvas.addEventListener('mousemove', handleNeuralMouseMove);
            neuralCanvas.addEventListener('click', handleNeuralClick);
            neuralCanvas.dataset.listenersActive = "true";
        }
        
        if (neuralAnimationId) cancelAnimationFrame(neuralAnimationId);
        animateNeuralGrid();
    }

    function handleNeuralMouseMove(e) {
        const rect = neuralCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        hoveredNode = null;
        for (let node of skillNodes) {
            let dx = mx - node.cx;
            let dy = my - node.cy;
            if (Math.sqrt(dx*dx + dy*dy) < node.r + 5) {
                hoveredNode = node;
                break;
            }
        }
        neuralCanvas.style.cursor = hoveredNode ? 'pointer' : 'crosshair';
    }

    function handleNeuralClick(e) {
        if (hoveredNode) {
            selectedNode = hoveredNode;
            synth.playSwell(220, 440, 0.25, 0.1);
            
            const rect = neuralCanvas.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                const sp = new Sparkle(hoveredNode.cx + rect.left, hoveredNode.cy + rect.top);
                sp.vx = (Math.random() - 0.5) * 3;
                sp.vy = (Math.random() - 0.5) * 3;
                sparkles.push(sp);
            }
            updateSkillDetails(selectedNode);
        }
    }

    function updateSkillDetails(node) {
        const title = document.getElementById('selected-skill-title');
        const content = document.getElementById('selected-skill-content');
        
        title.style.color = node.color;
        title.textContent = node.title;
        
        let itemsHtml = `<p class="desc">${node.desc}</p><div class="subskill-grid">`;
        node.items.forEach(item => {
            itemsHtml += `
                <div class="subskill-item" style="border-color: ${node.color}30">
                    <span class="subskill-label">${item}</span>
                    <span class="subskill-dot" style="background-color: ${node.color}; box-shadow: 0 0 6px ${node.color}"></span>
                </div>
            `;
        });
        itemsHtml += `</div>`;
        content.innerHTML = itemsHtml;
    }

    function animateNeuralGrid() {
        neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        
        // draw static connections
        neuralCtx.beginPath();
        for (let i = 0; i < skillNodes.length; i++) {
            for (let j = i + 1; j < skillNodes.length; j++) {
                neuralCtx.moveTo(skillNodes[i].cx, skillNodes[i].cy);
                neuralCtx.lineTo(skillNodes[j].cx, skillNodes[j].cy);
            }
        }
        neuralCtx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
        neuralCtx.lineWidth = 1;
        neuralCtx.stroke();
        
        // draw nodes
        skillNodes.forEach(node => {
            const isHovered = hoveredNode === node;
            const isSelected = selectedNode === node;
            
            const offsetTime = Date.now() * 0.0015 + node.x;
            const px = node.cx + Math.cos(offsetTime) * 2.5;
            const py = node.cy + Math.sin(offsetTime) * 2.5;

            if (isHovered || isSelected) {
                neuralCtx.beginPath();
                neuralCtx.arc(px, py, node.r + 6, 0, Math.PI*2);
                neuralCtx.strokeStyle = node.color;
                neuralCtx.lineWidth = isSelected ? 1.5 : 1;
                neuralCtx.stroke();
            }

            neuralCtx.beginPath();
            neuralCtx.arc(px, py, node.r, 0, Math.PI*2);
            neuralCtx.fillStyle = isHovered ? node.color : 'rgba(8, 10, 20, 0.95)';
            neuralCtx.strokeStyle = node.color;
            neuralCtx.lineWidth = 1.5;
            neuralCtx.shadowColor = node.color;
            neuralCtx.shadowBlur = (isHovered || isSelected) ? 12 : 3;
            neuralCtx.fill();
            neuralCtx.stroke();
            neuralCtx.shadowBlur = 0;
            
            // labels
            neuralCtx.font = "bold 9px 'Outfit', sans-serif";
            neuralCtx.fillStyle = isHovered ? '#04050a' : '#ECEFF1';
            neuralCtx.textAlign = 'center';
            neuralCtx.textBaseline = 'middle';
            neuralCtx.fillText(node.label, px, py);
        });

        neuralAnimationId = requestAnimationFrame(animateNeuralGrid);
    }


    // --- Cauldron / Synthesis core sandbox ---
    const dragRunes = document.querySelectorAll('.draggable-rune');
    const cauldron = document.getElementById('alchemy-cauldron');
    const resultBox = document.getElementById('alchemy-result');
    let loadedRunesInCauldron = [];

    dragRunes.forEach(rune => {
        rune.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', rune.getAttribute('data-rune'));
            rune.style.opacity = '0.5';
        });
        rune.addEventListener('dragend', () => {
            rune.style.opacity = '1';
        });
        rune.addEventListener('click', () => {
            addRuneToCauldron(rune.getAttribute('data-rune'));
        });
    });

    cauldron.addEventListener('dragover', (e) => {
        e.preventDefault();
        cauldron.classList.add('dragover');
    });
    cauldron.addEventListener('dragleave', () => {
        cauldron.classList.remove('dragover');
    });
    cauldron.addEventListener('drop', (e) => {
        e.preventDefault();
        cauldron.classList.remove('dragover');
        const runeVal = e.dataTransfer.getData('text/plain');
        addRuneToCauldron(runeVal);
    });

    function addRuneToCauldron(runeVal) {
        if (!runeVal) return;
        if (loadedRunesInCauldron.length >= 2) {
            loadedRunesInCauldron = [];
        }
        
        loadedRunesInCauldron.push(runeVal);
        synth.playChime(250 + loadedRunesInCauldron.length * 120, 'sine', 0.2, 0.1);

        cauldron.classList.add('brewing');
        createBubblesInCauldron();
        
        cauldron.querySelector('span').textContent = loadedRunesInCauldron.map(r => r.toUpperCase()).join(' + ');

        if (loadedRunesInCauldron.length === 2) {
            setTimeout(() => {
                transmuteRunes(loadedRunesInCauldron[0], loadedRunesInCauldron[1]);
            }, 600);
        }
    }

    function createBubblesInCauldron() {
        const bubbleContainer = cauldron.querySelector('.cauldron-bubbles');
        bubbleContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.bottom = '0';
            div.style.left = Math.random() * 95 + '%';
            div.style.width = Math.random() * 4 + 2 + 'px';
            div.style.height = div.style.width;
            div.style.borderRadius = '50%';
            div.style.backgroundColor = 'var(--color-primary)';
            div.style.opacity = Math.random() * 0.6 + 0.3 + '';
            div.style.animation = `bubble-float ${Math.random() * 0.6 + 0.4}s ease-in forwards`;
            bubbleContainer.appendChild(div);
        }
    }

    function transmuteRunes(r1, r2) {
        const combination = [r1, r2].sort().join('+');
        let title = "System Synthesis Complete";
        let text = "";
        
        synth.playSwell(220, 660, 0.6, 0.15);

        switch (combination) {
            case 'iot+python':
            case 'c+iot':
            case 'iot+ml':
                title = "⚡ SYNTHESIS CORE: AURA STICK TELEMETRY";
                text = "Compiled **Python/C** algorithms with **IoT proximity metrics** to synthesize **Aura Stick**. Created distance calculations on Arduino to emit warnings for visually impaired users.";
                break;
            case 'java+web':
            case 'db+java':
                title = "🌐 SYNTHESIS CORE: JEEVAN KAUSHAL CONTROLLER";
                text = "Merged **Java Spring Boot** and **MongoDB** databases into club portal frameworks. Integrated event registry models and auth dashboards, improving signup ratios by 40%.";
                break;
            case 'db+web':
            case 'python+web':
                title = "📖 SYNTHESIS CORE: RESPONSIVE STUDY WORKSPACE";
                text = "Fused **Web Development** with persistent caches (**LocalStorage API**) to synthesize the **English Learning Platform**. Structured modular vocabulary databases and progress logs.";
                break;
            case 'ml+python':
                title = "🧠 SYNTHESIS CORE: HEALTH ANALYTICS REGRESSION";
                text = "Combined **Python** and **Machine Learning** modules. Leveraged Azure ML Studio to configure regression formulas predicting calorie/activity telemetry metrics.";
                break;
            case 'ml+web':
                title = "🤖 SYNTHESIS CORE: LLM ORCHESTRATION PIPELINES";
                text = "Merged **AI/GenAI models** and **Web APIs**. Choreographed prompt chaining structures and validation scripts integrating OpenAI/ChatGPT API models.";
                break;
            default:
                title = "💻 SYNTHESIS CORE: MODULE COMPILER SUCCESS";
                text = "Verifying modular integration. G. Sambasiva Rao deploys these structured engineering processes to build scalable platforms.";
                break;
        }

        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<strong>${title}</strong><p style="margin-top:4px;">${text}</p>`;
        
        cauldron.classList.remove('brewing');
        cauldron.querySelector('span').textContent = 'DRAG ENGINE NODES HERE TO SYNTHESIZE';
        loadedRunesInCauldron = [];
    }


    // ==========================================================================
    // TAB 2: OPERATIONS DOSSIER (EXPERIENCE WIDGETS)
    // ==========================================================================
    const questButtons = document.querySelectorAll('.quest-tab-btn');
    const questPanes = document.querySelectorAll('.quest-pane');

    questButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const qId = btn.getAttribute('data-quest');
            synth.playChime(369, 'sine', 0.15, 0.05);

            questButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            questPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === qId) {
                    pane.classList.add('active');
                }
            });

            if (qId === 'quest-azure') {
                drawFitnessChart();
            } else if (qId === 'quest-security') {
                initFirewallGame();
            }
        });
    });

    // Operations chart
    const intensitySlider = document.getElementById('intensity-slider');
    const caloriesSlider = document.getElementById('calories-slider');
    const intensityVal = document.getElementById('intensity-val');
    const caloriesVal = document.getElementById('calories-val');
    const fitnessCanvas = document.getElementById('fitness-chart');

    if (intensitySlider) {
        intensitySlider.addEventListener('input', () => {
            intensityVal.textContent = intensitySlider.value;
            drawFitnessChart();
        });
        caloriesSlider.addEventListener('input', () => {
            caloriesVal.textContent = caloriesSlider.value;
            drawFitnessChart();
        });
    }

    function drawFitnessChart() {
        if (!fitnessCanvas) return;
        const ctx = fitnessCanvas.getContext('2d');
        const w = fitnessCanvas.width = fitnessCanvas.parentElement.clientWidth;
        const h = fitnessCanvas.height = 160;

        ctx.clearRect(0,0,w,h);
        
        const minutes = parseInt(intensitySlider.value);
        const kcal = parseInt(caloriesSlider.value);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 30; x < w; x += (w-40)/5) {
            ctx.moveTo(x, 10);
            ctx.lineTo(x, h-20);
        }
        for (let y = 10; y < h-10; y += (h-30)/3) {
            ctx.moveTo(30, y);
            ctx.lineTo(w-10, y);
        }
        ctx.stroke();

        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '8px monospace';
        ctx.fillText('0', 15, h-15);
        ctx.fillText('90m', w/2 - 10, h-5);
        ctx.fillText('180m', w - 30, h-5);
        
        ctx.fillText('100', 10, h - 30);
        ctx.fillText('800', 10, h/2);
        ctx.fillText('1.5k', 10, 20);

        ctx.beginPath();
        ctx.moveTo(30, h-20);
        ctx.strokeStyle = 'var(--color-primary)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'var(--color-primary)';
        ctx.shadowBlur = 6;
        
        for (let i = 0; i <= 100; i++) {
            let xPct = i / 100;
            let currentX = 30 + xPct * (w - 40);
            let scaleVal = (minutes / 180) * 0.85 + (kcal / 1500) * 0.15;
            let curveY = h - 20 - Math.pow(xPct, 1.4) * (h - 40) * scaleVal;
            ctx.lineTo(currentX, curveY);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        let userXPct = minutes / 180;
        let userX = 30 + userXPct * (w - 40);
        let userScale = (minutes / 180) * 0.85 + (kcal / 1500) * 0.15;
        let userY = h - 20 - Math.pow(userXPct, 1.4) * (h - 40) * userScale;

        ctx.fillStyle = 'var(--color-secondary)';
        ctx.beginPath();
        ctx.arc(userX, userY, 5, 0, Math.PI*2);
        ctx.fill();
        
        ctx.font = '9px monospace';
        ctx.fillStyle = 'var(--color-primary)';
        ctx.fillText(`Telemetry score: ${Math.round(userScale * 100)} pts`, userX - 45, userY - 12);
    }


    // Operations Prompt Orchestrator Console
    const castPromptBtn = document.getElementById('cast-prompt-btn');
    const consoleLogs = document.getElementById('console-logs');

    if (castPromptBtn) {
        castPromptBtn.addEventListener('click', () => {
            const role = document.getElementById('prompt-role').value;
            const cot = document.getElementById('prompt-cot').checked;
            
            synth.playSwell(250, 550, 0.35, 0.12);

            consoleLogs.innerHTML = '';
            appendLog(">> INITIALIZING LLM ORCHESTRATION SHIELD...", "terminal-prompt");
            
            setTimeout(() => {
                appendLog(`>> Injected System instruction: [Constraint: ${role.toUpperCase()}]`, "terminal-msg");
            }, 300);

            setTimeout(() => {
                appendLog(">> Parsing input telemetry database schema...", "terminal-msg");
            }, 600);

            if (cot) {
                setTimeout(() => {
                    appendLog(">> EXECUTING CHAIN-OF-THOUGHT AGENTS...", "terminal-prompt");
                }, 900);
                setTimeout(() => {
                    appendLog("   [CotAgent_1] Read FrameVerse media metrics.", "terminal-secondary");
                    appendLog("   [CotAgent_2] Check schema structure bounds.", "terminal-secondary");
                    appendLog("   [CotAgent_3] Output formatted JSON document.", "terminal-secondary");
                }, 1300);
            }

            setTimeout(() => {
                appendLog(">> Validating JSON schema structure...", "terminal-prompt");
            }, 1800);

            setTimeout(() => {
                appendLog(">> [Schema Shield] Code 200: Outputs successfully verified.", "terminal-msg");
                appendLog(">> Telemetry pipeline successfully established.", "terminal-prompt");
            }, 2300);
        });
    }

    function appendLog(text, className) {
        if (!consoleLogs) return;
        const p = document.createElement('p');
        p.textContent = text;
        p.className = className;
        consoleLogs.appendChild(p);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    }


    // Operations Cyber Security Firewall Game
    const firewallCanvas = document.getElementById('firewall-canvas');
    const startFirewallBtn = document.getElementById('start-firewall-btn');
    const firewallOverlay = document.getElementById('firewall-overlay');
    const packetsScore = document.getElementById('packets-score');
    const healthScore = document.getElementById('health-score');

    let fwCtx = null;
    let fwGameActive = false;
    let fwThreats = [];
    let fwShield = { x: 0, w: 60, h: 6 };
    let fwDeflected = 0;
    let fwHealth = 100;
    let fwMouseX = 0;
    let fwAnimationId = null;

    if (startFirewallBtn) {
        startFirewallBtn.addEventListener('click', () => {
            firewallOverlay.style.opacity = '0';
            setTimeout(() => {
                firewallOverlay.style.display = 'none';
                fwGameActive = true;
                fwDeflected = 0;
                fwHealth = 100;
                packetsScore.textContent = '0';
                healthScore.textContent = '100%';
                fwThreats = [];
                runFirewallGame();
            }, 300);
        });
    }

    function initFirewallGame() {
        if (!firewallCanvas) return;
        fwCtx = firewallCanvas.getContext('2d');
        firewallCanvas.width = firewallCanvas.parentElement.clientWidth;
        firewallCanvas.height = 190;
        
        fwShield.x = firewallCanvas.width / 2 - fwShield.w / 2;
        
        firewallCanvas.addEventListener('mousemove', (e) => {
            const rect = firewallCanvas.getBoundingClientRect();
            fwMouseX = e.clientX - rect.left;
        });

        fwCtx.clearRect(0,0,firewallCanvas.width,firewallCanvas.height);
        fwCtx.fillStyle = 'rgba(0,242,254,0.05)';
        fwCtx.fillRect(0,0,firewallCanvas.width,firewallCanvas.height);
        fwCtx.font = "10px 'Share Tech Mono', monospace";
        fwCtx.fillStyle = "var(--color-primary)";
        fwCtx.textAlign = 'center';
        fwCtx.fillText("FIREWALL SHIELD STATUS: READY", firewallCanvas.width/2, firewallCanvas.height/2);
    }

    function runFirewallGame() {
        if (!fwGameActive || !firewallCanvas) return;

        fwCtx.clearRect(0,0,firewallCanvas.width,firewallCanvas.height);

        // draw background grid
        fwCtx.strokeStyle = 'rgba(255,255,255,0.01)';
        fwCtx.lineWidth = 0.5;
        fwCtx.beginPath();
        for (let x = 0; x < firewallCanvas.width; x += 30) {
            fwCtx.moveTo(x, 0); fwCtx.lineTo(x, firewallCanvas.height);
        }
        for (let y = 0; y < firewallCanvas.height; y += 30) {
            fwCtx.moveTo(0, y); fwCtx.lineTo(firewallCanvas.width, y);
        }
        fwCtx.stroke();

        fwShield.x += (fwMouseX - fwShield.w/2 - fwShield.x) * 0.25;
        if (fwShield.x < 0) fwShield.x = 0;
        if (fwShield.x > firewallCanvas.width - fwShield.w) fwShield.x = firewallCanvas.width - fwShield.w;

        fwCtx.fillStyle = 'var(--color-primary)';
        fwCtx.shadowColor = 'var(--color-primary)';
        fwCtx.shadowBlur = 8;
        fwCtx.fillRect(fwShield.x, firewallCanvas.height - 25, fwShield.w, fwShield.h);
        fwCtx.shadowBlur = 0;

        // spawn threat packets
        if (Math.random() < 0.05) {
            fwThreats.push({
                x: Math.random() * (firewallCanvas.width - 15) + 7,
                y: 0,
                r: Math.random() * 3 + 3,
                vy: Math.random() * 2 + 1.8,
                ip: `192.168.1.${Math.floor(Math.random() * 250)}`
            });
        }

        // move threat packets
        for (let i = fwThreats.length - 1; i >= 0; i--) {
            let threat = fwThreats[i];
            threat.y += threat.vy;

            // Collision check
            const shieldY = firewallCanvas.height - 25;
            if (threat.y + threat.r >= shieldY && 
                threat.y - threat.r <= shieldY + fwShield.h &&
                threat.x >= fwShield.x && 
                threat.x <= fwShield.x + fwShield.w) {
                
                fwDeflected++;
                packetsScore.textContent = fwDeflected;
                synth.playChime(650, 'sine', 0.1, 0.06);

                const rect = firewallCanvas.getBoundingClientRect();
                for (let k = 0; k < 6; k++) {
                    const sp = new Sparkle(threat.x + rect.left, shieldY + rect.top);
                    sp.vx = (Math.random() - 0.5) * 3;
                    sp.vy = -Math.random() * 2.5;
                    sparkles.push(sp);
                }

                fwThreats.splice(i, 1);
                continue;
            }

            // fail check
            if (threat.y > firewallCanvas.height) {
                fwHealth -= 20;
                healthScore.textContent = fwHealth + '%';
                synth.playChime(180, 'triangle', 0.2, 0.12);
                
                if (fwHealth <= 0) {
                    fwGameActive = false;
                    firewallOverlay.style.display = 'flex';
                    firewallOverlay.style.opacity = '1';
                    firewallOverlay.querySelector('button').textContent = 'REBOOT SYSTEM (TRY AGAIN)';
                    cancelAnimationFrame(fwAnimationId);
                    return;
                }
                fwThreats.splice(i, 1);
                continue;
            }

            // draw threats
            fwCtx.beginPath();
            fwCtx.arc(threat.x, threat.y, threat.r, 0, Math.PI*2);
            fwCtx.fillStyle = 'var(--color-danger)';
            fwCtx.fill();

            // print threat ip
            fwCtx.font = "6px monospace";
            fwCtx.fillStyle = "rgba(255,23,68,0.5)";
            fwCtx.fillText(threat.ip, threat.x + 8, threat.y + 2);
        }

        fwAnimationId = requestAnimationFrame(runFirewallGame);
    }


    // ==========================================================================
    // TAB 3: PROJECT CONSTRUCTS (PROJECTS WIDGETS)
    // ==========================================================================
    const sonarObstacle = document.getElementById('sonar-obstacle');
    const sonarStick = document.getElementById('sonar-stick');
    const sonarWaveField = document.getElementById('sonar-wave-field');
    const sonarDistVal = document.getElementById('sonar-dist-val');
    const sonarFreqVal = document.getElementById('sonar-freq-val');

    let sonarDragging = false;

    function initSonarSim() {
        if (!sonarObstacle) return;
        
        sonarObstacle.addEventListener('mousedown', () => {
            sonarDragging = true;
        });

        window.addEventListener('mouseup', () => {
            sonarDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!sonarDragging) return;
            const container = sonarObstacle.parentElement;
            const rect = container.getBoundingClientRect();
            
            let ox = e.clientX - rect.left;
            const stickX = 40;
            const minX = 60;
            const maxX = rect.width - 25;
            
            if (ox < minX) ox = minX;
            if (ox > maxX) ox = maxX;
            
            sonarObstacle.style.left = ox + 'px';
            
            const range = maxX - minX;
            const distPx = ox - minX;
            const distCm = Math.round((distPx / range) * 90 + 10);
            
            sonarDistVal.textContent = distCm + 'cm';
            updateSonarEcho(distCm, distPx);
        });

        updateSonarEcho(80, 200);
    }

    function updateSonarEcho(distCm, distPx) {
        sonarWaveField.innerHTML = '';
        
        if (distCm < 30) {
            sonarFreqVal.textContent = 'High alert frequency (4.0 kHz)';
            sonarFreqVal.style.color = 'var(--color-danger)';
            
            for (let i = 0; i < 3; i++) {
                const ring = document.createElement('div');
                ring.className = 'sonar-pulse-ring';
                ring.style.animationDuration = '0.5s';
                ring.style.animationDelay = (i * 0.15) + 's';
                ring.style.borderColor = 'var(--color-danger)';
                sonarWaveField.appendChild(ring);
            }
            triggerSonarBeep(140, 4000);
        } else if (distCm < 60) {
            sonarFreqVal.textContent = 'Normal pulse frequency (2.0 kHz)';
            sonarFreqVal.style.color = 'var(--color-primary)';

            for (let i = 0; i < 2; i++) {
                const ring = document.createElement('div');
                ring.className = 'sonar-pulse-ring';
                ring.style.animationDuration = '1.0s';
                ring.style.animationDelay = (i * 0.3) + 's';
                ring.style.borderColor = 'var(--color-primary)';
                sonarWaveField.appendChild(ring);
            }
            triggerSonarBeep(380, 2000);
        } else {
            sonarFreqVal.textContent = 'Standby';
            sonarFreqVal.style.color = 'var(--text-secondary)';
            
            const ring = document.createElement('div');
            ring.className = 'sonar-pulse-ring';
            ring.style.animationDuration = '2.0s';
            sonarWaveField.appendChild(ring);
        }
    }

    let lastBeepTime = 0;
    function triggerSonarBeep(intervalMs, freq) {
        const now = Date.now();
        if (now - lastBeepTime > intervalMs) {
            synth.playChime(freq, 'sine', 0.04, 0.03);
            lastBeepTime = now;
        }
    }


    // Spring boot request router
    const springCanvas = document.getElementById('spring-flow-canvas');
    let springCtx = null;
    let springFlowParticles = [];

    function initSpringFlowDiagram() {
        if (!springCanvas) return;
        springCtx = springCanvas.getContext('2d');
        springCanvas.width = springCanvas.parentElement.clientWidth;
        springCanvas.height = 100;

        const flowButtons = document.querySelectorAll('.flow-btn');
        flowButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                triggerFlowPacket(action);
            });
        });

        animateSpringFlow();
    }

    const flowNodes = {
        client: { x: 30, y: 50, label: "Client" },
        spring: { x: 160, y: 50, label: "Spring Controller" },
        mongo: { x: 290, y: 50, label: "MongoDB" }
    };

    function triggerFlowPacket(action) {
        let textLabel = "POST /api/register";
        let color = 'var(--color-primary)';
        synth.playChime(392, 'triangle', 0.12, 0.08);

        if (action === 'login') {
            textLabel = "POST /api/auth";
            color = 'var(--color-secondary)';
        } else if (action === 'create-event') {
            textLabel = "POST /api/event";
            color = 'var(--color-accent)';
        }

        springFlowParticles.push({
            x: flowNodes.client.x,
            y: flowNodes.client.y,
            tx: flowNodes.spring.x,
            ty: flowNodes.spring.y,
            progress: 0,
            color: color,
            label: textLabel,
            phase: 1
        });
    }

    function animateSpringFlow() {
        if (!springCanvas) return;
        springCtx.clearRect(0,0,springCanvas.width,springCanvas.height);

        const w = springCanvas.width;
        flowNodes.client.x = 40;
        flowNodes.spring.x = w / 2;
        flowNodes.mongo.x = w - 40;

        // pipes
        springCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        springCtx.lineWidth = 3;
        springCtx.beginPath();
        springCtx.moveTo(flowNodes.client.x, flowNodes.client.y);
        springCtx.lineTo(flowNodes.mongo.x, flowNodes.mongo.y);
        springCtx.stroke();

        // draw nodes
        Object.keys(flowNodes).forEach(key => {
            const node = flowNodes[key];
            springCtx.beginPath();
            springCtx.arc(node.x, node.y, 16, 0, Math.PI*2);
            springCtx.fillStyle = '#04050a';
            springCtx.strokeStyle = 'var(--color-primary)';
            springCtx.lineWidth = 1.5;
            springCtx.fill();
            springCtx.stroke();
            
            springCtx.font = "bold 7px monospace";
            springCtx.fillStyle = "white";
            springCtx.textAlign = 'center';
            springCtx.fillText(node.label, node.x, node.y + 3);
        });

        // route packet
        for (let i = springFlowParticles.length - 1; i >= 0; i--) {
            let p = springFlowParticles[i];
            p.progress += 0.03;

            const px = p.x + (p.tx - p.x) * p.progress;
            const py = p.y + (p.ty - p.y) * p.progress;

            springCtx.beginPath();
            springCtx.arc(px, py, 4, 0, Math.PI*2);
            springCtx.fillStyle = p.color;
            springCtx.shadowColor = p.color;
            springCtx.shadowBlur = 6;
            springCtx.fill();
            springCtx.shadowBlur = 0;

            springCtx.font = "6.5px monospace";
            springCtx.fillStyle = "var(--text-secondary)";
            springCtx.fillText(p.label, px, py - 9);

            if (p.progress >= 1) {
                if (p.phase === 1) {
                    synth.playChime(554, 'sine', 0.1, 0.04);
                    springFlowParticles[i] = {
                        x: flowNodes.spring.x,
                        y: flowNodes.spring.y,
                        tx: flowNodes.mongo.x,
                        ty: flowNodes.mongo.y,
                        progress: 0,
                        color: p.color,
                        label: "db.insert() queries",
                        phase: 2
                    };
                } else if (p.phase === 2) {
                    synth.playChime(784, 'sine', 0.12, 0.06);
                    springFlowParticles[i] = {
                        x: flowNodes.mongo.x,
                        y: flowNodes.mongo.y,
                        tx: flowNodes.client.x,
                        ty: flowNodes.client.y,
                        progress: 0,
                        color: 'var(--color-primary)',
                        label: "Response: 201 Created",
                        phase: 3
                    };
                } else {
                    springFlowParticles.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(animateSpringFlow);
    }


    // Lexicon game logic
    function initLexiconGame() {
        const dragWords = document.querySelectorAll('.draggable-word');
        const slots = document.querySelectorAll('.sentence-slot');
        const successMsg = document.getElementById('lexicon-success-msg');

        dragWords.forEach(word => {
            word.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', word.getAttribute('data-word'));
                word.style.opacity = '0.5';
            });
            word.addEventListener('dragend', () => {
                word.style.opacity = '1';
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('dragover');
            });
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('dragover');
            });
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('dragover');
                const word = e.dataTransfer.getData('text/plain');
                
                const expected = slot.getAttribute('data-expected');
                if (word === expected) {
                    slot.textContent = word;
                    slot.style.borderBottomColor = 'var(--color-primary)';
                    slot.style.color = 'var(--color-primary)';
                    synth.playChime(587, 'sine', 0.15, 0.08);
                    checkLexiconSolved();
                } else {
                    synth.playChime(180, 'sawtooth', 0.25, 0.08);
                }
            });
        });

        function checkLexiconSolved() {
            let allSolved = true;
            slots.forEach(slot => {
                if (slot.textContent.includes('_______')) {
                    allSolved = false;
                }
            });

            if (allSolved) {
                successMsg.classList.remove('hidden');
                synth.playSwell(260, 880, 0.8, 0.18);
            }
        }
    }


    // ==========================================================================
    // TAB 4: KNOWLEDGE MATRIX (EDUCATION FLOORS)
    // ==========================================================================
    const towerFloors = document.querySelectorAll('.tower-floor');
    const floorPanes = document.querySelectorAll('.floor-detail-pane');

    towerFloors.forEach(floor => {
        floor.addEventListener('click', () => {
            const floorNum = floor.getAttribute('data-floor');
            synth.playChime(277, 'sine', 0.15, 0.06);

            towerFloors.forEach(f => f.classList.remove('active'));
            floor.classList.add('active');

            floorPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `floor-${floorNum}-pane`) {
                    pane.classList.add('active');
                }
            });
        });
    });


    // ==========================================================================
    // TAB 5: VISUAL ANALYTICS MATRIX (MEDIA & TIMELINES)
    // ==========================================================================
    
    // Scrying Pool Canvas: Holographic ripple scan
    let scryingCanvas = document.getElementById('scrying-pool-canvas');
    let scryingCtx = null;
    let ripples = [];
    let poolProjText = document.getElementById('pool-projection-label');

    const scryingProjections = [
        "FrameVerse Media Guild &bull; Managing 5 members",
        "CapCut Video Timelines &bull; College Event Branding",
        "Make A Difference Guild &bull; Tutoring science and literacy modules",
        "Canva Content Graphics &bull; Social media growth"
    ];
    let activeProjIdx = 0;

    // Load actual generated tech art assets
    const scryingImagePaths = [
        'assets/professional_tech_art_two.png',
        'assets/professional_tech_avatar.png',
        'assets/IMG_20260612_071135979_HDR_PORTRAIT_art.png',
        'assets/IMG_20260504_214258632_HDR_PORTRAIT_art.png'
    ];
    const scryingImages = [];
    let imagesLoaded = 0;
    scryingImagePaths.forEach((path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            imagesLoaded++;
        };
        img.onerror = () => {
            console.log("Error loading scrying art:", path);
        };
        scryingImages.push(img);
    });

    // Holographic scanner line variables
    let scanLineY = 0;
    let scanDirection = 1;

    function initScryingPool() {
        if (!scryingCanvas) return;
        scryingCtx = scryingCanvas.getContext('2d');
        scryingCanvas.width = 250;
        scryingCanvas.height = 250;

        scryingCanvas.addEventListener('mousemove', handlePoolMouseMove);
        scryingCanvas.addEventListener('click', handlePoolClick);

        animateScryingPool();
    }

    function handlePoolMouseMove(e) {
        if (Math.random() > 0.82) {
            const rect = scryingCanvas.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            ripples.push({
                x: px,
                y: py,
                r: 1,
                alpha: 0.8
            });
        }
    }

    function handlePoolClick(e) {
        const rect = scryingCanvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        
        synth.playSwell(220, 480, 0.4, 0.08);
        
        ripples.push({
            x: px,
            y: py,
            r: 4,
            alpha: 1.0,
            forceMultiplier: 2.2
        });

        activeProjIdx = (activeProjIdx + 1) % scryingProjections.length;
        poolProjText.innerHTML = scryingProjections[activeProjIdx];
    }

    function animateScryingPool() {
        if (!scryingCanvas) return;
        
        // draw background image
        if (imagesLoaded > 0 && scryingImages[activeProjIdx] && scryingImages[activeProjIdx].complete) {
            scryingCtx.drawImage(scryingImages[activeProjIdx], 0, 0, 250, 250);
            
            // holographic overlay tint
            scryingCtx.fillStyle = 'rgba(0, 242, 254, 0.08)';
            scryingCtx.fillRect(0, 0, 250, 250);
            
            // dark contrast overlay
            scryingCtx.fillStyle = 'rgba(5, 5, 12, 0.42)';
            scryingCtx.fillRect(0, 0, 250, 250);
        } else {
            scryingCtx.fillStyle = '#010206';
            scryingCtx.fillRect(0, 0, 250, 250);
        }

        // draw coordinate crosshair overlay
        scryingCtx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
        scryingCtx.lineWidth = 0.5;
        scryingCtx.beginPath();
        // center lines
        scryingCtx.moveTo(125, 0); scryingCtx.lineTo(125, 250);
        scryingCtx.moveTo(0, 125); scryingCtx.lineTo(250, 125);
        // concentric dials
        scryingCtx.stroke();
        scryingCtx.beginPath();
        scryingCtx.arc(125, 125, 80, 0, Math.PI*2);
        scryingCtx.arc(125, 125, 40, 0, Math.PI*2);
        scryingCtx.stroke();

        // draw scanning laser line
        scanLineY += scanDirection * 1.2;
        if (scanLineY > 250 || scanLineY < 0) {
            scanDirection *= -1;
        }
        scryingCtx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
        scryingCtx.lineWidth = 1.5;
        scryingCtx.shadowColor = 'var(--color-primary)';
        scryingCtx.shadowBlur = 6;
        scryingCtx.beginPath();
        scryingCtx.moveTo(0, scanLineY);
        scryingCtx.lineTo(250, scanLineY);
        scryingCtx.stroke();
        scryingCtx.shadowBlur = 0; // reset

        // ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            let r = ripples[i];
            r.r += (r.forceMultiplier || 1.0) * 1.5;
            r.alpha -= 0.015;

            if (r.alpha <= 0) {
                ripples.splice(i, 1);
                continue;
            }

            scryingCtx.strokeStyle = `rgba(0, 242, 254, ${r.alpha})`;
            scryingCtx.lineWidth = 1;
            scryingCtx.beginPath();
            scryingCtx.arc(r.x, r.y, r.r, 0, Math.PI*2);
            scryingCtx.stroke();
        }

        requestAnimationFrame(animateScryingPool);
    }


    // Content editor scrubbing widget
    const scrubSlider = document.getElementById('video-scrub-slider');
    const scrubFrame = document.getElementById('scrub-frame-val');
    const scrubEditor = document.getElementById('scrub-editor-val');
    const timelineCanvas = document.getElementById('timeline-canvas');
    let timelineCtx = null;

    if (scrubSlider) {
        scrubSlider.addEventListener('input', () => {
            const val = scrubSlider.value;
            scrubFrame.textContent = `${val} / 100`;
            
            if (val % 6 === 0) {
                synth.playChime(120 + val * 5, 'sine', 0.05, 0.02);
            }

            drawTimelineFrame(parseInt(val));
        });
    }

    function initVideoTimeline() {
        if (!timelineCanvas) return;
        timelineCtx = timelineCanvas.getContext('2d');
        timelineCanvas.width = timelineCanvas.parentElement.clientWidth;
        timelineCanvas.height = 100;
        drawTimelineFrame(0);
    }

    function drawTimelineFrame(frameNum) {
        if (!timelineCanvas) return;
        const w = timelineCanvas.width;
        const h = timelineCanvas.height;
        timelineCtx.clearRect(0,0,w,h);

        // draw film borders
        timelineCtx.strokeStyle = '#263238';
        timelineCtx.lineWidth = 1;
        timelineCtx.beginPath();
        timelineCtx.moveTo(0, 12);
        timelineCtx.lineTo(w, 12);
        timelineCtx.moveTo(0, h-12);
        timelineCtx.lineTo(w, h-12);
        timelineCtx.stroke();

        // draw sprocket holes
        timelineCtx.fillStyle = '#0d1117';
        for (let x = 5; x < w; x += 15) {
            timelineCtx.fillRect(x, 3, 5, 5);
            timelineCtx.fillRect(x, h-8, 5, 5);
        }

        // Draw rotated vector spool based on frame scrub
        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = 26;
        
        timelineCtx.save();
        timelineCtx.translate(cx, cy);
        const angle = (frameNum / 100) * Math.PI * 4;
        timelineCtx.rotate(angle);

        // spool ring
        timelineCtx.strokeStyle = 'var(--color-primary)';
        timelineCtx.shadowColor = 'var(--color-primary)';
        timelineCtx.shadowBlur = 4;
        timelineCtx.lineWidth = 2;
        timelineCtx.beginPath();
        timelineCtx.arc(0, 0, maxRadius, 0, Math.PI*2);
        timelineCtx.stroke();
        timelineCtx.shadowBlur = 0;

        // inner spool blades
        timelineCtx.strokeStyle = 'var(--color-secondary)';
        timelineCtx.lineWidth = 1.2;
        timelineCtx.beginPath();
        for (let i = 0; i < 4; i++) {
            let spAngle = (i * Math.PI * 2) / 4;
            timelineCtx.moveTo(0,0);
            timelineCtx.lineTo(Math.cos(spAngle) * maxRadius, Math.sin(spAngle) * maxRadius);
        }
        timelineCtx.stroke();
        
        timelineCtx.restore();

        // Audio waveform lines
        timelineCtx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        timelineCtx.lineWidth = 1;
        timelineCtx.beginPath();
        timelineCtx.moveTo(10, h - 25);
        for (let x = 10; x < w - 10; x++) {
            let y = h - 25 + Math.sin(x * 0.12 + frameNum * 0.22) * 6 * Math.cos(x * 0.015);
            timelineCtx.lineTo(x, y);
        }
        timelineCtx.stroke();
    }
});
