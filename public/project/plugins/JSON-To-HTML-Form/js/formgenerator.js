
	// Create closure.
(function( $ ) {
 
    // Plugin definition.
    $.fn.formgenerator = function( options ) {
  
        var opts = $.extend( {}, $.fn.formgenerator.defaults, options );
        if (options["ajax"]){
        	ajax(options["ajax"]);
        }
       object=this;
       $.each($.fn.formgenerator.defaults.data, function(){
       		$(object).append(processItem(this));
       });

        



    };

    function processItem(o){
    	switch(o.field_type){
    		case "text":return processText(o);
    		break;
    		case "dropdown": return processSelect(o);
    		break;
            case "radio": return processRadio(o);
            break;
            case "checkbox": return processCheckbox(o);
            break;
    	}

    	
    }

    function processRadio(o){
        d=$.fn.formgenerator.defaults;
          div=$("<div>"); // Create form-group of item
          div.addClass("form-group");
          label=$("<label/>"); // Create label of item
          label.html(o[d.LABEL]);
          div.append(label);

      


        $.each(o.field_options.options, function(i, v){
            name=v["label"];
            checked=v["checked"];
            div_radio=$("<div>"); // Create form-group of item
             div_radio.addClass("radio");
            label=$("<label/>"); // Create label of item
    
                 input=$("<input/>");
                input.attr("type", "radio");
                input.attr("name", o[d.ID]);
                input.attr("id", o[d.ID]+i);
                input.val(name);
                if (checked){
                    input.attr("checked", "checked");
                }
                label.append(input);
                label.append(name);

                div_radio.append(label);
                  div.append(div_radio);


        });



        return div;



    }

    function processCheckbox(o){
        d=$.fn.formgenerator.defaults;
          div=$("<div>"); // Create form-group of item
          div.addClass("form-group");
          label=$("<label/>"); // Create label of item
          label.html(o[d.LABEL]);
          div.append(label);

      


        $.each(o.field_options.options, function(i, v){
            name=v["label"];
            checked=v["checked"];
            div_radio=$("<div>"); // Create form-group of item
             div_radio.addClass("radio");
            label=$("<label/>"); // Create label of item
    
                 input=$("<input/>");
                input.attr("type", "checkbox");
                input.attr("name", o[d.ID]+"[]");
                input.attr("id", o[d.ID]+i);
                input.val(name);
                if (checked){
                    input.attr("checked", "checked");
                }
                label.append(input);
                label.append(name);

                div_radio.append(label);
                  div.append(div_radio);


        });



        return div;



    }

    function processText(o){
    	d=$.fn.formgenerator.defaults;
    	var div=$("<div>"); // Create form-group of item
    	div.addClass("form-group");
    	if (o.hidden){
    		div.addClass("hidden");
    	}
    	else if (o.generated){
    		return;
    	}

    	label=$("<label/>"); // Create label of item
    	label.attr("for", o[d.ID]);
    	label.html(o[d.LABEL]);
    	div.append(label);

    	input=$("<input/>");
    	input.addClass("form-control");
    	input.attr("type", "text");
    	input.attr("name", o[d.ID]);
    	input.attr("id", o[d.ID]);

    	if (o.field_options && o.field_options.minlength){
    		input.attr("minlength", o.field_options.minlength);
    	}
    	if (o.field_options && o.field_options.maxlength){
    		input.attr("maxlength", o.field_options.maxlength);
    	}
    	


    	if (o.required){
    		input.addClass("form-control");
    	}

    	div.append(input);

    	if (o.field_options && o.field_options.description){
    		desc=$("<span>");
    		desc.addClass("help-block");
    		desc.html(o.field_options.description);
    		div.append(desc);
    	}


    

    	return div;
    }

    function processSelect(o){
    	d=$.fn.formgenerator.defaults;
    	var div=$("<div>"); // Create form-group of item
    	div.addClass("form-group");
    	if (o.hidden){
    		div.addClass("hidden");
    	}
    	else if (o.generated){
    		return;
    	}

    	label=$("<label/>"); // Create label of item
    	label.attr("for", o[d.ID]);
    	label.html(o[d.LABEL]);
    	div.append(label);

    	input=$("<select/>");
    	input.addClass("form-control");
   
    	input.attr("name", o[d.ID]);
    	input.attr("id", o[d.ID]);

    	if (o.required){
    		input.addClass("form-control");
    	}

    	// Process each of the options available for this drop down
    	if (o.field_options.include_blank_option){
    		option=$("<option>");
    		option.val("");
    		option.html(d.BLANK_OPTION_TEXT);
    		input.append(option);
    	}
    	$.each(o.field_options.options, function(i, v){
            label=v["label"];
            checked=v["checked"];
    			option=$("<option/>");
    			option.val(label);
    			option.html(label);
    			if (checked){
    				option.attr("checked", "checked");
    			}
    			input.append(option);

    	});

    	div.append(input);
    

    	return div;
    }

    function ajax(ajax_url){
    		json={"_id":"formA","_rev":"70-0638e69e1f9e3c9a763d2cdcf0914518","parent_id":"projectcat","properties":{"name":"Project Cat"},"fields":[{"label":"Cat Name","field_type":"text","required":"true","field_options":{"size":"large","description":"The name of the animal.","maxlength":"100","minlength":"3"},"cid":"c6"},{"label":"Is Neutered?","field_type":"radio","required":"true","field_options":{"options":[{"label":"Yes","checked":"false"},{"label":"No","checked":"true"}]},"cid":"c14"},{"label":"Owner of Cat","field_type":"text","required":"true","field_options":{"size":"large","description":"Please include the first and last name of the owner.","minlength":"5","maxlength":"100"},"cid":"c18"},{"label":"Cat Adoption Date","field_type":"date","required":"true","field_options":{"description":"Please list the date the cat was adopted in mm / dd / yyyy format"},"cid":"c22"},{"label":"Owner's Address","field_type":"address","required":"true","field_options":{"description":"The above should be the owner of the cat"},"cid":"c30"},{"label":"Type of Cat","field_type":"dropdown","required":"true","field_options":{"options":[{"label":"Tabby","checked":"false"},{"label":"Mixed","checked":"false"},{"label":"Ragdoll","checked":"false"}],"include_blank_option":"true"},"cid":"c36"},{"label":"ID","field_type":"text","hidden":"true","cid":"_id"},{"label":"Created By","field_type":"text","generated":"true","cid":"created_by"},{"label":"Updated By","field_type":"text","generated":"true","cid":"updated_by"},{"label":"Updated On","field_type":"text","generated":"true","cid":"updated_on"},{"label":"Created On","field_type":"text","generated":"true","cid":"created_on"}]};

    		$.fn.formgenerator.defaults.data=json["fields"];
    	
    	/*
    	$.ajax({
    		type:"GET",
    		dataType:"json",
    		async:false,
    		url: ajax_url,
    		success:function(json_data){

    			$.fn.formgenerator.defaults.data=json_data["fields"];
    			console.dir($.fn.formgenerator.defaults.data);
    		}

    	});
			*/

    }

    $.fn.formgenerator.defaults = {
    	data:[],
	    ID:"cid",
	    LABEL:"label",
	    BLANK_OPTION_TEXT:"Select one"
	};
 
  
 
})( jQuery );