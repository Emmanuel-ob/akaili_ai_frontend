<template>
  <footer class="footer-root">
    <!-- Main Footer Body -->
    <div class="footer-body">
      <div class="footer-inner">

        <!-- TOP: Brand + Nav columns -->
        <div class="footer-top">

          <!-- Left: Brand Info -->
          <div class="brand-col">
            <NuxtLink to="/" aria-label="Xeli AI Home" class="brand-logo-link">
              <NuxtImg width="100" height="80" src="/logo-footer.png" format="webp" alt="Xeli AI Logo" loading="eager" />
            </NuxtLink>

            <p class="brand-description">
              Intelligent chatbots that connect to your data and provide exceptional customer experiences.
            </p>

            <div class="social-row">
              <NuxtLink to="https://www.facebook.com/people/Xeli-AI/61586431143047/" target="_blank" aria-label="Facebook" class="social-btn">
                <Facebook class="social-icon facebook-icon" />
              </NuxtLink>
              <NuxtLink to="https://www.instagram.com/xeli_ai/" target="_blank" aria-label="Instagram" class="social-btn">
                <Instagram class="social-icon instagram-icon" />
              </NuxtLink>
              <NuxtLink to="https://www.linkedin.com/company/xeli-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-btn">
                <Linkedin class="social-icon linkedin-icon" />
              </NuxtLink>
            </div>
          </div>

      <!-- 2: Company links -->
      <div class="space-y-5">
        <h3 class=" text-white text-xl font-bold">Product</h3>
        <nav class="flex flex-col space-y-2 text-sm">
          <NuxtLink to="/features" class="text-[#9CA3AF] hover:text-gray-200">Features</NuxtLink>
          <NuxtLink to="/pricing" class="text-[#9CA3AF] hover:text-gray-200">Pricing</NuxtLink>
          <NuxtLink to="/referrals" class="text-[#9CA3AF] hover:text-gray-200">Referral Program</NuxtLink>

        </nav>
      </div>
          <!-- Right: Nav Columns -->
          <div class="nav-columns">

            <!-- Platform -->
            <div class="nav-col">
              <h3 class="nav-heading">Platform</h3>
              <nav class="nav-links">
                <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
                <NuxtLink to="/dashboard/chatbot-setup" class="nav-link">Chatbot Setup</NuxtLink>
                <NuxtLink to="/dashboard/knowledge-base" class="nav-link">Knowledge Base</NuxtLink>
                <NuxtLink to="/dashboard/analytics" class="nav-link">Analytics</NuxtLink>
                <NuxtLink to="/dashboard/live-monitoring" class="nav-link">Conversations</NuxtLink>
              </nav>
            </div>

            <!-- Company -->
            <div class="nav-col">
              <h3 class="nav-heading">Company</h3>
              <nav class="nav-links">
                <NuxtLink to="/about" class="nav-link">About Us</NuxtLink>
                <NuxtLink to="/register" class="nav-link">Get Started</NuxtLink>
                <NuxtLink to="/login" class="nav-link">Sign In</NuxtLink>
                <NuxtLink to="/terms" class="nav-link">Terms</NuxtLink>
                <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
              </nav>
            </div>

            <!-- Support -->
            <div class="nav-col">
              <h3 class="nav-heading">Support</h3>
              <nav class="nav-links">
                <NuxtLink to="/contact" class="nav-link">Help Center</NuxtLink>
                <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
                <NuxtLink to="/privacy" class="nav-link">Privacy Policy</NuxtLink>
                <NuxtLink to="/terms" class="nav-link">Terms of Service</NuxtLink>
              </nav>
            </div>

            <!-- Xeliai Ecosystem -->
            <div class="nav-col">
              <h3 class="nav-heading">Xeliai Ecosystem</h3>
              <nav class="nav-links">
                <a href="https://labs.xeliai.com" target="_blank" rel="noopener noreferrer" class="nav-link nav-link--external">
                  Xeliai Labs
                  <svg class="ext-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <a href="https://blog.xeliai.com" target="_blank" rel="noopener noreferrer" class="nav-link nav-link--external">
                  Xeliai Blog
                  <svg class="ext-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <a href="https://litesigma.com" target="_blank" rel="noopener noreferrer" class="nav-link nav-link--external">
                  Litesigma
                  <svg class="ext-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </nav>
            </div>

          </div>
        </div>

        <!-- BOTTOM: Legal bar -->
        <div class="footer-bottom">
          <hr class="footer-rule" />
          <div class="legal-bar">
            <span class="copyright">© {{ new Date().getFullYear() }} XELI AI · ALL RIGHTS RESERVED</span>
            <div class="legal-links">
              <NuxtLink to="/terms" class="legal-link">Terms &amp; Conditions</NuxtLink>
              <NuxtLink to="/about" class="legal-link">About</NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Linkedin } from 'lucide-vue-next'
</script>

<style scoped>
.footer-root {
  font-family: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
  background: #f5f0e8;
}

.tree-band {
  position: relative;
  width: 100%;
  height: 140px;
}
.tree-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.footer-body {
  background: #111827;
  padding: 80px 24px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* Top layout: brand left, nav right */
.footer-top {
  display: flex;
  gap: 64px;
  align-items: flex-start;
}

.brand-col {
  flex: 0 0 240px;
  max-width: 240px;
}
.brand-logo-link {
  display: inline-block;
  margin-bottom: 20px;
}
.brand-description {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
  max-width: 220px;
  margin: 0 0 24px 0;
}
.social-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.social-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  transition: background 0.15s;
  text-decoration: none;
}
.social-btn:hover {
  background: #374151;
}
.social-icon {
  width: 16px;
  height: 16px;
}
.facebook-icon  { color: #1877F2; }
.instagram-icon { color: #8A42FF; }
.linkedin-icon  { color: #0077B5; }

/* Nav columns grid — 4 columns now */
.nav-columns {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.nav-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.nav-heading {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-link {
  font-size: 14px;
  color: #9CA3AF;
  text-decoration: none;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.nav-link:hover {
  color: #e5e7eb;
}
.nav-link--external {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.ext-icon {
  width: 10px;
  height: 10px;
  opacity: 0.5;
  flex-shrink: 0;
}
.nav-link--external:hover .ext-icon {
  opacity: 1;
}

/* Legal bar */
.footer-bottom {
  margin-top: 64px;
  padding-bottom: 64px;
}
.footer-rule {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 0 24px 0;
}
.legal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.copyright {
  font-size: 12px;
  color: #4B5563;
}
.legal-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.legal-link {
  font-size: 13px;
  color: #9CA3AF;
  text-decoration: none;
  transition: color 0.15s;
}
.legal-link:hover {
  color: #e5e7eb;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-columns {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 32px;
  }
}

@media (max-width: 768px) {
  .footer-body { padding-top: 48px; }
  .footer-top {
    flex-direction: column;
    gap: 40px;
  }
  .brand-col {
    flex: none;
    max-width: 100%;
  }
  .nav-columns {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
  }
  .legal-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .nav-columns { grid-template-columns: 1fr; }
}
</style>