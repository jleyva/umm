(function() {

    $("#page-mycourses").live('pageshow',function() {

        UMM.setupPage();
        UMM.logInfo("Page show fired");

        function listCourses(courses){
            $('#lmycourses li').remove();
            $.each(courses, function(index,course){
                $("#lmycourses").append('<li><a id="course'+course.id+'" data-courseid="'+course.id+'">'+course.fullname+'<p>'+course.shortname+'</p></a></li>');
                $("#course"+course.id).click(function(){
                    var courseId = $(this).attr('data-courseid');
                    // Where to redirect.
                    var destination = UMM.requiredParam("destinationcourse");

                    UMM.setParams({courseid: courseId});
                    $.mobile.changePage(destination);
                });
            });
            $('#lmycourses').listview('refresh');
        }

        var data = {
            userid: UMM.cfg.current_userid
        };

        UMM.moodleWSCall('moodle_enrol_get_users_courses', data, listCourses);

    });

})();