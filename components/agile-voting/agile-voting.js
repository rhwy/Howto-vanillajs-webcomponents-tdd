(function(){
    //this is a log shortcut i use to activate only when needed
    //when you have a doubt about loading, uncomment the console.log
    //otherwise it will do nothing but the rest of the code don't need
    //to be changed ;)
    const log = (info) => {
        //console.log(info);
    }; 
    //create the template for our compotent
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
        :host {
            position:relative;
            display:flex;
            justify-content : center;
            align-items : center;
            width : 200px;
            height : 200px;
            background-color: black;
            color : white;
            border-radius : 5px;
        }
        #value {
            font-size: 4em;
        }
        #reset {
            font-size:1.5em;
            display:block;
            position:absolute;
            bottom:5px;
            right:5px;
            z-index:50;
        }
        #form {
            background-color : white;
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content : center;
            align-items : center;
        }
        #selector {
            display: block;
            font-size: 2em;
            font-weight: 700;
            color: #444;
            line-height: 2em;
            outline:none;
            box-sizing: border-box;
            width: 90%;
            max-width: 90%;
            margin: 0;
            padding:1px 10px 1px 10px;
            border: 1px solid #aaa;
            box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
            border-radius: .5em;
            -moz-appearance: none;
            -webkit-appearance: none;
            appearance: none;
            background-color: #fff;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
                linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
            background-repeat: no-repeat, repeat;
            background-position: right .7em top 50%, 0 0;
            background-size: 0.65em auto, 100%;
        } 

        #setValue {
            width:90%;
            border-radius : 10px;
            background-color:#EEE;
            box-sizing: border-box;
            text-align:center;
                    transition: all 0.2s;
            font-size: 2em;
            font-weight: 700;
            color: #444;
            line-height: 2em;
            outline:none;
            
        }
        #setValue:hover {
            background-color:#4eb5f1;
        }
    </style>
    <div id="form">
        <select id="selector">
        </select>
        <button id="setValue">vote!</button>
    </div>
    <div id="info">
        <span id="value"></span>
        <span id="reset">🔄</span>
    <div>`;

  //define the component class from HTMLElement inheritance
  class AgileVoting extends HTMLElement {
        constructor()
        {
            super(); //always call parent constructor
            //attach template to shadow root
            this.attachShadow({mode:'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            //bind functions to instance:
            this.render = this.render.bind(this);
            this.resetValue = this.resetValue.bind(this);
            this.setValueFromCombo = this.setValueFromCombo.bind(this);
            this.ensureFormShownIfNoValueSet = this.ensureFormShownIfNoValueSet.bind(this);
            //map elements to component variables for easier manipulation:
            this.$valueInfo = this.shadowRoot.querySelector('#value');
            this.$formView = this.shadowRoot.querySelector('#form');
            this.$selector = this.shadowRoot.querySelector('#selector');
            this.$buttonSet = this.shadowRoot.querySelector('#setValue');
            this.$infoView = this.shadowRoot.querySelector('#info');
            this.$buttonReset = this.shadowRoot.querySelector('#reset');
            log('AgileVoting component instantiated')
        }

        connectedCallback(){
            log('AgileVoting component loaded into the page')
            if(!this.hasAttribute('value')){
                this.setAttribute('value','');
            }
            if(!this.hasAttribute('values')){
                this.values = 'XS,S,M,L,XL,plop';
            } else {
                this.values = this.getAttribute('values');
                //this.DefineOptions(this.$values.split(','));
            }
            
            this.$buttonReset.addEventListener('click',this.resetValue)
            this.$buttonSet.addEventListener('click',this.setValueFromCombo);
            this.render();
        }
        disconnectedCallback(){
            this.$buttonReset.removeEventListener('click',this.resetValue)
            this.$buttonSet.removeEventListener('click',this.setValueFromCombo);
        }
        resetValue()
        {
            this.value = '';
        }
        setValueFromCombo()
        {
            this.value = this.$selector.value;
        }
        static get observedAttributes() {
            return ['value','values'];
        }
        ensureFormShownIfNoValueSet()
        {
            if(this.value != '')
            {
                this.$infoView.style.display = 'flex';
                this.$formView.style.display = 'none';
            } else {
                this.$infoView.style.display = 'none';
                this.$formView.style.display = 'flex';
            }
        }
        get value() {
            return this.getAttribute('value') || '';
        }
        set value(newValue) {
            this.setAttribute('value', newValue);
            this.render();
            var event = new CustomEvent('valueChanged',{'detail':newValue});
            this.dispatchEvent(event);
        }

        get values() {
            return this.getAttribute('values') || '';
        }
        set values(newValues) {
            this.setAttribute('values', newValues);
            const listOfValues = newValues.split(',');
            this.DefineOptions(listOfValues);
            this.render();
        }

        DefineOptions(values)
        {
            this.$selector.innerHTML = "";
            for(var j=0;j<values.length;j++)
            {
                const option = document.createElement('option');
                option.value = values[j];
                option.text = values[j];
                this.$selector.add(option);
            }
        }

        render()
        {
            this.ensureFormShownIfNoValueSet();
            this.$valueInfo.innerHTML = this.value;
        }
    }
    //register the component into the customElements list of the page
    customElements.define('rc-agile-voting',AgileVoting);
    log('rc-agile-voting defined in custom elements');

    //export the component in order to be able to use it programmatically in js
    module.exports = AgileVoting; 
})();