function displayPhoto(obj) {
    var imgSrc = photoURLs[obj.attr('id')].url + '_z.jpg';
    var imgTag = '<img src=' + imgSrc + ' class=\'main-image\'>';
    displayDiv.hide().html(imgTag).fadeIn('slow');
    titleDiv.html(photoURLs[obj.attr('id')].title);
    $('.active').removeClass('active');
    obj.addClass('active');
}

function getPhotoset() {
    var photosetRequest = 'https://api.flickr.com/services/rest/?' +
        'method=flickr.photosets.getPhotos&api_key=' + apiKEY + '&photoset_id=' +
        photosetID + '&extras=ownername&format=json&nojsoncallback=1';

    return $.get(
        photosetRequest,
        function(data) {
            console.log(data.photoset.owner);
            var photoset = data.photoset;
            getUserName(photoset.title, photoset.id, photoset.owner);
            photoset.photo.forEach(function(photo, i) {
                var imgSrc = 'https://farm' + photo.farm + '.staticflickr.com/' +
                photo.server + '/' + photo.id + '_' + photo.secret;
                photoURLs[photo.id] = {url: imgSrc, title: photo.title};
                var imgTag = '<img src=' + imgSrc +
                '_s.jpg class=\'thumb\' id=' + photo.id + '>';
                thumbnailsDiv.append(imgTag);
            });
        });
}

function getUserName(title, id, userID) {
    var userNameRequest = 'https://api.flickr.com/services/rest/?' +
        'method=flickr.people.getInfo&api_key=' + apiKEY + '&user_id=' + userID +
        '&format=json&nojsoncallback=1';

    $.get(
        userNameRequest,
        function(data) {
            var flickrLink = 'https://www.flickr.com/photos/' +
            data.person.path_alias + '/sets/' + photosetID + '/';
            $('.credits').html('<a href=\'' + flickrLink + '\'>\'' + title +
                '\' by ' + data.person.realname._content + '</a>');
        });
}

var photosetID = '72157633849642806';
var apiKEY = 'a4c155541ed517438cb670c55f4cbd46';
var photoURLs = {};
var thumbnailsDiv = $('.thumbnails');
var displayDiv = $('.display');
var titleDiv = $('.title');

$(document).ready(function() {
    $.when(
        getPhotoset()
    ).done(function() {
        var firstImage = thumbnailsDiv.find('img').first();
        var lastImage = thumbnailsDiv.find('img').last();
        displayPhoto(firstImage);
        $('.thumb').click(function() {
            displayPhoto($('#' + this.id));
        });
        $('#next').click(function() {
            var nextImage = $('.active').next();
            if (nextImage.length === 0) nextImage = firstImage;
            displayPhoto(nextImage);
        });
        $('#previous').click(function() {
            var prevImage = $('.active').prev();
            if (prevImage.length === 0) prevImage = lastImage;
            displayPhoto(prevImage);
        });
    });
});
