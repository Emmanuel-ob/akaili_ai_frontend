// ~/utils/data.js (or wherever you export navLinks)
export const navLinks = [
  { id: 1, url: '/',           more: '',                  label: 'Home' },
  { id: 2, url: '/about',   more:'',   label: 'About' },
  { id: 3, url: '/products',more: '',                  label: 'Products' },
  { id: 4, url: '/pricing',    more: '',                  label: 'Pricing' },
  { id: 5, url: 'https://blog.xeliai.com',       more: '',                  label: 'Blog' },
  { id: 6, url: '/contact',    more: '',                  label: 'Contact' },
]

// ~/data/homepage/content.js
export const features = [
  {
    id: 1,
    title: "Dashboard Overview",
    description:
      "A central hub that displays system insights, performance summaries, and key activity metrics for your AI platform.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <defs>
    <linearGradient id="grad-dashboard" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9E4CFF"/>
      <stop offset="100%" stop-color="#6A61FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-dashboard)"
    d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z"/>
</svg>`
  },

  {
    id: 2,
    title: "Chatbot Setup",
    description:
      "Configure, customize, and deploy your AI chatbot with flexible settings, branding options, and data sources.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <defs>
    <linearGradient id="grad-bot" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#A066FF"/>
      <stop offset="100%" stop-color="#4F7BFF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-bot)"
    d="M12 2a2 2 0 110 4 2 2 0 010-4zm-7 6h14a2 2 0 012 2v6a5 5 0 01-5 5H8a5 5 0 01-5-5V10a2 2 0 012-2zm4 4a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm7 0a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/>
</svg>`
  },

  {
    id: 3,
    title: "Knowledge Base",
    description:
      "Upload, organize, and manage documents or data sources that your chatbot uses for training and accurate responses.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-folder" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#8A3CFF"/>
      <stop offset="100%" stop-color="#B55BFF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-folder)"
    d="M3 5h6l2 2h10v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
</svg>`
  },

  {
    id: 4,
    title: "Live Monitoring",
    description:
      "Track conversations in real-time, watch user interactions, and intervene when necessary using live agent tools.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-monitor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6F3CFF"/>
      <stop offset="100%" stop-color="#4CB0FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-monitor)"
    d="M3 4h18v12H3V4zm6 14v2h6v-2H9z"/>
</svg>`
  },

  {
    id: 5,
    title: "Analytics & Insights",
    description:
      "A rich analytics suite with charts, conversation metrics, user behavior tracking, and performance evaluation.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-analytics" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B44CFF"/>
      <stop offset="100%" stop-color="#4CD2FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-analytics)"
    d="M5 3v18M5 14l4-4 4 6 6-8"/>
</svg>`
  },

  {
    id: 6,
    title: "Test Chat Environment",
    description:
      "Experiment with your AI chatbot in a controlled environment before deploying it to customers.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-chat" x1="1" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#7A4CFF"/>
      <stop offset="100%" stop-color="#4CE3FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-chat)"
    d="M4 4h16v12H7l-3 3V4z"/>
</svg>`
  },

  {
    id: 7,
    title: "Team Management",
    description:
      "Add team members, define roles, and control access levels to keep collaboration structured and secure.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-team" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#9E4CFF"/>
      <stop offset="100%" stop-color="#FF66D7"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-team)"
    d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9v-2a5 5 0 0110 0v2H5zm12 0v-3a4 4 0 014-4"/>
</svg>`
  },

  {
    id: 8,
    title: "Email Marketing",
    description:
      "Create campaigns, send bulk messages, and automate email flows directly from your dashboard.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-email" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C04CFF"/>
      <stop offset="100%" stop-color="#4CF7FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-email)"
    d="M3 6h18v12H3V6zm9 6l9-6H3l9 6z"/>
</svg>`
  },

  {
    id: 9,
    title: "Agent Chat",
    description:
      "Enable real human agents to join conversations and support customers alongside your AI assistant.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-agent" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D04CFF"/>
      <stop offset="100%" stop-color="#4CA0FF"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-agent)"
    d="M12 4a4 4 0 110 8 4 4 0 010-8zm-7 14v-1a6 6 0 0112 0v1H5z"/>
</svg>`
  },

  {
    id: 10,
    title: "Settings & Customization",
    description:
      "Manage account preferences, integrations, security options, API keys, and platform configurations.",
    icon: `
<svg width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad-settings" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9E4CFF"/>
      <stop offset="100%" stop-color="#52FFE8"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad-settings)"
    d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-2 1 1 3-3 2-1-2-3 1-1 3H9l-1-3-3-1-1 2-3-2 1-3-2-1V9l2-1L2 5l3-2 1 2 3-1 1-3h2l1 3 3 1 1-2 3 2-1 3 2 1v2z"/>
</svg>`
  }
];




export const testimonials = [
  {
    id: 1,
    quote:
      "Xeli ai has revolutionized our customer support. We’ve seen a 60% reduction in response time and our customers love the instant help.",
    name: "Sarah Johnson",
    role: "CEO, TechStart, Inc",
    avatar: "/avatar_sarah.png"
  },
  {
    id: 2,
    quote:
      "The database integration feature is incredible. Our chatbot can access real-time inventory data and provide accurate information to customers.",
    name: "Michael Chen",
    role: "CTO, RetailPro",
    avatar: "/avatar_michael.png"
  },
  {
    id: 3,
    quote:
      "Setting up was incredibly easy. Within hours, we had a fully functional chatbot that understood our products and could help customers effectively.",
    name: "Emily Rodriguez",
    role: "Marketing Director, GrowthCo",
    avatar: "/avatar_emily.png"
  },
  {
    id: 4,
    quote:
      "Xeli ai has revolutionized our customer support. We’ve seen a 60% reduction in response time and our customers love the instant help.",
    name: "Sarah Johnson",
    role: "CEO, TechStart, Inc",
    avatar: "/avatar_sarah.png"
  },
  {
    id: 5,
    quote:
      "The database integration feature is incredible. Our chatbot can access real-time inventory data and provide accurate information to customers.",
    name: "Michael Chen",
    role: "CTO, RetailPro",
    avatar: "/avatar_michael.png"
  },
  {
    id: 6,
    quote:
      "Setting up was incredibly easy. Within hours, we had a fully functional chatbot that understood our products and could help customers effectively.",
    name: "Emily Rodriguez",
    role: "Marketing Director, GrowthCo",
    avatar: "/avatar_emily.png"
  },
]

export const cta = {
  heading: "Ready to Transform Your Customer Support?",
  subheading:
    "Join thousands of businesses already using Xeli ai to provide exceptional customer experiences.",
  buttonText: "Get Started",
}
export const productsuite = [
  {
    "title": "Wakili Bot",
    "description": "Engage customers instantly with a smart chatbot that uses your business data to deliver fast, accurate support—24/7.",
    "image": "wakili_productSuites.png",
    "bg": "from-sky-100 to-indigo-100",
    "features": [
      "Real-time responses from your data",
      "Easy integration with websites",
      "Natural, human-like conversations",
      'Customizable chat flows & tone'
    ]
  },
  {
    "title": "Business Assistant",
    "description": "Your personal AI-powered business partner that helps you stay organized, make smart decisions, and save time on daily tasks",
    "image": "business_productSuites.png",
    "bg": "from-pink-50 to-purple-50",
    "features": [
      "AI-generated business insights",
      "Smart task management",
      "Calendar & meeting assistant",
      "Personalized daily reports"
    ]
  },
  {
    "title": "Automation Tools",
    "description": "Automate your repetitive workflows and responses so you can focus on what really matters—growing your business.",
    "image": "automation_productSuites.png",
    "bg": "from-cyan-50 to-sky-50",
    "features": [
      "Custom workflow builder",
      "Auto-replies & triggers",
      "Integration with popular tools",
      "Real-time activity logs"
    ]
  }
]


