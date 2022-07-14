/*** 
A simple micro-binding library for use with jQuery and Handlerbars.
bond uses convention over configuration. The name of your element must match the model property. If your element is a div and contains child elements, bond assumes that is a handlebars template and will try to render it.
https://github.com/hattan/bond.js
***/
const bond = {
	_templates : {},
	_getTemplate : function(name,source){
			let template = null,
					templates = bond._templates;
			if(templates[name] != undefined){
			  template = templates[name];
			}
			else{
				template = Handlebars.compile(source);
				templates[name]=template;
			}
			return template;
	},
	bind : function(model){
		let handler = {
    		set: function(target, prop, value, receiver) {
           		model.handleModelChange(prop,value);
    			return true;
    		}
		};

		return new Proxy(model,handler);
	},
	Create : function(cb){
		let model = new bond.Model(cb);
		return bond.bind(model);
	},
	Model : function(cb){
		function is($elem,type){
 			return ($elem.tagName.toLowerCase() == type);
		}
		function isDiv($elem){
			return is($elem,"div");
		}
        function isTable($elem){
			return is($elem,"table");
		}
		function isInput($elem){
			return is($elem,"input");
		}		
		function processDiv($elem,name,value){
            if ($elem.childNodes.length > 0) {
                let source = $elem.innerHTML,
                template = bond._getTemplate(name,source);

                let html = template(value);
                $elem.innerHTML=html;
            }
            else{
				$elem.innerHTML=value;		
            }
		}
		function handleModelChange(name,value){
			let $elem = document.getElementById(name);
			if(isDiv($elem)){
				processDiv($elem,name,value);
			}
			else if(isInput($elem)){
				$elem.val(value);
			}
			if(cb!=undefined)
				cb();  
    	}
  		this.handleModelChange = handleModelChange;
	}
};

//Handlerbars helper
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper('getclass', function(item, options) {
	if (item.current)
	  return "green bold"
 });