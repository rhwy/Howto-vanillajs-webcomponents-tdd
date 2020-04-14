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
        .value {
            font-size: 2em;
        }
    </style>
    
    <div id="main">
        <span class="value">XL</span>
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
            //nothing for now but it's where you do the main stuff after
            //component is initialized and loaded into the document
            log('AgileVoting component loaded into the page')
        }
    }
    //register the component into the customElements list of the page
    customElements.define('rc-agile-voting',AgileVoting);
    log('rc-agile-voting defined in custom elements');

    //this is just to avoid errors in console when viewing the html page in a browser
    if(module==undefined || module == null)
    {
        module = {};
    }
    //export the component in order to be able to use it programmatically in js
    module.exports = AgileVoting;
})();