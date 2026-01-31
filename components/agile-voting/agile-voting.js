/**
 * Agile Voting Web Component
 * A simple voting component for agile estimation
 * 
 * @element rc-agile-voting
 * @attr {string} value - The currently selected vote value
 * @attr {string} values - Comma-separated list of voting options (default: XS,S,M,L,XL)
 * @fires valueChanged - Fired when the vote value changes
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        position: relative;
        width: 200px;
        height: 200px;
        display: flex;
        flex-direction: column;
        font-size: 16px;
        justify-content: center;
        align-items: center;
    }
    
    #info {
        background-color: var(--background-color, black);
        color: var(--text-color, white);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;    
        border-radius: 10px;
    }

    #value {
        font-size: 4em;
    }
    
    #reset {
        font-size: 1.5em;
        display: block;
        position: absolute;
        bottom: 5px;
        right: 5px;
        z-index: 50;
        cursor: pointer;
    }
    
    #form {
        background-color: white;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #ccc;
    }
    
    #selector {
        display: block;
        font-size: 2em;
        font-weight: 700;
        color: #444;
        line-height: 2em;
        outline: none;
        box-sizing: border-box;
        width: 90%;
        max-width: 90%;
        margin: 0;
        padding: 1px 10px;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
        border-radius: .5em;
        appearance: none;
        background-color: #fff;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
            linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: 0.65em auto, 100%;
    } 

    #setValue {
        width: 90%;
        border-radius: 10px;
        background-color: #EEE;
        box-sizing: border-box;
        text-align: center;
        transition: all 0.2s;
        font-size: 2em;
        font-weight: 700;
        color: #444;
        line-height: 2em;
        outline: none;
        cursor: pointer;
        border: none;
        margin-top: 10px;
    }
    
    #setValue:hover {
        background-color: #4eb5f1;
        color: white;
    }
</style>

<slot name="title"><h3>T-Shirt Sizes</h3></slot>
<div id="form">
    <select id="selector"></select>
    <button id="setValue">Vote!</button>
</div>
<div id="info">
    <span id="value"></span>
    <span id="reset">🔄</span>
</div>`;

export class AgileVoting extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'values'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Cache DOM references
        this.$valueInfo = this.shadowRoot.querySelector('#value');
        this.$formView = this.shadowRoot.querySelector('#form');
        this.$selector = this.shadowRoot.querySelector('#selector');
        this.$buttonSet = this.shadowRoot.querySelector('#setValue');
        this.$infoView = this.shadowRoot.querySelector('#info');
        this.$buttonReset = this.shadowRoot.querySelector('#reset');
        
        // Bind methods
        this._handleReset = this._handleReset.bind(this);
        this._handleSetValue = this._handleSetValue.bind(this);
    }

    connectedCallback() {
        // Set default values if not specified
        if (!this.hasAttribute('value')) {
            this.setAttribute('value', '');
        }
        if (!this.hasAttribute('values')) {
            this.values = 'XS,S,M,L,XL';
        }
        
        // Add event listeners
        this.$buttonReset.addEventListener('click', this._handleReset);
        this.$buttonSet.addEventListener('click', this._handleSetValue);
        
        this._render();
    }

    disconnectedCallback() {
        // Clean up event listeners
        this.$buttonReset.removeEventListener('click', this._handleReset);
        this.$buttonSet.removeEventListener('click', this._handleSetValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        if (name === 'values' && newValue) {
            this._populateOptions(newValue.split(','));
        }
        
        this._render();
    }

    // Public API
    get value() {
        return this.getAttribute('value') || '';
    }

    set value(newValue) {
        const oldValue = this.value;
        this.setAttribute('value', newValue);
        
        if (oldValue !== newValue) {
            this.dispatchEvent(new CustomEvent('valueChanged', {
                detail: newValue,
                bubbles: true,
                composed: true
            }));
        }
    }

    get values() {
        return this.getAttribute('values') || '';
    }

    set values(newValues) {
        this.setAttribute('values', newValues);
    }

    // Private methods
    _handleReset() {
        this.value = '';
    }

    _handleSetValue() {
        this.value = this.$selector.value;
    }

    _populateOptions(values) {
        this.$selector.innerHTML = '';
        for (const val of values) {
            const option = document.createElement('option');
            option.value = val.trim();
            option.textContent = val.trim();
            this.$selector.appendChild(option);
        }
    }

    _render() {
        const hasValue = this.value !== '';
        
        this.$infoView.style.display = hasValue ? 'flex' : 'none';
        this.$formView.style.display = hasValue ? 'none' : 'flex';
        this.$valueInfo.textContent = this.value;
    }
}

// Register the custom element
customElements.define('rc-agile-voting', AgileVoting);
