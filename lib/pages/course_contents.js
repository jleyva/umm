(function() {

    var sectionsData = {};

    $("#page-course_contents").live('pageshow',function() {
                
        setupPage();
        logInfo("Page show fired");
        
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
        
        function showContents(sections){            
            $('#lsections').empty();
            $.each(sections, function(index,section){                                
                $("#lsections").append('<li data-role="list-divider">'+section.name+'</li>');
                if(section.summary){
                    // jQuery style entity decode
                    var secionText = $('<div />').html(section.summary).text();                                                        
                    secionText = secionText.replace(/src\s*=\s*"([^"]+)"/,'src = "$1?token='+mytoken+'"');

                    $("#lsections").append('<li">'+secionText+'</li>');
                }
                if(section.modules){
                    $.each(section.modules, function(index,module){
                        if(module.modname == 'label'){
                            // jQuery style entity decode
                            var labelText = $('<div />').html(module.name).text();                                                        
                            labelText = labelText.replace(/src\s*=\s*"([^"]+)"/,'src = "$1?token='+mytoken+'"');                           
                            
                            $("#lsections").append('<li>'+labelText+'</li>');
                        }
                        else {
                            $("#lsections").append('<li><a href="#" data-cmid="'+module.id+'"><img src="custom/pix/'+module.modname+'.gif" alt="'+module.modname+'" class="ui-li-icon">'+$('<div />').html(module.name).text()+'<span class="ui-li-count">'+module.contents.length+'</span></a></li>');
                            sectionsData[module.id] = module;
                        }                        
                    });
                }
            });
            
            $('[data-cmid]').click(function(){               
               sessionStorage.setItem('current_cmid',JSON.stringify(sectionsData[$(this).attr('data-cmid')]));
               $.mobile.changePage("course_content.html");
            });
            
            $('#lsections').listview('refresh'); 
        }
        
        var data = {
            "options[0][name]" : "",
            "options[0][value]" : ""
        };
        // TODO - Use sessionStorage for performance
        data.courseid = localStorage.getItem("current_course");
        
        moodleWSCall('core_course_get_contents', data, showContents, {});
            
    });
    
})();