// Akili AI Widget - Embeddable Chat Widget
(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.AkiliWidget) return;

    class AkiliWidget {
        constructor(config) {
            this.config = config;
            this.isOpen = false;
            this.sessionId = null;
            this.messages = [];
            this.isTyping = false;

            this.init();
        }

        async init() {
            // Load widget configuration from API
            await this.loadConfig();

            // Create widget elements
            this.createWidget();
            this.attachEventListeners();

            // Auto-show welcome message after delay
            setTimeout(() => {
                if (this.widgetConfig.welcome_message) {
                    this.addMessage('assistant', this.widgetConfig.welcome_message);
                }
            }, 2000);
        }

        async loadConfig() {
            try {
                // Use Laravel backend for API calls, not the widget source
                const apiUrl = this.config.apiBase.replace(':3000', ':8000'); // Switch to Laravel port
                const response = await fetch(`${apiUrl}/api/widget/${this.config.widgetToken}/config`);
                const data = await response.json();

                if (data.success) {
                    this.widgetConfig = data.config;
                } else {
                    console.error('Failed to load widget config');
                    this.widgetConfig = this.getDefaultConfig();
                }
            } catch (error) {
                console.error('Error loading widget config:', error);
                this.widgetConfig = this.getDefaultConfig();
            }
        }

        getDefaultConfig() {
            return {
                name: 'AI Assistant',
                welcome_message: 'Hello! How can I help you?',
                primary_color: '#6366f1',
                widget_position: 'bottom-right',
                widget_size: 'medium',
                enable_typing_indicator: true,
                is_active: true
            };
        }

        createWidget() {
            // Widget container
            this.container = document.createElement('div');
            this.container.id = 'akili-widget-container';
            this.container.innerHTML = this.getWidgetHTML();

            // Add styles
            this.addStyles();

            // Append to body
            document.body.appendChild(this.container);

            // Get references to elements
            this.bubble = this.container.querySelector('.akili-chat-bubble');
            this.widget = this.container.querySelector('.akili-chat-widget');
            this.messagesContainer = this.container.querySelector('.akili-messages');
            this.input = this.container.querySelector('.akili-input');
            this.sendBtn = this.container.querySelector('.akili-send-btn');
            this.closeBtn = this.container.querySelector('.akili-close-btn');
        }

        getWidgetHTML() {
            const position = this.widgetConfig.widget_position || 'bottom-right';
            const color = this.widgetConfig.primary_color || '#6366f1';

            return `
                <div class="akili-chat-bubble akili-${position}" style="background-color: ${color}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                
                <div class="akili-chat-widget akili-${position}">
                    <div class="akili-header" style="background-color: ${color}">
                        <div class="akili-header-content">
                            <h3>${this.widgetConfig.name}</h3>
                            <span>Online</span>
                        </div>
                        <button class="akili-close-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="akili-messages"></div>
                    
                    <div class="akili-input-container">
                        <input type="text" class="akili-input" placeholder="Type your message..." />
                        <button class="akili-send-btn" style="background-color: ${color}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #akili-widget-container {
                    position: fixed;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .akili-chat-bubble {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                }

                .akili-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: none; /* hidden by default */
                }   

                
                .akili-chat-bubble {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                    color: white;
                }
                
                .akili-chat-bubble:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
                
                .akili-chat-widget {
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .akili-bottom-right {
                    bottom: 20px;
                    right: 20px;
                }
                
                .akili-bottom-left {
                    bottom: 20px;
                    left: 20px;
                }
                
                .akili-header {
                    padding: 16px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .akili-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .akili-header span {
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .akili-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    opacity: 0.8;
                    padding: 4px;
                    border-radius: 4px;
                }
                
                .akili-close-btn:hover {
                    opacity: 1;
                    background: rgba(255,255,255,0.1);
                }
                
                .akili-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .akili-message {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .akili-message.user {
                    background: #6366f1;
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 6px;
                }
                
                .akili-message.assistant {
                    background: #f3f4f6;
                    color: #374151;
                    align-self: flex-start;
                    border-bottom-left-radius: 6px;
                }
                
                .akili-typing {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                }
                
                .akili-typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #9ca3af;
                    animation: akili-bounce 1.4s ease-in-out infinite both;
                }
                
                .akili-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .akili-typing-dot:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes akili-bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    } 40% {
                        transform: scale(1);
                    }
                }
                
                .akili-input-container {
                    display: flex;
                    padding: 16px;
                    gap: 8px;
                    border-top: 1px solid #e5e7eb;
                }
                
                .akili-input {
                    flex: 1;
                    border: 1px solid #e5e7eb;
                    border-radius: 20px;
                    padding: 10px 16px;
                    outline: none;
                    font-size: 14px;
                }
                
                .akili-input:focus {
                    border-color: #6366f1;
                }
                
                .akili-send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.2s;
                }
                
                .akili-send-btn:hover {
                    opacity: 0.9;
                }
                
                .akili-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .akili-sources {
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid #e5e7eb;
                }
                
                .akili-source {
                    font-size: 11px;
                    color: #6b7280;
                    opacity: 0.8;
                }
                
                @media (max-width: 480px) {
                    .akili-chat-widget {
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                        bottom: 0 !important;
                        right: 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        attachEventListeners() {
            this.bubble.addEventListener('click', () => this.toggleWidget());
            this.closeBtn.addEventListener('click', () => this.closeWidget());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        toggleWidget() {
            this.isOpen = !this.isOpen;
            this.widget.style.display = this.isOpen ? 'flex' : 'none';
            this.bubble.style.display = this.isOpen ? 'none' : 'flex';

            if (this.isOpen) {
                this.input.focus();
            }
        }

        closeWidget() {
            this.isOpen = false;
            this.widget.style.display = 'none';
            this.bubble.style.display = 'flex';
        }

        async sendMessage() {
            const message = this.input.value.trim();
            if (!message || this.isTyping) return;

            // Clear input
            this.input.value = '';

            // Add user message
            this.addMessage('user', message);

            // Show typing indicator
            this.showTyping();

            try {
                const apiUrl = this.config.apiBase.replace(':3000', ':8000'); // Switch to Laravel port
                const response = await fetch(`${apiUrl}/api/widget/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        widget_token: this.config.widgetToken,
                        session_id: this.sessionId,
                        customer_data: this.getCustomerData()
                    })
                });
                const data = await response.json();

                if (data.success) {
                    this.sessionId = data.session_id;
                    this.addMessage('assistant', data.response.text, data.response.sources);
                } else {
                    this.addMessage('assistant', data.message || 'Sorry, something went wrong.');
                }
            } catch (error) {
                console.error('Chat error:', error);
                this.addMessage('assistant', 'Sorry, I\'m having trouble connecting. Please try again.');
            } finally {
                this.hideTyping();
            }
        }

        getCustomerData() {
            // Try to extract customer data from page
            const data = {};

            // Look for common customer data in various places
            const userEmail = document.querySelector('[data-user-email]')?.getAttribute('data-user-email');
            const userName = document.querySelector('[data-user-name]')?.getAttribute('data-user-name');
            const userId = document.querySelector('[data-user-id]')?.getAttribute('data-user-id');

            if (userEmail) data.email = userEmail;
            if (userName) data.name = userName;
            if (userId) data.user_id = userId;

            return Object.keys(data).length ? data : undefined;
        }

        addMessage(role, message, sources = []) {
            const messageEl = document.createElement('div');
            messageEl.className = `akili-message ${role}`;
            messageEl.textContent = message;

            if (sources && sources.length > 0) {
                const sourcesEl = document.createElement('div');
                sourcesEl.className = 'akili-sources';
                sources.slice(0, 2).forEach(source => {
                    const sourceEl = document.createElement('div');
                    sourceEl.className = 'akili-source';
                    sourceEl.textContent = `📄 ${source.table || 'Document'} (${Math.round(source.confidence * 100)}%)`;
                    sourcesEl.appendChild(sourceEl);
                });
                messageEl.appendChild(sourcesEl);
            }

            this.messagesContainer.appendChild(messageEl);
            this.scrollToBottom();
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;

            const typingEl = document.createElement('div');
            typingEl.className = 'akili-message assistant akili-typing-message';
            typingEl.innerHTML = `
                <div class="akili-typing">
                    <div class="akili-typing-dot"></div>
                    <div class="akili-typing-dot"></div>
                    <div class="akili-typing-dot"></div>
                </div>
            `;

            this.messagesContainer.appendChild(typingEl);
            this.scrollToBottom();
        }

        hideTyping() {
            this.isTyping = false;
            const typingEl = this.messagesContainer.querySelector('.akili-typing-message');
            if (typingEl) {
                typingEl.remove();
            }
        }

        scrollToBottom() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    // Initialize widget when DOM is ready
    function initWidget() {
        const script = document.currentScript;
        const widgetToken = script.getAttribute('data-widget-token');
        const apiBase = script.getAttribute('data-api-base');

        if (!widgetToken || !apiBase) {
            console.error('Akili Widget: Missing required attributes');
            return;
        }

        window.AkiliWidget = new AkiliWidget({
            widgetToken: widgetToken,
            apiBase: apiBase
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();