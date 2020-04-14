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

    //setup the test suite:
    //before each test run fill the current test document with the content
    //of our test document
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });
   
    //start our scenario:
    describe('given I have a component with valid value', () => {
        //first try to find the component in the document
        it('should find my component', () => {
            const component = document.querySelector('#with-value-set');
            expect(component).not.toBeNull();
        })

        it('should have value set', () => {
            const component = document.querySelector('#with-value-set');
            expect(component.value).toEqual('XL');
        })

    });
});