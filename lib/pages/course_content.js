           
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
                    
                    contents += '<a href="#" data-slow="'+content.fileurl+token+'" rel="external" target="_blank" data-role="button">View content</a>';
                    contents += '</p></div>';
                    
                });
            }
            
            
            contents += '<a href="#" data-slow="'+cm.url+'" data-role="button" rel="external" target="_blank">View activity in Moodle</a>';
            
            $("#mcontents").html(contents);
            
            // This is an uggly bug:
            // if an external link is open in a mobile browser when the link button effects ends the browser app is sent to background and umm is sent to foreground
            // This is (I suppose) because the mobile detects some activity in the umm app            
            
            // Putting a # in href prevents animations so we inter-change href with data-slow attr
            $("[data-slow]").click(function(event){
                $(this).attr('href',$(this).attr('data-slow'));
            });
            
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