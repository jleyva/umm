(function() {

    $("#page-participants").live('pageshow',function() {
                
        setupPage();
        logInfo("Page show fired");
        
        function listCourses(courses){
            $('#lmycourses li').remove();
            $.each(courses, function(index,course){
                $("#lmycourses").append('<li><a id="course'+course.id+'" data-courseid="'+course.id+'">'+course.fullname+'<p>'+course.shortname+'</p></a></li>');
                $("#course"+course.id).click(function(){                        
                    localStorage.setItem("current_course",$(this).attr('data-courseid'))
                    $.mobile.changePage("users.html");
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