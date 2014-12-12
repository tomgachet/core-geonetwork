(function() {
  goog.provide('gn_import_controller');

  goog.require('gn_category');
  goog.require('gn_importxsl');

  var module = angular.module('gn_import_controller',[
    'gn_importxsl',
    'gn_category',
    'blueimp.fileupload'
  ]);

  /**
   * Metadata import controller.
   *
   * TODO: Add other type of import
   * TODO: Init form from route parameters
   */
  module.controller('GnImportController', [
    '$scope',
    'gnMetadataManager',
    function($scope, gnMetadataManager) {
      $scope.importMode = 'importFromDir';
      $scope.file_type = 'single';
      $scope.uuidAction = 'nothing';
      $scope.importing = false;
      $scope.recordTypes = [
        {key: 'METADATA', value: 'n'},
        {key: 'TEMPLATE', value: 'y'},
        {key: 'SUB_TEMPLATE', value: 's'}
      ];

      $scope.template = $scope.recordTypes[0].value;

      /** Upload management */
      $scope.action = 'xml.mef.import.ui';
      var uploadImportMdDone = function(evt, data) {
      };
      var uploadImportMdError = function(data) {
      };

      // upload directive options
      $scope.mdImportUploadOptions = {
        autoUpload: false,
        done: uploadImportMdDone,
        fail: uploadImportMdError
      };
      /** --- */


      var formatExceptionArray = function() {
        if (!angular.isArray($scope.report.exceptions.exception)) {
          $scope.report.exceptions.exception =
              [$scope.report.exceptions.exception];
        }
      };
      var onSuccessFn = function(response) {
        $scope.importing = false;
        if (response.data.exceptions) {
          $scope.report = response.data;
          formatExceptionArray();
        } else {
          $scope.report = response.data;
        }
        $scope.report.success = parseInt($scope.report.records) -
            parseInt(($scope.report.exceptions &&
            $scope.report.exceptions['@count']) || 0);
      };
      var onErrorFn = function(error) {
        $scope.importing = false;
        $scope.report = error.data;
        formatExceptionArray();
      };

      $scope.importRecords = function(formId) {
        $scope.importing = true;
        $scope.report = null;
        $scope.error = null;

        if($scope.importMode == 'uploadFile') {
          $scope.submit();
        } else if($scope.importMode == 'importFromDir') {
          gnMetadataManager.importFromDir($(formId).serialize()).then(
            onSuccessFn, onErrorFn);
        } else  {
          gnMetadataManager.importFromXml($(formId).serialize()).then(
              onSuccessFn, onErrorFn);
        }
      };
    }
  ]);
})();
