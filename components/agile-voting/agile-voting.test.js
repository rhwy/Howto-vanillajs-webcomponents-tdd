/**
 * Tests for <rc-agile-voting/> web component
 * Using Web Test Runner with Chai assertions
 */
import { expect } from '@esm-bundle/chai';
import './agile-voting.js';
import { AgileVoting } from './agile-voting.js';

// Helper to query inside shadow DOM
const select = (component, selector) => component.shadowRoot.querySelector(selector);

// Helper to create and mount a component
const createComponent = (attrs = {}) => {
    const component = document.createElement('rc-agile-voting');
    for (const [key, value] of Object.entries(attrs)) {
        component.setAttribute(key, value);
    }
    document.body.appendChild(component);
    return component;
};

// Helper to clean up after each test
const cleanup = () => {
    document.body.innerHTML = '';
};

describe('<rc-agile-voting/>', () => {

    afterEach(() => {
        cleanup();
    });

    describe('Component Registration', () => {
        it('should be registered as a custom element', () => {
            expect(customElements.get('rc-agile-voting')).to.exist;
        });

        it('should be an instance of AgileVoting', () => {
            const component = createComponent();
            expect(component).to.be.instanceOf(AgileVoting);
        });
    });

    describe('Given a component with a value set', () => {
        let component;

        beforeEach(() => {
            component = createComponent({ value: 'XS' });
        });

        it('should find my component in the DOM', () => {
            expect(document.querySelector('rc-agile-voting')).to.not.be.null;
        });

        it('should have value set', () => {
            expect(component.value).to.equal('XS');
        });

        it('should show initial value in the info view', () => {
            const valueElement = select(component, '#value');
            expect(valueElement.textContent).to.equal('XS');
        });

        it('should show the info view and hide the form view', () => {
            const infoView = select(component, '#info');
            const formView = select(component, '#form');
            expect(infoView.style.display).to.equal('flex');
            expect(formView.style.display).to.equal('none');
        });

        it('should update value when set programmatically', () => {
            component.value = 'M';
            const valueElement = select(component, '#value');
            expect(valueElement.textContent).to.equal('M');
        });

        it('should reset value when reset icon is clicked', () => {
            const resetButton = select(component, '#reset');
            resetButton.click();
            expect(component.value).to.equal('');
        });

        it('should switch to form view when reset is clicked', () => {
            const resetButton = select(component, '#reset');
            resetButton.click();
            
            const infoView = select(component, '#info');
            const formView = select(component, '#form');
            expect(formView.style.display).to.not.equal('none');
            expect(infoView.style.display).to.equal('none');
        });
    });

    describe('Given a component without a value set', () => {
        let component;

        beforeEach(() => {
            component = createComponent();
        });

        it('should have empty value', () => {
            expect(component.value).to.equal('');
        });

        it('should show the form view and hide the info view', () => {
            const infoView = select(component, '#info');
            const formView = select(component, '#form');
            expect(formView.style.display).to.not.equal('none');
            expect(infoView.style.display).to.equal('none');
        });

        it('should have selector and button elements', () => {
            const selector = select(component, '#selector');
            const button = select(component, '#setValue');
            expect(selector).to.not.be.null;
            expect(button).to.not.be.null;
        });

        it('should have default voting options', () => {
            const selector = select(component, '#selector');
            const options = selector.querySelectorAll('option');
            expect(options.length).to.equal(5);
            expect(options[0].value).to.equal('XS');
            expect(options[4].value).to.equal('XL');
        });
    });

    describe('When selecting a value', () => {
        let component;

        beforeEach(() => {
            component = createComponent();
        });

        it('should set the component value when vote button is clicked', () => {
            const selector = select(component, '#selector');
            const button = select(component, '#setValue');
            
            selector.value = 'M';
            button.click();
            
            expect(component.value).to.equal('M');
        });

        it('should switch to info view after voting', () => {
            const selector = select(component, '#selector');
            const button = select(component, '#setValue');
            
            selector.value = 'L';
            button.click();
            
            const infoView = select(component, '#info');
            const formView = select(component, '#form');
            expect(formView.style.display).to.equal('none');
            expect(infoView.style.display).to.not.equal('none');
        });

        it('should fire valueChanged event', (done) => {
            const selector = select(component, '#selector');
            const button = select(component, '#setValue');
            
            component.addEventListener('valueChanged', (e) => {
                expect(e.detail).to.equal('XL');
                done();
            });
            
            selector.value = 'XL';
            button.click();
        });
    });

    describe('Custom voting options', () => {
        it('should accept custom values via attribute', () => {
            const component = createComponent({ values: '1,2,3,5,8,13' });
            const selector = select(component, '#selector');
            const options = selector.querySelectorAll('option');
            
            expect(options.length).to.equal(6);
            expect(options[0].value).to.equal('1');
            expect(options[5].value).to.equal('13');
        });

        it('should update options when values property changes', () => {
            const component = createComponent();
            component.values = 'A,B,C';
            
            const selector = select(component, '#selector');
            const options = selector.querySelectorAll('option');
            
            expect(options.length).to.equal(3);
            expect(options[0].value).to.equal('A');
        });
    });

    describe('Programmatic usage', () => {
        it('should be instantiable via constructor', () => {
            const component = new AgileVoting();
            expect(component).to.be.instanceOf(HTMLElement);
        });

        it('should fire events when value changes programmatically', (done) => {
            const component = createComponent();
            
            component.addEventListener('valueChanged', (e) => {
                expect(e.detail).to.equal('S');
                done();
            });
            
            component.value = 'S';
        });
    });
});
