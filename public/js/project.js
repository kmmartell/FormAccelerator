
var tables={};

$(function(){
  console.log("Start ");
  createTable("formA");


});


  function cancel(){
    $("#tables, .form_wrapper").show();
     $("#document-forms").hide();

  }


  function createTable(id){
    createFilters(id);
    var json_data;
    var columns;
    $.ajax({
      type:"get",
      url: "/table/records/"+id,
      dataType:"json",
      async: false,
      success:function(data){
        columns=data["columns"];
        console.log(columns);

      },
      error:function(){
        console.log("nothing returned");
      }
    })
    console.log('#table_'+id);
    tables[id]=$('#table_'+id).DataTable( {
        "dom": '<"toolbar"><"top"ilf>rt<"bottom"Tp><"clear">',
       "tableTools": {
            "aButtons": [
                "copy",
                "print",
                "csv",
                "pdf"
                
            ]
        },
        "columns": columns,
        "ajax": "/table/records/formA"
    } );
    $("div.toolbar").html('<a class="active" onclick="toggleTable(\''+id+'\')"><span class="glyphicon glyphicon-th-list"></span> <span class="glyphicon glyphicon-resize-horizontal"></span> <span class="glyphicon glyphicon-th"></span> Toggle Table/List</a>');

  }

  function filterColumn(form_id, cid){
    console.log("Form "+form_id +" CID "+cid);
    console.log($('#col_'+cid+'_filter').val())
     tables[form_id].column(".col_"+cid).search(
        $('#col_'+cid+'_filter').val()
    ).draw();
  }

  function toggleTable(id){
      if ($("#table_"+id).dataTable().api().column( 0).visible()){
       
      $("#table_"+id).dataTable().api().columns( ).visible( true );
       $("#table_"+id).dataTable().api().column(0).visible( false );
      }
      else{
        
      $("#table_"+id).dataTable().api().columns().visible( false );
        $("#table_"+id).dataTable().api().column(0).visible( true );
      }
      
  }
  // Assign values in array to id's of fields given
  function valToFields(data){

    $.each(data, function(key, value){
        $("#"+key).val(value);
        
    })

  }
    function createFilters(form_id){
      $.ajax({
            type:"GET",
            url: '/project/filters/'+form_id,
            
            success:function(data){
              $("#filters").html(data);
              $("#filters input").keyup(function(){
                  filterColumn(form_id, $(this).attr("column_id"));
              });
              $("#filters select").change(function(){
                  filterColumn(form_id, $(this).attr("column_id"));
              })
                
            },
            error: function(){
              console.log("Filters loading errors");
            }
        });
       
    }

   function viewRecord(record_id){
    
      $("#tables, .form_wrapper").hide();

     $.ajax({
            type:"GET",
            url: '/project/record/view/'+record_id,
            
            success:function(data){
                console.log("Success");
                
                 $("#doc-form").html(data);
                  $("#document-forms").fadeIn();
            },
            error: function(){
               swal("Error", "This record was not found.", "error");
               $("#tables, .form_wrapper").show();
            }
        });
       
         
  }

  function editRecord(record_id){
    $("#tables, .form_wrapper").hide();

    console.log('/project/edit/'+record_id);
     $.ajax({
            type:"GET",
            url: '/project/edit/'+record_id,
            
            success:function(data){
                console.log("Success");
                
                 $("#doc-form").html(data);
                  $("#document-forms").fadeIn();
            },
            error: function(){
               swal("Error", "This record was not found.", "error");
               $("#tables, .form_wrapper").show();
            }
        });
   

  }

  function createRecord(project_id, form_id){
    console.log(project_id + " "+form_id);
    
       
   if (project_id && form_id){
    $("#tables, .form_wrapper").hide();

    console.log('/project/'+project_id+"/form/"+form_id+"/create");
     $.ajax({
            type:"GET",
            url: '/project/'+project_id+"/form/"+form_id+"/create",
            
            success:function(data){
                console.log("Success");
                
                 $("#doc-form").html(data);
                  $("#document-forms").fadeIn();
            },
            error: function(){
               swal("Error", "This record was not found.", "error");
               $("#tables, .form_wrapper").show();
            }
        });
    }
   

  }

  function deleteRecord(record_id){
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
            url: '/project/delete/'+record_id,
            success:function(data){
              console.dir(data);
              if (data["ok"]){
                   swal("Deleted!", "This record has been deleted.", "success");
                   cancel();
                   //tables[form_id].ajax.reload();
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

  function save(project_id, form_id, record_id, type){
    console.log(project_id, form_id, record_id);
   
   $("#form_"+form_id).validate();
    var errors =$(".error").length;
    console.log(errors);
    
   form_arr=$("#form_"+form_id).serializeArray();
 
   form_json={};
   $.each(form_arr, function (i, v){
      form_json[v["name"]]=v["value"];
   });
   if (!type){
    form_json["type"]="record";
   }
   else{
    form_json["type"]=type;
   }
   
   form_json["parent_id"]=form_id;

  
   if (!record_id){
      delete form_json["_id"];
      form_json["created_on"]= new Date();
      form_json["created_by"]= "test@crazy";
   }
   else{
    form_json["_id"]=record_id;
     form_json["updated_by"]="test@crazy";
   form_json["updated_on"]=new Date();
   }
   
   console.dir(form_json);
   console.log("Errors "+errors);

    if (errors==0){
      console.log("Saving...");
        $.ajax({
           
            url: '/project/save',
            type: 'POST', 
    contentType: 'application/json', 
    data: JSON.stringify(form_json),
           
            success:function(data){
             console.log("Data " + data);
                if (data["ok"]){
                    swal("Saved", "Your record has been saved successfully.", "success");
                    cancel();
                  if (type=="record"){
                        tables[form_id].ajax.reload(); // Reload the data tables table
               
                  }
                  else if (type=="project"){
                    location.href='/dashboard/'+data["_id"];
                  }
                }
                else{
                  swal("Error", "This record could not be saved.", "error");
                }

               
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