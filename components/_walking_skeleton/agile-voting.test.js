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
    describe('given I have a valid component in the page', () => {
        //first try to find the compoent in the document
        it('should find my component', () => {
            const component = document.querySelector('rc-agile-voting');
            expect(component).not.toBeNull();
        })

        //then considering you can load the component, try to query elements inside
        it('should be able to query elements inside my component', () => {
            const component = document.querySelector('rc-agile-voting');
            const valueElement = select(component,'.value');
            expect(valueElement).toBeDefined();
            expect(valueElement.innerHTML).toEqual('XL')
        })

        //then finally try to read value inside
        it('should be able read html inside an element of the compoent', () => {
            const component = document.querySelector('rc-agile-voting');
            const valueElement = select(component,'.value');
            const valueContent = valueElement.innerHTML;
            expect(valueContent).toEqual('XL')
        })
    });

    describe('given I want to programmatically use my component', () => {
        it('shoud be able to instantiate and use my component', () => {
            const component = new AgileVoting();
            expect(component).toBeDefined();
        })
    });
});