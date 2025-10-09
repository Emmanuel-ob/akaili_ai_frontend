// Akili AI Widget - Simple Embeddable Chat Widget
(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.AkiliWidget) return;

    // Get configuration from script tag
    const getCurrentScript = () => {
        // First try currentScript (works if loaded via <script src> normally)
        if (document.currentScript) return document.currentScript;

        // Try last script in DOM that matches our filename
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.includes("akili-widget.js")) {
                return scripts[i];
            }
        }

        // Fallback: find script with data-widget-token
        return document.querySelector('script[data-widget-token]');
    };


    const script = getCurrentScript();
    if (!script) {
        console.error('Akili Widget: Could not find script tag');
        return;
    }

    const config = {
        widgetToken: script.getAttribute('data-widget-token'),
        apiBase: script.getAttribute('data-api-base'),
        authEndpoint: script.getAttribute('data-auth-endpoint') // Optional auth endpoint
    };

    if (!config.widgetToken || !config.apiBase) {
        console.error('Akili Widget: Missing required attributes (data-widget-token, data-api-base)');
        return;
    }

    class AkiliWidget {
        constructor(config) {
            this.config = config;
            this.isOpen = false;
            this.sessionId = null;
            this.messages = [];
            this.isTyping = false;
            this.customerData = null;
            this.isAuthenticated = false;
            this.authExpiry = null;

            this.init();
        }

        async init() {
            // Get customer data from script attributes
            this.getCustomerDataFromScript();

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

        getCustomerDataFromScript() {
            const data = {};

            // Get user data directly from script attributes
            const email = script.getAttribute('data-user-email');
            const name = script.getAttribute('data-user-name');
            const id = script.getAttribute('data-user-id');
            const phone = script.getAttribute('data-user-phone');

            if (email) data.email = email;
            if (name) data.name = name;
            if (id) data.id = id;
            if (phone) data.phone = phone;

            this.customerData = Object.keys(data).length ? data : null;
        }

        async loadConfig() {
            try {
                const response = await fetch(`${this.config.apiBase}/api/widget/${this.config.widgetToken}/config`);
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
                is_active: true,
                auth_endpoint: null // Auth endpoint configured from dashboard
            };
        }

        async authenticateUser() {
            // Get auth endpoint from widget config (set in dashboard)
            const authEndpoint = this.widgetConfig.auth_endpoint;

            if (!authEndpoint) {
                return false; // No auth endpoint configured
            }

            // Check if authentication is still valid
            if (this.isAuthenticated && this.authExpiry && Date.now() < this.authExpiry) {
                return true;
            }

            try {
                // Build full URL if endpoint is relative
                const authUrl = authEndpoint.startsWith('http')
                    ? authEndpoint
                    : window.location.origin + authEndpoint;

                const response = await fetch(authUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_data: this.customerData,
                        widget_token: this.config.widgetToken
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        this.isAuthenticated = true;
                        // Set auth expiry (default 30 minutes)
                        this.authExpiry = Date.now() + (data.expires_in || 1800) * 1000;
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('Authentication failed:', error);
                return false;
            }
        }

        requiresAuth(action) {
            // Define which actions require authentication
            const authRequiredActions = ['sensitive_query', 'account_info', 'personal_data'];
            return authRequiredActions.includes(action);
        }

        async promptForAuth() {
            return new Promise((resolve) => {
                // Create auth modal
                const modal = document.createElement('div');
                modal.className = 'akili-auth-modal';
                modal.innerHTML = `
                    <div class="akili-auth-content">
                        <h3>Authentication Required</h3>
                        <p>This action requires verification. Please confirm your identity.</p>
                        <div class="akili-auth-buttons">
                            <button class="akili-auth-btn akili-auth-verify">Verify</button>
                            <button class="akili-auth-btn akili-auth-cancel">Cancel</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                const verifyBtn = modal.querySelector('.akili-auth-verify');
                const cancelBtn = modal.querySelector('.akili-auth-cancel');

                verifyBtn.onclick = async () => {
                    const success = await this.authenticateUser();
                    document.body.removeChild(modal);
                    resolve(success);
                };

                cancelBtn.onclick = () => {
                    document.body.removeChild(modal);
                    resolve(false);
                };
            });
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

                .akili-bottom-left {
                    bottom: 20px;
                    left: 20px;
                }
                
                .akili-chat-bubble:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
                
                .akili-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
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

                /* Auth Modal Styles */
                .akili-auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                }

                .akili-auth-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    max-width: 300px;
                    text-align: center;
                }

                .akili-auth-content h3 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    color: #374151;
                }

                .akili-auth-content p {
                    margin: 0 0 20px 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .akili-auth-buttons {
                    display: flex;
                    gap: 12px;
                }

                .akili-auth-btn {
                    flex: 1;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .akili-auth-verify {
                    background: #6366f1;
                    color: white;
                }

                .akili-auth-cancel {
                    background: #e5e7eb;
                    color: #374151;
                }
                
                @media (max-width: 480px) {
                    .akili-chat-widget {
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                        bottom: 0 !important;
                        right: 0 !important;
                        left: 0 !important;
                    }
                    
                    .akili-chat-bubble {
                        right: 20px !important;
                        left: auto !important;
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

            // Check if message requires authentication (only if auth is enabled)
            const requiresAuth = this.widgetConfig.require_auth && this.checkRequiresAuth(message);

            if (requiresAuth && this.widgetConfig.auth_endpoint) {
                const authenticated = await this.promptForAuth();
                if (!authenticated) {
                    this.addMessage('assistant', 'Authentication is required to process this request. Please try again.');
                    return;
                }
            }

            // Show typing indicator
            this.showTyping();

            try {
                const response = await fetch(`${this.config.apiBase}/api/widget/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        widget_token: this.config.widgetToken,
                        session_id: this.sessionId,
                        customer_data: this.customerData,
                        is_authenticated: this.isAuthenticated
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

        checkRequiresAuth(message) {
            if (!this.widgetConfig.sensitive_keywords) {
                return false;
            }

            const keywords = this.widgetConfig.sensitive_keywords
                .toLowerCase()
                .split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0);

            const messageWords = message.toLowerCase();
            return keywords.some(keyword => messageWords.includes(keyword));
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
                    sourceEl.textContent = `Source: ${source.table || 'Document'}`;
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

    // Auto-initialize when DOM is ready
    function initWidget() {
        window.AkiliWidget = new AkiliWidget(config);
    }

    // Initialize based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();