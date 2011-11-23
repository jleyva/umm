(function() {

    $("#page-user").live('pageshow',function() {
        
        var users = getCacheElements('users');        
        $.each(users, function(index, user){                         
            if(user.id+"" == localStorage.getItem('current_user')){
                $("#userfullname").html(user.fullname);
                $("#userimage").attr('src', user.profileimageurl);
                $("#descripcion").html(user.descripcion);
                $("#email").html(user.email);
                $("#country").html(user.country);
                $("#city").html(user.city);
                // This is a break
                return false;                
            }
        });
            
    });
    
})();