function counterStart(context, callback) {
    var Shape = ProgressBar.Circle;

    var rotatingBar = new Shape('#progress' + context, {
        color: '#2C3E50',
        trailColor: '#eee',
        strokeWidth: 2,
        duration: 500
    });
    //rotatingBar.set(0);

    $('#file-picker' + context).fadeIn(2000);


    var second = 5;
    rotatingBar.set(-second - 1);
    var counterInterval = setInterval(function () {

        //rotatingBar.animate(-second*0.10+0.10, function() {
        rotatingBar.animate(-second, function () {
            document.getElementById('counter' + context).innerHTML = second;
        });


        if (second == 0) {
            callback();
            $('#file-picker' + context).fadeOut(2000);
            clearInterval(counterInterval);

            return false;
        }
        second--;

    }, 1000);

}