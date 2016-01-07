'use strict';

angular.module('lr.upload.directives').directive('uploadButton', function(upload) {
  return {
    restrict: 'EA',
    scope: {
      data: '=?data',
      url: '@',
      id: '@',
      param: '@',
      method: '@',
      onUpload: '&',
      onSuccess: '&',
      onError: '&',
      onComplete: '&',
      onChange: '&',
      thumbId: '@'

    },
    link: function(scope, element, attr) {

      scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      var el = angular.element(element);
      var fileInput = angular.element('<input id="' + scope.uploadId + '" type="file" />');
      el.append(fileInput);

      var _this = fileInput;
      var version = window.navigator.userAgent;
      fileInput.on('change', function () {

        if(version.substr(version.indexOf('MSIE') + 5, 1)==='9'){

          var thumbDiv = angular.element(document.getElementById(scope.thumbId));
          thumbDiv.html('&nbsp;');

          var obj = fileInput[0];
          obj.select();
          obj.blur();
          var imageurl = document.selection.createRange().text;
          document.selection.empty();

          document.getElementById(scope.thumbId).style.filter='progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="image",src="'+imageurl+'")';

        }else{
          scope.safeApply(function () {
            scope.onChange({files: fileInput[0].files});
          });
        }

      });

      scope.$on('uploadSubmit', function(){
        // without this, iframeUpload always upload the first time picked file
        var fileInput = angular.element(_this);

        if (fileInput[0].files && fileInput[0].files.length === 0) {
          return;
        }

        var options = {
          url: scope.url,
          method: scope.method || 'POST',
          forceIFrameUpload: scope.$eval(attr.forceIframeUpload) || false,
          data: scope.data || {}
        };

        options.data[scope.param || 'file'] = fileInput;

        scope.safeApply(function () {
          scope.onUpload({files: fileInput[0].files});
        });

        upload(options).then(
          function (response) {
            scope.onSuccess({response: response});
            scope.onComplete({response: response});
          },
          function (response) {
            scope.onError({response: response});
            scope.onComplete({response: response});
          }
        );
      });

      // Add required to file input and ng-invalid-required
      // Since the input is reset when upload is complete, we need to check something in the
      // onSuccess and set required="false" when we feel that the upload is correct
      if ('required' in attr) {
        attr.$observe('required', function uploadButtonRequiredObserve(value) {
          var required = value === '' ? true : scope.$eval(value);
          fileInput.attr('required', required);
          element.toggleClass('ng-valid', !required);
          element.toggleClass('ng-invalid ng-invalid-required', required);
        });
      }

      if ('accept' in attr) {
        attr.$observe('accept', function uploadButtonAcceptObserve(value) {
          fileInput.attr('accept', value);
        });
      }

      if (upload.support.formData) {
        var uploadButtonMultipleObserve = function () {
          fileInput.attr('multiple', !!(scope.$eval(attr.multiple) && !scope.$eval(attr.forceIframeUpload)));
        };
        attr.$observe('multiple', uploadButtonMultipleObserve);
        attr.$observe('forceIframeUpload', uploadButtonMultipleObserve);
      }
    }
  };
});
