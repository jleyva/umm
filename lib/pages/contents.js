(function() {

    $("#page-contents").live('pageshow',function() {
                
        setupPage();
        logInfo("Page show fired");
        
        // Check if the current site is not 2.0 or 2.1
        var sites = localStorage.getItem("sites");
        sites = JSON.parse(sites);
        var currentSite = sites[localStorage.getItem("current_site")];        
        contentsSuport = false;
        
        $.each(currentSite.functions, function(index,funct){            
            if(funct.name == "core_course_get_contents"){                
                contentsSuport = true;
                return;
            }
        });
        
        if(! contentsSuport){
            popMessage("This Moodle site does not support this functionallity. (Moodle 2.2 at least required)");
            setTimeout('$.mobile.changePage("mysite.html")',2000);
        }
        
        function listCourses(courses){
            $('#lmycourses li').remove();
            $.each(courses, function(index,course){
                $("#lmycourses").append('<li><a id="course'+course.id+'" data-courseid="'+course.id+'">'+course.fullname+'<p>'+course.shortname+'</p></a></li>');
                $("#course"+course.id).click(function(){                        
                    localStorage.setItem("current_course",$(this).attr('data-courseid'))
                    $.mobile.changePage("course_contents.html");
                });
            });            
            $('#lmycourses').listview('refresh');        
        }
        
        var data = {};
        var sites = JSON.parse(localStorage.getItem("sites"));
        data.userid = sites[localStorage.getItem("current_site")].userid;
        
        moodleWSCall('moodle_enrol_get_users_courses', data, listCourses, {});
            
    });
    
})();