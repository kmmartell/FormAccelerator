
var form_fields=[];
var hidden_fields=[];
var fields=[];
var form_properties={};
$(function(){

	$.ajax({
      type:"get",
      url: "/doc/"+form_id,
    
      async: false,
      success:function(data){
      	form_properties={"parent_id":data["parent_id"], "name":data["name"], "description":data["description"]};
          $.each(data["fields"], function(k, v){

              if (v["generated"] || v["hidden"]){

                  hidden_fields.push(v);
              }
              else{
                  form_fields.push(v);
              }
          });
        fields=data;

      },
      error:function(){
        console.log("nothing returned");
      }
    })
	 fb = new Formbuilder({
        selector: '.fb-main',

        bootstrapData: form_fields
      });
fb.on('save', function(payload){
	console.log(payload);
	var all_fields=jQuery.parseJSON(payload).fields.concat(hidden_fields);
	console.log(all_fields);
         $.ajax({
           
            url: '/project/save',
            type: 'POST', 
    contentType: 'application/json', 
    data:JSON.stringify({"_id":form_id,
    "name":form_properties["name"],
    "description":form_properties["descriptions"],
                  "parent_id": form_properties["parent_id"],
                  "fields":all_fields
           }),
            success:function(data){
             console.log("Data " + data);
                if (data["error"]){
                    swal({"title":"Error", "text":"There was a problem saving the form to Cloudant.", "type":"error"});

                  }
            },
            error: function(){
               swal("Error", "This record could not be saved.", "error");
            },
            dataType:"json"
          });
            
      })
    });

