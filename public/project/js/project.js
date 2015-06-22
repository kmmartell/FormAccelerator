
  function createTable(id){
    tables[id]=$('#table_'+this).DataTable( {
        "dom": '<"top"ilf>rt<"bottom"Tp><"clear">',
       "tableTools": {
            "aButtons": [
                "copy",
                "print",
                "csv",
                "pdf"
                
            ]
        },
        "columns": [
            { "data": "main_header", "ordering":false}

           
            ],
        "ajax": '/table/records/'+form_id
    } );

  }

  // Assign values in array to id's of fields given
  function valToFields(data){

    $.each(data, function(key, value){
        $("#"+key).val(value);
        
    })

  }

   function viewRecord(form_id, record_id){
    
      editRecord(form_id, record_id);
      $("form.form").addClass("readonly");
       
         
  }

  function editRecord(form_id, record_id){
    
       $("#tables, .form_wrapper").hide();
    $("form.form").removeClass("readonly");
    if (record_id){
     $.ajax({
            type:"POST",
            url: 'php/datasources/'+datasource+'/view.php',
            data: {"_id":record_id},
            success:function(data){
                 console.log(data);
                 valToFields(data);
                 $("#document-forms, #form_wrapper_"+form_id).fadeIn();
            },
            error: function(){
               swal("Error", "This record was not found.", "error");
               $("#tables, .form_wrapper").show();
            },
            dataType:"json"
        });
    }
    else{
      clearFields();
       $("#document-forms, #form_wrapper_"+form_id).fadeIn();
       $("#parent_id").val(form_id);
    }
       

  }

  function deleteRecord(form_id, record_id){
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      function(){
        $.ajax({
            type:"POST",
            url: 'php/datasources/'+datasource+'/delete.php',
            data: {"_id":record_id},
            success:function(data){
              console.dir(data);
              if (data["ok"]){
                   swal("Deleted!", "This record has been deleted.", "success");
                   tables[form_id].ajax.reload();
              }
              else{
                  swal("Unsuccessful", "This record could not be deleted.", "error");
              }
                
               
            },
            error: function(){
               swal("Error", "This record could not be deleted.", "error");
            },
            dataType:"json"
        });
       
      });

    
  }
  function clearFields(){
    $("form.form input, form.form select, form.form textarea").val("");
  }

  function cancel(){
      $("#document-forms, .form_wrapper").hide();
    $("#tables").fadeIn();
    clearFields();
  }

  function save(form_id){
    /*
     $("#document-forms, .form_wrapper").hide();

    $("#tables").fadeIn();
    */
    $("#commentForm").validate();
    var errors =$("#error").length;
   
   form_arr=$("#form_"+form_id).serializeArray();
   form_json={};
   $.each(form_arr, function (i, v){
      form_json[v["name"]]=v["value"];
   });

   form_json["type"]="record";
   form_json["parent_id"]=form_id;
  
   if (!form_json["_id"] || form_json["_id"]==""){
      form_json["created_on"]= new Date();
      form_json["created_by"]= user_id;
   }
   else{
     form_json["updated_by"]=user_id;
   form_json["updated_on"]=new Date();
   }
   
   console.dir(form_json);

    if (errors==0){
        $.ajax({
              type:"POST",
              url: 'php/datasources/'+datasource+'/save.php',
              data: form_json,
             
              success:function(data){
                  if (data["ok"]){
                      swal("Saved", "Your record has been saved successfully.", "success");
                      cancel();
                      tables[form_id].ajax.reload(); // Reload the data tables table
                  }
                  else{
                    swal("Error", "This record could not be saved.", "error");
                  }

                  console.dir(data);
                 
                
                 
              },
              error: function(){
                 swal("Error", "This record could not be saved.", "error");
              },
              dataType:"json"
          });
    }
    else{
      swal("Review Form", "Please review the fields in this form to ensure you have answered all required.", "warning");
    }
        
   

  }