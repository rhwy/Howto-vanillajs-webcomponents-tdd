/* 
*  <rc-agile-voting/> component tests
*  (c) 2020 Rui Carvalho
*/
//load node libraries to be able to read files content
const fs = require('fs');
const path = require('path');
//load the html content of our test host document 
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
const AgileVoting = require('./agile-voting.js');
const select = (comp,name) => comp.shadowRoot.querySelector(name);

//start our test suite
describe('<rc-agile-voting/>', () => {

    //helper to expose once for all the inner elements of the component
    function extractElements(componentName){
        const component = document.querySelector(componentName);
        return {
          component,
          form : select(component,'#form'),
          info : select(component,'#info'),
          value : select(component,'#value'),
          selector : select(component,'#selector'),
          setvalue : select(component,'#setValue'),
          reset : select(component, '#reset')
        };
    }
    //setup the test suite:
    //before each test run fill the current test document with the content
    //of our test document
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });
   
    //scenario with a component with a valid value
    describe('given I have a component with valid value', () => {
        //first try to find the component in the document
        it('should find my component', () => {
            const {component} = extractElements('#with-value-set');
            expect(component).not.toBeNull();
        })

        it('should have value set', () => {
            const {component} = extractElements('#with-value-set');
            expect(component.value).toEqual('XS');
        });

        it('should show initial value set in html', () => {
            const {value} = extractElements('#with-value-set');
            expect(value.innerHTML).toEqual('XS');
        });

        it('should show value set programmatically', () => {
            const {component,value} = extractElements('#with-value-set');
            component.value = 'M';
            expect(value.innerHTML).toEqual('M');
        });

        it('should reset value when icon clicked', () => {
            const {component,reset} = extractElements('#with-value-set');
            reset.click();
            expect(component.value).toEqual('');
        });

        it('should switch views when icon clicked', () => {
            const {info,form,reset} = extractElements('#with-value-set');
            reset.click();
            expect(form.style.display).not.toEqual('none');
            expect(info.style.display).toEqual('none');    
        });
    });

    describe('given I have a component without valid value', () => {

        it('should show form view when no value set', () => {
            const {component,info,form} = extractElements('#with-value-not-set');
            expect(component.value).toEqual('');
            expect(form.style.display).not.toEqual('none');
            expect(info.style.display).toEqual('none'); 
            
        })
        it('should show elements to select value',() => {
            const {selector,reset} = extractElements('#with-value-not-set');
            expect(selector).not.toBeNull();  
            expect(reset).not.toBeNull();   
        });

        describe('when I select a value',() => {
            it('it sets the value on the component',() => {
                const {component,selector,setvalue} = extractElements('#with-value-not-set');
                selector.value = 'M';
                setvalue.click();
                expect(component.value).toEqual('M');
            })

            it('it shows the info view',() => {
                const {selector,info,form,setvalue} = extractElements('#with-value-not-set');
                selector.value = 'M';
                setvalue.click();
                expect(form.style.display).toEqual('none');
                expect(info.style.display).not.toEqual('none');
            });

            it('throws an event "valueChanged"', () => {
                const {component,selector,setvalue} = extractElements('#with-value-not-set');
                var valueFromEvent = "";
                component.addEventListener('valueChanged',(e) => {
                    valueFromEvent = e.detail;
                });
                selector.value = 'M';
                setvalue.click();
                expect(valueFromEvent).toEqual('M');
            });

        })
    });

    describe('I need to integrate my component in something else', () => {

        it('should create programmaticaly my component',()=> {
            const component = new AgileVoting();
            var valueFromEvent = "";
            component.addEventListener('valueChanged',(e) => {
                valueFromEvent = e.detail;
            });
            expect(component.value).toEqual('');
            component.value = 'XL';
            expect(valueFromEvent).toEqual('XL');
        });

        it('should set the possible values programmaticaly', () => {
            const component = new AgileVoting();
            const selector = select(component,'#selector');
            component.DefineOptions(['small','medium','big']);
            var valueFromEvent = "";
            component.addEventListener('valueChanged',(e) => {
                valueFromEvent = e.detail;
            });
            component.value = selector.options[1].value;
            expect(valueFromEvent).toEqual('medium'); 
        })
    });
}); 




