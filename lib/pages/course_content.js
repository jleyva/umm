(function() {

    $("#page-course_content").live('pagebeforeshow',function() {
                
        setupPage();
        logInfo("Page show fired");
        
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
                
        var contents = "";
        var cm = sessionStorage.getItem('current_cmid');
        
        if(cm !== null){
            
            cm = JSON.parse(cm);
                                   
            $("#modulename").html(cm.name);
                        
            if(cm.contents.length > 0){
                $.each(cm.contents, function(index,content){
                    var status = (index == 0)? 'data-collapsed="false"' : ''
                    contents += '<div data-role="collapsible" '+status+'>';
                    contents += ' <h3>Content '+(index+1)+'</h3><p>';
                    
                    if(content.filename){
                        contents += ' <p><b>Filename:</b> </p>';
                        contents += ' <div class="whiteroundtable">'+content.filename+'</div>';
                        contents += ' </p>';
                    }
                    
                    if(content.author){
                        contents += ' <p><b>Author:</b> '+content.author+'</p>';
                    }
                    
                    if(content.content){
                        contents += ' <p><b>Content information:</b> </p>';
                        contents += ' <div class="whiteroundtable">'+content.content+'</div>';
                        contents += ' </p>';
                    }
                    
                    if(content.license){
                        contents += ' <p><b>License:</b> '+content.license+'</p>';
                    }
                    
                    var token = "";                    
                    // TODO Improve this check
                    if(content.fileurl.indexOf('file.php/') > 0){
                        token = '?token='+mytoken;
                    }
                    
                    contents += '<a href="'+content.fileurl+token+'" rel="external" target="_blank" data-role="button">View content</a>';
                    contents += '</p></div>';
                    
                });
            }
            
            
            contents += '<a href="'+cm.url+'" rel="external" target="_blank" data-role="button">View activity in Moodle</a>';
                        
            $("#mcontents").html(contents);
            //$("#mcontents").page();
            //$('[data-role="content"]').page();
            $('[data-role="button"]').buttonMarkup();
            $('[data-role="collapsible"]').collapsible();
        }
        else{
            $.mobile.changePage("course_contents.html");
        }
  
            
    });
    
})();