/**
 * Created by lucker.xia on 1/6/2016.
 */
'use strict';

angular.module('lr.upload.directives').directive('uploadThumb', function() {
  return {
    restrict: 'EA',
    scope: {
      file: '=',
      url: '@',
      thumbId: '@'
    },
    link: function(scope, element) {
      var el = angular.element(element);

      var imageThumb = angular.element('<img class="coolead-image" src="_black" />');


      if(scope.url){
        imageThumb.attr('src', scope.url);
      }

      scope.$watch('url', function(){
        imageThumb.attr('src', scope.url);
      });

      var divBox = angular.element('<div id="'+ scope.thumbId +'"></div>');

      divBox.append(imageThumb);

      el.append(divBox);

      var version = window.navigator.userAgent;


      scope.$watch('file',function(){
          if(scope.file){
            if(version.substr(version.indexOf('MSIE') + 5, 1) >= 9){
              imageThumb.attr('src', 'file:\\\\'+document.selection.createRange().text);
            }else if(version.substr(version.indexOf('MSIE') + 5, 1)==='9'){

            }else{

              var files = scope.file;

              if(files&&files.length){
                var reader = new FileReader();
                reader.onload=function(e){
                  imageThumb.attr('src', e.target.result);
                };
                reader.readAsDataURL(files[0]);
              }
            }

          }
        });

    }
  };
});
