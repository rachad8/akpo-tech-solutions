

class AkpoChatbot {
    constructor() {
        this.container = null;
        this.messages = [];
        this.isOpen = false;
        this.conversationHistory = [];
        this.userName = null;
        this.currentContext = null;

        this.knowledgeBase = {

            'qui': {
                keywords: ['qui', 'présente', 'entreprise', 'société', 'vous êtes', 'qui êtes', 'créateur', 'fondateur'],
                responses: [
                    "Je suis l'assistant virtuel d'AKPO TECH SOLUTIONS. Nous sommes une entreprise de maintenance informatique basée à Calavi Zopah, Bénin.",
                    "AKPO TECH SOLUTIONS est une entreprise spécialisée dans la maintenance informatique, créée et dirigée par Ayéto Héloïce Diétrich AKPO, technicien maintenancier."
                ]
            },
            'mission': {
                keywords: ['mission', 'objectif', 'but', 'valeur', 'engagement', 'promesse'],
                responses: [
                    "Notre mission est de fournir des services informatiques de qualité, rapides et transparents, pour que nos clients puissent travailler sereinement.",
                    "Nous nous engageons à offrir des interventions simples, efficaces et professionnelles, avec une écoute attentive de nos clients."
                ]
            },

            'services': {
                keywords: ['service', 'prestation', 'proposez', 'offrez', 'intervention', 'domaine', 'spécialité'],
                responses: [
                    "Nous proposons : installation Windows, dépannage PC, suppression de virus, installation WiFi / réseau, maintenance préventive, récupération de données, installation d'imprimantes, et plus encore.",
                    "Nos services sont adaptés aussi bien aux particuliers qu'aux entreprises. Consultez notre page Services pour plus de détails."
                ]
            },
            'installation': {
                keywords: ['installation', 'windows', 'logiciel', 'programme', 'pilote', 'driver', 'configuration'],
                responses: [
                    "Nous installons Windows 10/11 avec tous les pilotes et logiciels essentiels. Nous assurons également l'activation avec des licences originales.",
                    "L'installation est effectuée proprement et configurée selon vos besoins. Nous intervenons sur site pour une installation complète."
                ]
            },
            'depannage': {
                keywords: ['dépannage', 'réparation', 'panne', 'casse', 'bug', 'erreur', 'crash', 'plante', 'redémarrage'],
                responses: [
                    "Nous diagnostiquons et réparons tous types de pannes matérielles et logicielles. Diagnostic gratuit avant toute intervention.",
                    "Que ce soit un problème de démarrage, un écran bleu, ou une panne matérielle, nous trouvons une solution rapide."
                ]
            },
            'virus': {
                keywords: ['virus', 'malware', 'antivirus', 'infection', 'piratage', 'hameçonnage', 'phishing', 'ransomware'],
                responses: [
                    "Nous éliminons tous types de virus, malwares et logiciels malveillants. Nous installons également des solutions antivirus performantes.",
                    "Notre service de suppression de virus inclut un nettoyage complet, l'installation d'un antivirus et des conseils de prévention."
                ]
            },
            'wifi': {
                keywords: ['wifi', 'réseau', 'connexion', 'internet', 'routeur', 'box', 'mobile', 'données', '4g', '5g'],
                responses: [
                    "Nous installons et optimisons les réseaux WiFi pour particuliers et entreprises. Nous assurons une connexion stable et sécurisée.",
                    "Nous configurons également les réseaux professionnels avec pare-feu, contrôle d'accès et gestion de bande passante."
                ]
            },
            'recuperation': {
                keywords: ['récupération', 'donnée', 'fichier', 'perdu', 'supprimé', 'effacé', 'disque', 'dd', 'sauvegarde', 'backup'],
                responses: [
                    "Nous récupérons vos données perdues ou supprimées accidentellement. Nous intervenons sur disques durs endommagés ou formatés.",
                    "Le taux de réussite dépend de l'état du support. Nous effectuons un diagnostic gratuit avant toute récupération."
                ]
            },
            'maintenance': {
                keywords: ['maintenance', 'entretien', 'préventif', 'nettoyage', 'optimisation', 'performance'],
                responses: [
                    "Nous proposons des contrats de maintenance préventive pour les entreprises, avec des visites régulières et un support prioritaire.",
                    "Nous assurons également le nettoyage physique et logiciel de vos équipements pour prolonger leur durée de vie."
                ]
            },

            'tarif': {
                keywords: ['tarif', 'prix', 'coût', 'combien', 'facture', 'devis', 'gratuit', 'paiement', 'mobile money', 'momo'],
                responses: [
                    "Nos tarifs varient selon le type d'intervention. Le frais de déplacement est à partir de 5000 FCFA, déduit si l'intervention est confirmée. Un devis gratuit vous est fourni avant toute intervention.",
                    "Nous acceptons le paiement en espèces, par Mobile Money (MTN, Moov) et par virement bancaire. Le paiement s'effectue après l'intervention."
                ]
            },
            'devis': {
                keywords: ['devis', 'estimation', 'évaluation', 'prix', 'tarif', 'gratuit', 'sans engagement'],
                responses: [
                    "Nous fournissons un devis gratuit et sans engagement avant toute intervention. Contactez-nous pour obtenir le vôtre.",
                    "Vous pouvez remplir le formulaire de contact ou nous appeler directement pour obtenir un devis personnalisé."
                ]
            },

            'delai': {
                keywords: ['délai', 'temps', 'durée', 'rapide', 'urgence', 'quand', 'disponibilité', 'délais'],
                responses: [
                    "Nous intervenons généralement sous 24h à Cotonou, Calavi et environs. Pour les urgences, nous pouvons intervenir le jour même.",
                    "En cas d'urgence critique, nous nous déplaçons immédiatement. Contactez-nous au 01 90 18 25 49."
                ]
            },
            'zone': {
                keywords: ['zone', 'cotonou', 'calavi', 'abomey', 'porto-novo', 'environs', 'déplacement', 'localisation', 'adresse'],
                responses: [
                    "Nous intervenons principalement à Cotonou, Calavi Zopah et environs. Pour les zones plus éloignées, contactez-nous pour vérifier la disponibilité.",
                    "Notre atelier est situé à Calavi Zopah. Nous nous déplaçons également sur site dans toute la région."
                ]
            },
            'urgence': {
                keywords: ['urgence', 'critique', 'immédiat', 'rapide', 'maintenant', 'dépanner', 'besoin aide', 'help'],
                responses: [
                    "Pour une urgence critique, contactez-nous immédiatement au 01 90 18 25 49. Nous intervenons 7j/7 pour les situations urgentes.",
                    "Nous priorisons les interventions urgentes. Appelez-nous directement pour une prise en charge rapide."
                ]
            },

            'contact': {
                keywords: ['contact', 'joindre', 'appeler', 'email', 'téléphone', 'whatsapp', 'adresse', 'où', 'localisation'],
                responses: [
                    "Vous pouvez nous contacter par téléphone au 01 90 18 25 49, par WhatsApp au même numéro, ou par email à contactstechsolutionsakpo@gmail.com.",
                    "Notre adresse : Calavi Zopah, Cotonou, Bénin. Nous sommes disponibles du lundi au samedi de 8h à 19h."
                ]
            },
            'horaire': {
                keywords: ['horaire', 'heure', 'ouverture', 'fermeture', 'quand', 'disponible', 'jour', 'semaine'],
                responses: [
                    "Nos horaires d'ouverture : du lundi au samedi de 8h à 19h. Pour les urgences, nous intervenons 7j/7.",
                    "Nous sommes disponibles en dehors des horaires pour les situations critiques. Contactez-nous au 01 90 18 25 49."
                ]
            },

            'particulier': {
                keywords: ['particulier', 'particuliers', 'individuel', 'personne', 'particulier', 'particuliers'],
                responses: [
                    "Nous proposons des services adaptés aux particuliers : installation Windows, dépannage, suppression virus, récupération de données, etc.",
                    "Chaque intervention est personnalisée pour répondre aux besoins spécifiques de notre client."
                ]
            },
            'entreprise': {
                keywords: ['entreprise', 'société', 'pmé', 'bureau', 'cabinet', 'professionnel', 'commerce', 'boutique'],
                responses: [
                    "Pour les entreprises, nous proposons des contrats de maintenance préventive, la gestion de parc informatique, et des interventions rapides.",
                    "Nous offrons également des services de sécurisation des données, d'installation réseau et de support technique dédié."
                ]
            },

            'compte': {
                keywords: ['compte', 'inscription', 'login', 'mot de passe', 'connexion', 'espace client', 'client'],
                responses: [
                    "Vous pouvez créer un compte client sur notre site. Cela vous permet de suivre vos demandes et d'accéder à vos factures.",
                    "Allez sur la page d'inscription ou connectez-vous si vous avez déjà un compte."
                ]
            },
            'inscription': {
                keywords: ['inscription', 'créer', 'compte', 'sinscrire', 's\'inscrire', 'enregistrer', 'register'],
                responses: [
                    "Pour vous inscrire, rendez-vous sur la page d'inscription. Vous pourrez ensuite gérer vos demandes et factures en ligne.",
                    "L'inscription est gratuite et vous donne accès à votre espace client personnel."
                ]
            },
            'connecter': {
                keywords: ['connecter', 'se connecter', 'login', 'authentification', 'accès', 'espace'],
                responses: [
                    "Connectez-vous à votre espace client pour suivre vos demandes, consulter vos factures et gérer vos informations.",
                    "Si vous n'avez pas encore de compte, vous pouvez vous inscrire gratuitement sur notre site."
                ]
            },

            'bonjour': {
                keywords: ['bonjour', 'salut', 'coucou', 'hello', 'hi', 'hey', 'rebonjour', 'bjr', 'slt'],
                responses: [
                    "Bonjour ! Je suis l'assistant virtuel d'AKPO TECH SOLUTIONS. Comment puis-je vous aider aujourd'hui ?",
                    "Bonjour et bienvenue ! Posez-moi toutes vos questions sur nos services, nos tarifs ou nos interventions.",
                    "Bonjour ! Je suis là pour répondre à vos questions sur la maintenance informatique. Que puis-je faire pour vous ?"
                ]
            },
            'merci': {
                keywords: ['merci', 'merci beaucoup', 'thanks', 'thank you', 'merci bien', 'merci infiniment'],
                responses: [
                    "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Nous sommes là pour vous aider.",
                    "Je vous en prie ! C'est un plaisir de pouvoir vous aider. À bientôt sur AKPO TECH SOLUTIONS."
                ]
            },
            'au revoir': {
                keywords: ['au revoir', 'aurevoir', 'bye', 'goodbye', 'à plus', 'à bientôt', 'ciao', 'salut', 'adieu'],
                responses: [
                    "Au revoir ! Merci d'avoir visité notre site. N'hésitez pas à revenir si vous avez besoin d'aide.",
                    "À bientôt ! Si vous avez besoin d'une intervention, contactez-nous au 01 90 18 25 49.",
                    "Bonne journée ! Nous restons disponibles pour vous assister avec vos besoins informatiques."
                ]
            },

            'default': {
                keywords: [],
                responses: [
                    "Je n'ai pas compris votre question. Je peux vous renseigner sur :",
                    "• Nos services (installation, dépannage, maintenance)",
                    "• Nos tarifs et devis",
                    "• Les délais d'intervention",
                    "• Comment nous contacter",
                    "• La création d'un compte client",
                    "Pouvez-vous reformuler votre question ?"
                ]
            }
        };
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.loadHistory();

        this.addMessage('bot', "Bonjour ! Je suis l'assistant d'AKPO TECH SOLUTIONS. Je peux vous renseigner sur nos services, nos tarifs, les délais d'intervention, et bien plus encore. Comment puis-je vous aider ?");

        this.renderUI();

        this.bindEvents();
    }

    renderUI() {
        this.container.innerHTML = `
            <!-- Bouton toggle -->
            <button class="chatbot-toggle" id="chatbotToggle">
                <i class="bi bi-chat-dots"></i>
            </button>

            <!-- Fenêtre de chat -->
            <div class="chatbot-window" id="chatbotWindow" style="display: none;">
                <div class="chatbot-header">
                    <div class="chatbot-header-left">
                        <div class="chatbot-avatar">
                            <i class="bi bi-robot"></i>
                        </div>
                        <div>
                            <strong>Assistant AKPO TECH</strong>
                            <small>En ligne</small>
                        </div>
                    </div>
                    <div class="chatbot-header-right">
                        <button class="chatbot-minimize" id="chatbotMinimize">
                            <i class="bi bi-dash"></i>
                        </button>
                        <button class="chatbot-close" id="chatbotClose">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    ${this.messages.map(msg => this.formatMessage(msg)).join('')}
                </div>

                <div class="chatbot-input-area">
                    <div class="chatbot-input-wrapper">
                        <input type="text" id="chatbotInput" placeholder="Écrivez votre message..." autocomplete="off">
                        <button id="chatbotSend" class="btn btn-primary btn-sm">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                    <div class="chatbot-options" id="chatbotOptions">
                        <button class="chatbot-option" data-msg="Services proposés">🔧 Services</button>
                        <button class="chatbot-option" data-msg="Tarifs et devis">💰 Tarifs</button>
                        <button class="chatbot-option" data-msg="Délais d'intervention">⏱️ Délais</button>
                        <button class="chatbot-option" data-msg="Contact">📞 Contact</button>
                    </div>
                </div>
            </div>
        `;

        this.injectStyles();

        const toggleBtn = document.getElementById('chatbotToggle');
        const windowEl = document.getElementById('chatbotWindow');
        const minimizeBtn = document.getElementById('chatbotMinimize');
        const closeBtn = document.getElementById('chatbotClose');

        toggleBtn.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            windowEl.style.display = this.isOpen ? 'flex' : 'none';
        });

        minimizeBtn.addEventListener('click', () => {
            this.isOpen = false;
            windowEl.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            this.isOpen = false;
            windowEl.style.display = 'none';
        });
    }

    injectStyles() {
        const styles = `
            
            .chatbot-toggle {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9998;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3B82F6, #60A5FA);
                color: white;
                border: none;
                font-size: 1.8rem;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(59,130,246,0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .chatbot-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 30px rgba(59,130,246,0.5);
            }

            
            .chatbot-window {
                position: fixed;
                bottom: 100px;
                right: 24px;
                z-index: 9999;
                width: 380px;
                max-height: 520px;
                height: 520px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #E2E8F0;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            
            .chatbot-header {
                background: linear-gradient(135deg, #1E293B, #0F172A);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }
            .chatbot-header-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .chatbot-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: #3B82F6;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            .chatbot-header strong {
                font-size: 0.9rem;
                display: block;
            }
            .chatbot-header small {
                font-size: 0.7rem;
                color: #94A3B8;
            }
            .chatbot-header-right {
                display: flex;
                gap: 8px;
            }
            .chatbot-header-right button {
                background: none;
                border: none;
                color: #94A3B8;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            .chatbot-header-right button:hover {
                background: rgba(255,255,255,0.1);
                color: white;
            }

            
            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px;
                background: #F8FAFC;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #CBD5E1;
                border-radius: 4px;
            }
            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            
            .chatbot-message {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 0.85rem;
                line-height: 1.5;
                animation: messageIn 0.3s ease;
            }
            @keyframes messageIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .chatbot-message.bot {
                background: white;
                color: #0F172A;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .chatbot-message.bot .message-header {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 4px;
                font-size: 0.7rem;
                color: #94A3B8;
            }
            .chatbot-message.bot .message-header i {
                color: #3B82F6;
            }
            .chatbot-message.user {
                background: #3B82F6;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }

            
            .chatbot-input-area {
                padding: 12px 16px;
                border-top: 1px solid #E2E8F0;
                background: white;
                flex-shrink: 0;
            }
            .chatbot-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .chatbot-input-wrapper input {
                flex: 1;
                padding: 8px 14px;
                border: 1px solid #E2E8F0;
                border-radius: 24px;
                font-size: 0.85rem;
                outline: none;
                transition: border-color 0.2s;
            }
            .chatbot-input-wrapper input:focus {
                border-color: #3B82F6;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
            }
            .chatbot-input-wrapper button {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #3B82F6;
                color: white;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .chatbot-input-wrapper button:hover {
                background: #2563EB;
                transform: scale(1.02);
            }

            
            .chatbot-options {
                display: flex;
                gap: 6px;
                margin-top: 8px;
                flex-wrap: wrap;
            }
            .chatbot-option {
                padding: 4px 12px;
                border-radius: 20px;
                border: 1px solid #E2E8F0;
                background: white;
                font-size: 0.7rem;
                color: #475569;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .chatbot-option:hover {
                background: #EFF6FF;
                border-color: #3B82F6;
                color: #3B82F6;
            }

            
            .chatbot-typing {
                display: flex;
                gap: 4px;
                padding: 8px 14px;
                background: white;
                border-radius: 12px;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .chatbot-typing span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #94A3B8;
                animation: typing 1.4s infinite both;
            }
            .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
            .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                40% { transform: scale(1); opacity: 1; }
            }

            
            @media (max-width: 576px) {
                .chatbot-window {
                    width: 90%;
                    right: 5%;
                    bottom: 80px;
                    height: 450px;
                }
                .chatbot-toggle {
                    width: 50px;
                    height: 50px;
                    font-size: 1.4rem;
                    bottom: 16px;
                    right: 16px;
                }
                .chatbot-options {
                    gap: 4px;
                }
                .chatbot-option {
                    font-size: 0.65rem;
                    padding: 3px 10px;
                }
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    formatMessage(msg) {
        if (msg.type === 'bot') {
            return `
                <div class="chatbot-message bot">
                    <div class="message-header">
                        <i class="bi bi-robot"></i> Assistant
                    </div>
                    ${msg.text}
                </div>
            `;
        } else {
            return `
                <div class="chatbot-message user">
                    ${msg.text}
                </div>
            `;
        }
    }

    addMessage(type, text) {
        this.messages.push({ type, text, timestamp: Date.now() });
        this.saveHistory();
        this.renderMessages();
        this.scrollToBottom();
    }

    renderMessages() {
        const container = document.getElementById('chatbotMessages');
        if (!container) return;
        container.innerHTML = this.messages.map(msg => this.formatMessage(msg)).join('');
    }

    scrollToBottom() {
        const container = document.getElementById('chatbotMessages');
        if (!container) return;
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }

    saveHistory() {
        try {
            localStorage.setItem('chatbot_history_' + window.location.hostname, JSON.stringify(this.messages));
        } catch (e) {}
    }

    loadHistory() {
        try {
            const data = localStorage.getItem('chatbot_history_' + window.location.hostname);
            if (data) {
                this.messages = JSON.parse(data);
            }
        } catch (e) {}
    }

    getResponse(input) {
        const lowerInput = input.toLowerCase().trim();

        for (const [key, category] of Object.entries(this.knowledgeBase)) {
            if (key === 'default') continue;
            
            const matched = category.keywords.some(keyword => 
                lowerInput.includes(keyword) || keyword.includes(lowerInput)
            );
            
            if (matched) {
                const response = category.responses[Math.floor(Math.random() * category.responses.length)];
                return { response, category: key };
            }
        }

        for (const [key, category] of Object.entries(this.knowledgeBase)) {
            if (key === 'default') continue;
            
            const matched = category.keywords.some(keyword => {
                const words = lowerInput.split(' ');
                return words.some(word => word.length >= 3 && keyword.includes(word));
            });
            
            if (matched) {
                const response = category.responses[Math.floor(Math.random() * category.responses.length)];
                return { response, category: key };
            }
        }

        const defaultResponses = this.knowledgeBase.default.responses;
        return { 
            response: defaultResponses.join('\n'), 
            category: 'default' 
        };
    }

    showTyping() {
        const container = document.getElementById('chatbotMessages');
        if (!container) return;
        const typingEl = document.createElement('div');
        typingEl.className = 'chatbot-typing';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingEl);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) typingEl.remove();
    }

    bindEvents() {

        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;

            this.addMessage('user', text);
            input.value = '';

            this.showTyping();

            setTimeout(() => {
                this.hideTyping();
                const result = this.getResponse(text);
                this.addMessage('bot', result.response);
            }, 500 + Math.random() * 500);
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        document.querySelectorAll('.chatbot-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const msg = btn.dataset.msg;
                if (msg) {
                    const inputEl = document.getElementById('chatbotInput');
                    inputEl.value = msg;
                    sendMessage();
                }
            });
        });
    }

    reset() {
        this.messages = [];
        this.saveHistory();
        this.renderMessages();
        this.addMessage('bot', "Bonjour ! Je suis l'assistant d'AKPO TECH SOLUTIONS. Comment puis-je vous aider ?");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const containerId = 'chatbotContainer';

    if (!document.getElementById(containerId)) {
        const div = document.createElement('div');
        div.id = containerId;
        document.body.appendChild(div);
    }

    if (typeof window.chatbot === 'undefined') {
        window.chatbot = new AkpoChatbot();
        window.chatbot.init(containerId);
    }
});