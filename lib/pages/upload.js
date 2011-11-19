(function() {

    $("#btake").click(function(){
        sessionStorage.setItem('upload_action','takephoto');
        $.mobile.changePage("uploadimage.html");
    });
    
    $("#bbrowse").click(function(){
        sessionStorage.setItem('upload_action','browsephoto');
        $.mobile.changePage("uploadimage.html");
    });

})();