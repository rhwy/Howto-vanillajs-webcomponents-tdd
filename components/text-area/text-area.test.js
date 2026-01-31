/**
 * Tests for <rc-text-area/> web component
 * Using Web Test Runner with Chai assertions
 */
import { expect } from '@esm-bundle/chai';
import './text-area.js';
import { RcTextArea } from './text-area.js';

// Helper to query inside shadow DOM
const select = (component, selector) => component.shadowRoot.querySelector(selector);

// Helper to create and mount a component
const createComponent = (attrs = {}) => {
    const component = document.createElement('rc-text-area');
    for (const [key, value] of Object.entries(attrs)) {
        component.setAttribute(key, value);
    }
    document.body.appendChild(component);
    return component;
};

// Helper to simulate typing
const typeText = (component, text) => {
    const textarea = select(component, '#textarea');
    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
};

// Clean up after each test
const cleanup = () => {
    document.body.innerHTML = '';
    // Clear any localStorage keys we may have set
    localStorage.removeItem('test-storage');
    localStorage.removeItem('draft-key');
};

describe('<rc-text-area/>', () => {

    afterEach(() => {
        cleanup();
    });

    describe('Component Registration', () => {
        it('should be registered as a custom element', () => {
            expect(customElements.get('rc-text-area')).to.exist;
        });

        it('should be an instance of RcTextArea', () => {
            const component = createComponent();
            expect(component).to.be.instanceOf(RcTextArea);
        });

        it('should have shadow DOM', () => {
            const component = createComponent();
            expect(component.shadowRoot).to.exist;
        });
    });

    describe('Default State', () => {
        let component;

        beforeEach(() => {
            component = createComponent();
        });

        it('should have empty value by default', () => {
            expect(component.value).to.equal('');
        });

        it('should have default max-chars of 280', () => {
            expect(component.maxChars).to.equal(280);
        });

        it('should show 0/280 counter', () => {
            const counter = select(component, '#counter');
            expect(counter.textContent).to.equal('0/280');
        });

        it('should have textarea element', () => {
            const textarea = select(component, '#textarea');
            expect(textarea).to.not.be.null;
            expect(textarea.tagName).to.equal('TEXTAREA');
        });
    });

    describe('Label and Placeholder', () => {
        it('should display label when provided', () => {
            const component = createComponent({ label: 'Your Message' });
            const label = select(component, '#label');
            expect(label.textContent).to.equal('Your Message');
        });

        it('should set placeholder on textarea', () => {
            const component = createComponent({ placeholder: 'Type here...' });
            const textarea = select(component, '#textarea');
            expect(textarea.placeholder).to.equal('Type here...');
        });
    });

    describe('Character Counting', () => {
        let component;

        beforeEach(() => {
            component = createComponent({ 'max-chars': '100' });
        });

        it('should count characters as you type', () => {
            typeText(component, 'Hello');
            expect(component.charCount).to.equal(5);
            
            const counter = select(component, '#counter');
            expect(counter.textContent).to.equal('5/100');
        });

        it('should calculate remaining characters', () => {
            typeText(component, 'Hello World');
            expect(component.charsRemaining).to.equal(89);
        });

        it('should update progress bar', () => {
            typeText(component, 'A'.repeat(50));
            const progress = select(component, '#progress');
            expect(progress.style.width).to.equal('50%');
        });
    });

    describe('Visual States', () => {
        let component;

        beforeEach(() => {
            component = createComponent({ 'max-chars': '100' });
        });

        it('should show warning state at 80%', () => {
            typeText(component, 'A'.repeat(80));
            
            const textarea = select(component, '#textarea');
            const counter = select(component, '#counter');
            const progress = select(component, '#progress');
            
            expect(textarea.classList.contains('warning')).to.be.true;
            expect(counter.classList.contains('warning')).to.be.true;
            expect(progress.classList.contains('warning')).to.be.true;
        });

        it('should show danger state at 100%', () => {
            typeText(component, 'A'.repeat(100));
            
            const textarea = select(component, '#textarea');
            const counter = select(component, '#counter');
            const progress = select(component, '#progress');
            
            expect(textarea.classList.contains('danger')).to.be.true;
            expect(counter.classList.contains('danger')).to.be.true;
            expect(progress.classList.contains('danger')).to.be.true;
        });

        it('should remove warning when under 80%', () => {
            typeText(component, 'A'.repeat(80));
            typeText(component, 'A'.repeat(50));
            
            const textarea = select(component, '#textarea');
            expect(textarea.classList.contains('warning')).to.be.false;
        });
    });

    describe('Character Limit Enforcement', () => {
        it('should truncate input exceeding max-chars', () => {
            const component = createComponent({ 'max-chars': '10' });
            typeText(component, 'This is way too long');
            
            expect(component.value).to.equal('This is wa');
            expect(component.charCount).to.equal(10);
        });
    });

    describe('Events', () => {
        it('should fire input event on typing', (done) => {
            const component = createComponent();
            
            component.addEventListener('input', (e) => {
                expect(e.detail.value).to.equal('Hello');
                expect(e.detail.charCount).to.equal(5);
                done();
            });
            
            typeText(component, 'Hello');
        });

        it('should fire limitReached when limit is hit', (done) => {
            const component = createComponent({ 'max-chars': '5' });
            
            component.addEventListener('limitReached', (e) => {
                expect(e.detail.value).to.equal('Hello');
                expect(e.detail.maxChars).to.equal(5);
                done();
            });
            
            typeText(component, 'Hello');
        });

        it('should only fire limitReached once until under limit', () => {
            const component = createComponent({ 'max-chars': '5' });
            let fireCount = 0;
            
            component.addEventListener('limitReached', () => {
                fireCount++;
            });
            
            typeText(component, 'Hello');
            typeText(component, 'Hello'); // Type again at limit
            
            expect(fireCount).to.equal(1);
        });
    });

    describe('localStorage Persistence', () => {
        it('should save to localStorage when storage-key is set', (done) => {
            const component = createComponent({ 'storage-key': 'test-storage' });
            
            typeText(component, 'Saved text');
            
            // Wait for debounced save
            setTimeout(() => {
                const saved = localStorage.getItem('test-storage');
                expect(saved).to.equal('Saved text');
                done();
            }, 600);
        });

        it('should load from localStorage on mount', () => {
            localStorage.setItem('draft-key', 'Previously saved');
            
            const component = createComponent({ 'storage-key': 'draft-key' });
            
            expect(component.value).to.equal('Previously saved');
        });

        it('should clear localStorage when clear() is called', (done) => {
            const component = createComponent({ 'storage-key': 'test-storage' });
            typeText(component, 'Some text');
            
            setTimeout(() => {
                component.clear();
                expect(localStorage.getItem('test-storage')).to.be.null;
                expect(component.value).to.equal('');
                done();
            }, 600);
        });
    });

    describe('Programmatic API', () => {
        it('should set value programmatically', () => {
            const component = createComponent();
            component.value = 'Set by code';
            
            expect(component.value).to.equal('Set by code');
            expect(select(component, '#textarea').value).to.equal('Set by code');
        });

        it('should update counter when value is set programmatically', () => {
            const component = createComponent({ 'max-chars': '50' });
            component.value = 'Hello';
            
            const counter = select(component, '#counter');
            expect(counter.textContent).to.equal('5/50');
        });

        it('should focus textarea with focus()', () => {
            const component = createComponent();
            component.focus();
            
            const textarea = select(component, '#textarea');
            expect(component.shadowRoot.activeElement).to.equal(textarea);
        });
    });
});
