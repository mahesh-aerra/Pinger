"use strict";

var validationUtility = (function () {


    function validateEntity(entity, type) {

        if (entity == '' && type == config.taskType.webSite) {
            return 'Enter website details';
        }

        if (entity == '' && type == config.taskType.server) {
            return 'Enter server details';
        }

        if (entity == '' && type == config.taskType.database) {
            return 'Enter database details';
        }

        //validating port
        if (type == config.taskType.server || type == config.taskType.database) {

            var list = entity.split(':');

            if (list.length < 2) {
                return 'Port is not specified';
            }

            var res = validatePort(list[1]);

            if (!res) {
                return 'Invalid port';
            }
        }

        var url_regex = /((ht|f)tps?:\/\/)*(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (!url_regex.test(entity)) {

            if (type == config.taskType.server) {
                return 'Invalid server details';
            }

            if (type == config.taskType.database) {
                return 'Invalid database details';
            }
        }

        //checking if that entity already exists''
        var localStorageKeys = localStorageUtility.retriveAllKeys();

        if (localStorageKeys.length > 0) {

            for (var i = 0; i < localStorageKeys.length; i++) {

                var key = localStorageKeys[i];
                var obj = localStorageUtility.retriveItem(key);

                if (obj.taskType == type) {
                    if (obj.value.entity.toLowerCase() == entity.toLowerCase()) {
                        return 'entity already exists';
                    }
                }
            }
        }

        return '';
    }

    // returns empty string if the validation is sucessfull
    function validateEmail(email) {

        if (email == '') {
            return '';
        }

        var emailList = email.split(',');
        var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (emailList.length > config.defaultSettings.maxEmailLength) {
            return 'Maximum of ' + config.defaultSettings.maxEmailLength + ' emails are allowed';
        } else {
            for (var i = 0; i < emailList.length; i++) {
                if (!email_regex.test(emailList[i])) {
                    return 'Invalid email';
                }
            }
        }

        return '';
    }

    function validatePort(port) {

        var number = parseInt(port);

        return ((0 <= number) && (number <= 65535) && !isNaN(number));
    }

    return {
        validateEntity: validateEntity,
        validateEmail: validateEmail
    }

})();