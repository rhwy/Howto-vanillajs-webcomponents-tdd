/**
 * Character Counter Textarea Web Component
 * A textarea with real-time character counting and optional localStorage persistence
 * 
 * @element rc-text-area
 * @attr {string} label - Label text above the textarea
 * @attr {string} placeholder - Placeholder text
 * @attr {number} max-chars - Maximum character limit (default: 280)
 * @attr {string} storage-key - localStorage key for auto-save (optional)
 * @attr {string} value - Current textarea value
 * @fires input - Fired on every input change
 * @fires limitReached - Fired when character limit is reached
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --primary-color: #3b82f6;
        --warning-color: #f59e0b;
        --danger-color: #ef4444;
        --bg-color: #ffffff;
        --border-color: #d1d5db;
        --text-color: #1f2937;
        --muted-color: #6b7280;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color);
    }

    .textarea-wrapper {
        position: relative;
    }

    textarea {
        width: 100%;
        min-height: 120px;
        padding: 0.75rem;
        font-size: 1rem;
        font-family: inherit;
        line-height: 1.5;
        color: var(--text-color);
        background-color: var(--bg-color);
        border: 2px solid var(--border-color);
        border-radius: 0.5rem;
        resize: vertical;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea.warning {
        border-color: var(--warning-color);
    }

    textarea.warning:focus {
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    textarea.danger {
        border-color: var(--danger-color);
    }

    textarea.danger:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .progress-bar {
        flex: 1;
        height: 4px;
        background-color: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: var(--primary-color);
        transition: width 0.15s, background-color 0.2s;
        width: 0%;
    }

    .progress-fill.warning {
        background-color: var(--warning-color);
    }

    .progress-fill.danger {
        background-color: var(--danger-color);
    }

    .counter {
        font-size: 0.75rem;
        color: var(--muted-color);
        font-variant-numeric: tabular-nums;
        min-width: 5rem;
        text-align: right;
    }

    .counter.warning {
        color: var(--warning-color);
        font-weight: 500;
    }

    .counter.danger {
        color: var(--danger-color);
        font-weight: 600;
    }

    .saved-indicator {
        font-size: 0.75rem;
        color: var(--muted-color);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .saved-indicator.visible {
        opacity: 1;
    }
</style>

<div class="container">
    <label id="label"></label>
    <div class="textarea-wrapper">
        <textarea id="textarea"></textarea>
    </div>
    <div class="footer">
        <span class="saved-indicator" id="saved">✓ Saved</span>
        <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
        </div>
        <span class="counter" id="counter">0/280</span>
    </div>
</div>
`;

export class RcTextArea extends HTMLElement {
    static get observedAttributes() {
        return ['label', 'placeholder', 'max-chars', 'storage-key', 'value'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Cache DOM references
        this.$label = this.shadowRoot.querySelector('#label');
        this.$textarea = this.shadowRoot.querySelector('#textarea');
        this.$counter = this.shadowRoot.querySelector('#counter');
        this.$progress = this.shadowRoot.querySelector('#progress');
        this.$saved = this.shadowRoot.querySelector('#saved');
        
        // Bind methods
        this._handleInput = this._handleInput.bind(this);
        this._saveToStorage = this._debounce(this._saveToStorage.bind(this), 500);
        
        // State
        this._limitReachedFired = false;
    }

    connectedCallback() {
        // Set defaults
        if (!this.hasAttribute('max-chars')) {
            this.setAttribute('max-chars', '280');
        }
        
        // Load from localStorage if storage-key is set
        this._loadFromStorage();
        
        // Add event listeners
        this.$textarea.addEventListener('input', this._handleInput);
        
        // Initial render
        this._render();
    }

    disconnectedCallback() {
        this.$textarea.removeEventListener('input', this._handleInput);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'label':
                this.$label.textContent = newValue || '';
                this.$label.style.display = newValue ? 'block' : 'none';
                break;
            case 'placeholder':
                this.$textarea.placeholder = newValue || '';
                break;
            case 'value':
                if (this.$textarea.value !== newValue) {
                    this.$textarea.value = newValue || '';
                    this._render();
                }
                break;
            case 'max-chars':
            case 'storage-key':
                this._render();
                break;
        }
    }

    // Public API
    get value() {
        return this.$textarea.value;
    }

    set value(newValue) {
        this.$textarea.value = newValue || '';
        this.setAttribute('value', newValue || '');
        this._render();
        this._saveToStorage();
    }

    get maxChars() {
        return parseInt(this.getAttribute('max-chars')) || 280;
    }

    set maxChars(value) {
        this.setAttribute('max-chars', value);
    }

    get storageKey() {
        return this.getAttribute('storage-key');
    }

    set storageKey(value) {
        this.setAttribute('storage-key', value);
    }

    get charCount() {
        return this.$textarea.value.length;
    }

    get charsRemaining() {
        return this.maxChars - this.charCount;
    }

    // Methods
    clear() {
        this.value = '';
        if (this.storageKey) {
            localStorage.removeItem(this.storageKey);
        }
    }

    focus() {
        this.$textarea.focus();
    }

    // Private methods
    _handleInput() {
        const value = this.$textarea.value;
        
        // Enforce max chars
        if (value.length > this.maxChars) {
            this.$textarea.value = value.slice(0, this.maxChars);
        }
        
        this._render();
        this._saveToStorage();
        
        // Fire events
        this.dispatchEvent(new CustomEvent('input', {
            detail: { value: this.value, charCount: this.charCount },
            bubbles: true,
            composed: true
        }));
        
        // Fire limitReached only once when limit is hit
        if (this.charCount >= this.maxChars && !this._limitReachedFired) {
            this._limitReachedFired = true;
            this.dispatchEvent(new CustomEvent('limitReached', {
                detail: { value: this.value, maxChars: this.maxChars },
                bubbles: true,
                composed: true
            }));
        } else if (this.charCount < this.maxChars) {
            this._limitReachedFired = false;
        }
    }

    _render() {
        const count = this.charCount;
        const max = this.maxChars;
        const percentage = Math.min((count / max) * 100, 100);
        
        // Update counter text
        this.$counter.textContent = `${count}/${max}`;
        
        // Update progress bar
        this.$progress.style.width = `${percentage}%`;
        
        // Determine state
        let state = '';
        if (percentage >= 100) {
            state = 'danger';
        } else if (percentage >= 80) {
            state = 'warning';
        }
        
        // Apply state classes
        this.$textarea.classList.toggle('warning', state === 'warning');
        this.$textarea.classList.toggle('danger', state === 'danger');
        this.$progress.classList.toggle('warning', state === 'warning');
        this.$progress.classList.toggle('danger', state === 'danger');
        this.$counter.classList.toggle('warning', state === 'warning');
        this.$counter.classList.toggle('danger', state === 'danger');
    }

    _loadFromStorage() {
        if (this.storageKey) {
            const saved = localStorage.getItem(this.storageKey);
            if (saved !== null) {
                this.$textarea.value = saved;
            }
        }
    }

    _saveToStorage() {
        if (this.storageKey) {
            localStorage.setItem(this.storageKey, this.value);
            this._showSavedIndicator();
        }
    }

    _showSavedIndicator() {
        this.$saved.classList.add('visible');
        setTimeout(() => {
            this.$saved.classList.remove('visible');
        }, 1500);
    }

    _debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }
}

// Register the custom element
customElements.define('rc-text-area', RcTextArea);
