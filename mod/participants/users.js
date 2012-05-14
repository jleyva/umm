(function() {

    $("#page-users").live('pageshow',function() {        
        
        setupPage();
        logInfo("Page show fired");
        
        function listUsers(users){
            pushCacheElements('users',users);
            $("#lusers li").remove();
            
            $.each(users, function(index,user){
                // TODO - Replace when bug related with cookies fixed
                user.profileimageurl = "http://demo.moodle.net/theme/image.php?theme=standard&image=u%2Ff1";
                
                $("#lusers").append('<li><a href="user.html" id="user'+user.id+'" data-userid="'+user.id+'"><img src="'+user.profileimageurl+'">'+user.fullname+'</a></li>');                
            });
            
            $('[data-userid]').click(function(){                        
                localStorage.setItem("current_user",$(this).attr('data-userid'))
                $.mobile.changePage("user.html");
            });
            
            $('#lusers').listview('refresh');        
        }
        
        var data = {
            "options[0][name]" : "",
            "options[0][value]" : ""
        };        
        data.courseid = localStorage.getItem("current_course");
                
        moodleWSCall('moodle_user_get_users_by_courseid', data, listUsers, {});
            
    });
    
})();