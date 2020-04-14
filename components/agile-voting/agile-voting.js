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
        .value {
            font-size: 4em;
        }
        .reset {
            font-size:1.5em;
            display:block;
            position:absolute;
            bottom:5px;
            right:5px;
            z-index:50;
        }
    </style>
    
    <div id="main">
        <span class="value">XL</span>
        <span class="reset">🔄</span>
    <div>`;

  //define the component class from HTMLElement inheritance
  class AgileVoting extends HTMLElement {
        constructor()
        {
            super(); //always call parent constructor
            //attach template to shadow root
            this.attachShadow({mode:'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            log('AgileVoting component instantiated')
        }

connectedCallback(){
    log('AgileVoting component loaded into the page')
    if(!this.hasAttribute('value')){
        this.setAttribute('value','');
    }
}
get value() {
    return this.getAttribute('value');
}
set value(newValue) {
    this.setAttribute('value', newValue);
}
    }
    //register the component into the customElements list of the page
    customElements.define('rc-agile-voting',AgileVoting);
    log('rc-agile-voting defined in custom elements');

    
    //export the component in order to be able to use it programmatically in js
    module.exports = AgileVoting; 
})();