<template>
    <div class="code-block-container">
        <div class="code-block-header">
            <div class="flex items-center space-x-2">
                <div class="flex space-x-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span class="text-xs text-gray-500 ml-3">{{ languageLabel }}</span>
            </div>
        </div>
        <pre class="code-block-content"><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    }
})

const languageLabel = computed(() => {
    const labels = {
        'javascript': 'JavaScript',
        'html': 'HTML',
        'php': 'PHP',
        'python': 'Python',
        'css': 'CSS',
        'json': 'JSON'
    }
    return labels[props.language] || props.language.toUpperCase()
})

// Simple syntax highlighting - fixed to avoid double escaping
const highlightedCode = computed(() => {
    let code = props.code

    if (props.language === 'html' || props.language === 'javascript') {
        code = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<<<COMMENT$1COMMENT>>>')
            .replace(/(\/\/[^\n]*)/g, '<<<COMMENT$1COMMENT>>>')
            .replace(/("(?:[^"\\]|\\.)*")/g, '<<<STRING$1STRING>>>')
            .replace(/('(?:[^'\\]|\\.)*')/g, '<<<STRING$1STRING>>>')
            .replace(/(`(?:[^`\\]|\\.)*?`)/g, '<<<STRING$1STRING>>>')
            .replace(/\b(var|let|const|function|return|if|else|for|while|class|new|async|await|import|export|from|script|type|document|true|false)\b/g, '<<<KEYWORD$1KEYWORD>>>')
            .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<<<FUNCTION$1FUNCTION>>>(')
            .replace(/\b(\d+)\b/g, '<<<NUMBER$1NUMBER>>>')
            .replace(/<<<COMMENT([\s\S]*?)COMMENT>>>/g, '<span class="code-comment">$1</span>')
            .replace(/<<<STRING(.*?)STRING>>>/g, '<span class="code-string">$1</span>')
            .replace(/<<<KEYWORD(.*?)KEYWORD>>>/g, '<span class="code-keyword">$1</span>')
            .replace(/<<<FUNCTION(.*?)FUNCTION>>>/g, '<span class="code-function">$1</span>')
            .replace(/<<<NUMBER(.*?)NUMBER>>>/g, '<span class="code-number">$1</span>')
    } else if (props.language === 'php') {
        code = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<<<COMMENT$1COMMENT>>>')
            .replace(/(\/\/[^\n]*)/g, '<<<COMMENT$1COMMENT>>>')
            .replace(/("(?:[^"\\]|\\.)*")/g, '<<<STRING$1STRING>>>')
            .replace(/('(?:[^'\\]|\\.)*')/g, '<<<STRING$1STRING>>>')
            .replace(/(&lt;\?php|\?&gt;)/g, '<<<KEYWORD$1KEYWORD>>>')
            .replace(/\b(function|return|if|else|foreach|while|class|public|private|protected|static|const|use|namespace|array|new|echo|print|true|false|null)\b/g, '<<<KEYWORD$1KEYWORD>>>')
            .replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, '<<<VARIABLE$1VARIABLE>>>')
            .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<<<FUNCTION$1FUNCTION>>>(')
            .replace(/\b(\d+)\b/g, '<<<NUMBER$1NUMBER>>>')
            .replace(/<<<COMMENT([\s\S]*?)COMMENT>>>/g, '<span class="code-comment">$1</span>')
            .replace(/<<<STRING(.*?)STRING>>>/g, '<span class="code-string">$1</span>')
            .replace(/<<<KEYWORD(.*?)KEYWORD>>>/g, '<span class="code-keyword">$1</span>')
            .replace(/<<<VARIABLE(.*?)VARIABLE>>>/g, '<span class="code-variable">$1</span>')
            .replace(/<<<FUNCTION(.*?)FUNCTION>>>/g, '<span class="code-function">$1</span>')
            .replace(/<<<NUMBER(.*?)NUMBER>>>/g, '<span class="code-number">$1</span>')
    } else {
        code = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    return code
})
</script>

<style scoped>
.code-block-container {
    border-radius: 0.5rem; /* rounded-lg */
    overflow: hidden;
    border: 1px solid #d1d5db; /* border-gray-300 */
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); /* shadow-sm */
    background: #1e1e1e;
}

.code-block-header {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #374151; /* border-gray-700 */
    background: #2d2d2d;
}

.code-block-content {
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.625;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    margin: 0;
}

.code-block-content code {
    display: block;
    font-family: inherit;
}

/* Syntax highlighting colors (VS Code Dark+ theme) */
:deep(.code-comment) {
    color: #6a9955;
    font-style: italic;
}

:deep(.code-string) {
    color: #ce9178;
}

:deep(.code-keyword) {
    color: #569cd6;
    font-weight: 500;
}

:deep(.code-function) {
    color: #dcdcaa;
}

:deep(.code-number) {
    color: #b5cea8;
}

:deep(.code-variable) {
    color: #9cdcfe;
}

/* Scrollbar styling */
.code-block-content::-webkit-scrollbar {
    height: 8px;
}

.code-block-content::-webkit-scrollbar-track {
    background: #1e1e1e;
}

.code-block-content::-webkit-scrollbar-thumb {
    background: #424242;
    border-radius: 4px;
}

.code-block-content::-webkit-scrollbar-thumb:hover {
    background: #4e4e4e;
}
</style>