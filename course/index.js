(function() {

    $("#page-mycourses").live('pageshow',function() {

        MM.setupPage();
        MM.logInfo("Page show fired");

        function listCourses(courses){
            $('#lmycourses li').remove();
            $.each(courses, function(index,course){
                $("#lmycourses").append('<li><a id="course'+course.id+'" data-courseid="'+course.id+'">'+course.fullname+'<p>'+course.shortname+'</p></a></li>');
                $("#course"+course.id).click(function(){
                    var courseId = $(this).attr('data-courseid');
                    // Where to redirect.
                    var destination = MM.requiredParam("firstdestination");
                    var secondDestination = MM.requiredParam("seconddestination");

                    MM.setParams({
                                    courseid: courseId,
                                    firstdestination: secondDestination
                    });
                    $.mobile.changePage(destination);
                });
            });
            $('#lmycourses').listview('refresh');
        }

        var data = {
            userid: MM.cfg.current_userid
        };

        MM.moodleWSCall('moodle_enrol_get_users_courses', data, listCourses);

    });

})();