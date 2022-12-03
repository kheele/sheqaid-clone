/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$.extend({
    cp_option_yes_no_popup: function (msg, width, height, func_y, func_n) {

        return this.cp_option_custom_popup(msg, width, height, {
            "No": function () {
                $('#cp_option_custom_popup').close();
                if ($.isFunction(func_n))
                    func_n();
            },
            "Yes": function () {
                $('#cp_option_custom_popup').close();
                func_y();
            }
        });

    },
    cp_option_custom_popup: function (msg, width, height, buttons) {

        if ($('#cp_option_custom_popup').length > 0)
            $('#cp_option_custom_popup').remove();

        if (buttons === null) {
            alert('you must have buttons');
            return;
        }
        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        return $('<div id="cp_option_custom_popup" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            buttons: buttons,
            modal: true
        });
    },
    cp_option_ok_popup: function (obj, msg, width, height) {

        if ($('#cp_option_ok_popup').length > 0)
            $('#cp_option_ok_popup').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        return $('<div id="cp_option_ok_popup" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            parent: obj.parent,
            position: obj.position,
            width: width,
            height: height,
            hasFooter: true,
            buttons: {
                "OK": function () {
                    $('#cp_option_ok_popup').close();
                }
            },
            modal: obj.modal
        });

    },
    cp_option_ok_with_func_popup: function (msg, width, height, func) {

        if ($('#cp_option_ok_with_func_popup').length > 0)
            $('#cp_option_ok_with_func_popup').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        if (!$.isFunction(func)) {
            alert(func + ' must be a function');
            return;
        }

        return $('<div id="cp_option_ok_with_func_popup" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            buttons: {
                "OK": function () {
                    $('#cp_option_ok_with_func_popup').close();
                    func();
                }
            },
            modal: true
        });

    },
    cp_process_with_func: function (msg, width, height, func) {

        if ($('#cp_process_with_func').length > 0)
            $('#cp_process_with_func').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        if (!$.isFunction(func)) {
            alert(func + ' must be a function');
            return;
        }

        return $('<div id="cp_process_with_func" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            buttons: {
                "Cancel": function () {
                    $('#cp_process_with_func').close();
                    func();
                }
            },
            modal: true
        });
    },
    cp_process_and_close_with_ok: function (msg, width, height, func) {

        if ($('#cp_process_and_close_with_ok').length > 0)
            $('#cp_process_and_close_with_ok').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        if (!$.isFunction(func)) {
            alert(func + ' must be a function');
            return;
        }

        return $('<div id="cp_process_and_close_with_ok" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            buttons: {
                "OK": function () {
                }
            },
            callback: function () {
                var popup = this;
                popup.popupFooter().hide();
                func();
            },
            modal: true
        });
    },
    cp_process_and_close_with_func: function (msg, width, height, func) {

        if ($('#cp_process_and_close_with_func').length > 0)
            $('#cp_process_and_close_with_func').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        if (!$.isFunction(func)) {
            alert(func + ' must be a function');
            return;
        }

        return $('<div id="cp_process_and_close_with_func" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            buttons: {
                "OK": function () {
                }
            },
            callback: function () {
                var popup = this;
                popup.popupFooter().hide();
                func(function () {
                    popup.close();
                });
            },
            modal: true
        });
    },
    cp_process_without_func: function (msg, width, height) {

        if ($('#cp_process_without_func').length > 0)
            $('#cp_process_without_func').remove();

        if (typeof width !== "number" || typeof parseInt(width) !== "number") {
            if (width !== 'auto') {
                alert(width + ' must be a number');
                return;
            }
        }
        if (typeof height !== "number" || typeof parseInt(height) !== "number") {
            if (height !== 'auto') {
                alert(height + ' must be a number');
                return;
            }
        }

        return $('<div id="cp_process_without_func" style="text-align:center;font-size:13px;text-shadow:0px 1px 1px #fff">' + msg + '</div>').CPPopup({
            width: width,
            height: height,
            hasFooter: true,
            modal: true
        });

    }
});

(function ($, undefined) {
    ////////////////////////////////////////////////////////////////////////////
    $.fn.extend($.expr[':'], {
        text: function (el, i, match, array) {
            return $(el).text() === match[3];
        },
        html: function (el, i, match, array) {
            return $(el).html() === match[3];
        },
        valueEmpty: function (el, i, match, array) {
            var $el = $(el);
            return (($el.nodeName() === 'input' || $el.nodeName() === 'textarea' || $el.nodeName() === 'select') && $.trim($el.val()).length === 0);
        },
        valueNotEmpty: function (el, i, match, array) {
            var $el = $(el);
            return (($el.nodeName() === 'input' || $el.nodeName() === 'textarea' || $el.nodeName() === 'select') && $.trim($el.val()).length > 0);
        }
    });
    ////////////////////////////////////////////////////////////////////////////
    $.CPPopup_count = 0;
    $.fn.extend({
        ////////////////////////////////////////////////////////////////////////
        showScrollbars: function (opacity, color) {
            var element = this;
//            if (element.hasClass('nice-scrollbars')) {
//                element.niceScroll({autohidemode: false, cursoropacitymax: opacity || 0.5, cursorwidth: 8, cursorcolor: color || "#000", cursorborder: "none"});
//                element.mouseover(function () {
//                    element.getNiceScroll().resize();
//                });
//            } else if (element.find('.nice-scrollbars').length > 0) {
//                element.find('.nice-scrollbars').niceScroll({autohidemode: false, cursoropacitymax: opacity || 0.5, cursorwidth: 8, cursorcolor: color || "#000", cursorborder: "none"});
//                element.find('.nice-scrollbars').mouseover(function () {
//                    element.find('.nice-scrollbars').getNiceScroll().resize();
//                });
//            }
            return element;
        },
        removeScrollbars: function () {
            var element = this;
//            function removeBars(id) {
//                $("#" + id).remove();
//                $("#" + id + "-hr").remove();
//                $("#" + id + "-vt").remove();
//            }
//            if (element.hasClass('nice-scrollbars')) {
//                var scroll = element.getNiceScroll();
//                if (scroll.length > 0) {
//                    var el = scroll[0];
//                    if (el) {
//                        element.getNiceScroll().hide().remove();
//                        removeBars(el.id);
//                    }
//                } else {
////                    console.error("removeScrollbars: removing \"scrollbar\" on element that doesn't have it.");
//                }
//            } else if (element.find('.nice-scrollbars').length > 0) {
//                var ids = Array.from(element[0].querySelectorAll('.nice-scrollbars')).filter(element => {
//                    return !!$(element).getNiceScroll()[0];
//                }).map(element => {
//                    return $(element).getNiceScroll()[0].id;
//                });
//                element.find('.nice-scrollbars').getNiceScroll().hide().remove();
//                ids.forEach(removeBars);
//            }
            return element;
        },
        ////////////////////////////////////////////////////////////////////////
        borderRadius: function (value) {
            return this.css({'border-radius': value, '-moz-border-radius': value, '-webkit-border-radius': value});
        },
        boxShadow: function (value) {
            return this.css({'box-shadow': value, '-moz-box-shadow': value, '-webkit-box-shadow': value});
        },
        getCssVal: function (key) {
            var element = this;
            var val = element.css(key);
            if (val.indexOf('px') > -1) {
                return val.replace('px', '');
            }
            return val;
        },
        hasCss: function (key) {
            return this.css(key) !== undefined && this.css(key) !== null;
        },
        hasAttr: function (key) {
            return this.attr(key) !== undefined && this.attr(key) !== null;
        },
        hasData: function (key) {
            return this.data(key) !== undefined && this.data(key) !== null;
        },
        isHidden: function () {
            return this.css('display') === 'none';
        },
        nodeName: function () {
            try {
                return new String(this[0].nodeName).toLowerCase();
            } catch (e) {
                return new String(this.nodeName).toLowerCase();
            }
        },
        enabled: function () {
            return this.attr('disabled', false);
        },
        disabled: function () {
            return this.attr('disabled', true);
        },
        ////////////////////////////////////////////////////////////////////////
        reset: function () {
            return this.trigger('reset');
        },
        postReset: function (callback) {
            var element = this;
            element.find('button[type=reset]').click(function (e) {
                e.preventDefault();
                element.reset();
                callback.call(element);
            });
            return element;
        },
        postSubmit: function (callback) {
            var element = this;
            element.find('button[type=submit]').click(function (e) {
                e.preventDefault();
                element.submit();
                callback.call(element);
            });
            return element;
        },
        onAjaxUploadSubmit: function (fileName, callback) {
            var element = this;
            element.on('submit', function (e) {
                e.preventDefault();
                if (element.validateForm()) {
                    var param = element.convertFormToJSON();
                    if (element.attr('has-file-json') !== undefined) {
                        delete param.source;
                        if (param.coverPhotoSource) {
                            delete param.coverPhotoSource;
                        }
                        var fileJSON = element.find('textarea[name="fileJSON"]');
                        if (fileJSON.length === 0) {
                            element.append(fileJSON = $('<textarea name="fileJSON" object-type="entity"></textarea>'));
                        }
                        fileJSON.val($.formatJSON(param)).hide();
                    } else if (element.attr('has-text-json') !== undefined) {
                        delete param.source;
                        if (param.coverPhotoSource) {
                            delete param.coverPhotoSource;
                        }
                        var textJSON = element.find('textarea[name="textJSON"]');
                        if (textJSON.length === 0) {
                            element.append(textJSON = $('<textarea name="textJSON" object-type="entity"></textarea>'));
                        }
                        textJSON.val($.formatJSON(param)).hide();
                    }
                    element.find('button[type=submit]').disabled().html('Saving ' + fileName + ' details...');
                    $.cp_process_and_close_with_func('<div style="display:block;">Please wait while uploading your ' + fileName + '...</div><div class="border-radius-3" style="display:hidden;margin-top:5px;padding-bottom:2px;height:auto;background:#4797ED;border:1px solid #fcfcfc;color:#fff;font-weight:normal;font-size:11px;text-align:center;">0% complete</div><div style="display:hidden;border-top:1px solid #ddd;margin-top:8px;padding-top:10px;text-align:right;"><button class="button">Close</button></div>', 'auto', 'auto', function (close) {
                        var progress = $('#cp_process_and_close_with_func .border-radius-3');
                        element.ajaxSubmit({
                            dataType: 'json',
                            resetForm: true,
                            uploadProgress: function (e, pos, total, percentComplete) {
                                progress.show().css({width: percentComplete + '%'}).html((percentComplete + '% complete'));
                            },
                            success: function (res) {
                                progress.show().css({width: 100 + '%'}).html((100 + '% complete'));
                                $('#cp_process_and_close_with_func div:last').show().find('button').click(function () {
                                    close();
                                });
                                if (res.status) {
                                    $('#cp_process_and_close_with_func div:first').html('You have successfully uploaded your ' + fileName);
                                    $('#cp_process_and_close_with_func').rePosition();
                                    if (callback) {
                                        callback(res);
                                    }
                                } else {
                                    $('#cp_process_and_close_with_func div:first').html(res.statusMsg);
                                    $('#cp_process_and_close_with_func').rePosition();
                                }
                                element.find('button[type=submit]').enabled().html('Save ' + fileName + ' details');
                            },
                            error: function (res) {
                                $('#cp_process_and_close_with_func div:last').show().find('button').click(function () {
                                    close();
                                });
                                $('#cp_process_and_close_with_func div:first').html(res.responseText);
                                $('#cp_process_and_close_with_func').rePosition();
                                element.find('button[type=submit]').enabled().html('Save ' + fileName + ' details');
                            }
                        });
                    });
                }
            });
        },
        ////////////////////////////////////////////////////////////////////////
        toObject: function () {
            return eval('(' + this.toJSON() + ')');
        },
        ////////////////////////////////////////////////////////////////////////
        getValidateAttrParts: function () {
            var element = this;
            var partsArr = [];
            var a = [];
            if (element.hasAttr('required')) {
                a.push({key: 'required'});
            }
            if (element.hasAttr('validate')) {
                partsArr.pushAll(new String(element.attr('validate')).split(';'));
            }
            if (element.hasAttr('type')) {
                a.push({key: 'type', val: element.attr('type')});
            }
            if (element.hasAttr('match-field')) {
                a.push({key: 'match-field', val: element.attr('match-field')});
            }

            partsArr.foreach(function () {
                var partArr = new String(this).split(':');
                if (partArr !== undefined) {
                    if (partArr.length === 2) {
                        a.push({key: partArr[0], val: partArr[1]});
                    } else if (partArr.length === 1) {
                        a.push({key: partArr[0]});
                    }
                }
            });
//            return;
            return a;
        },
        validateForm: function () {
            var form = this;
            function getValidateAttrParts(input) {
                var partsArr = input.getValidateAttrParts();

                var hasError = false;
                var errMsg = '';
                partsArr.foreach(function () {
                    var part = this;
                    var displayName = input.attr('display-name') === undefined || input.attr('display-name') === null ? input.attr('placeholder') : input.attr('display-name');

                    //Required / required
                    if (part.key === 'required' && $.trim(input.val()).length === 0) {
                        input.css({background: '#fff9f9'});
                        errMsg += '<div style="display:block">&Gg; ' + displayName + (input.attr('type') === 'file' ? ' must be uploaded' : ' field is required') + '</div>';
                        hasError = true;
                    }

                    //Length / validate
                    if (part.key === 'min-length' && part.val > $.trim(input.val()).length) {
                        input.css({background: '#fff9f9'});
                        errMsg += '<div style="display:block">&Gg; ' + displayName + ' field length must be a minimum of ' + part.val + ' characters</div>';
                        hasError = true;
                    } else if (part.key === 'max-length' && part.val < $.trim(input.val()).length) {
                        input.css({background: '#fff9f9'});
                        errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a maximum of ' + part.val + ' characters</div>';
                        hasError = true;
                    } else if (part.key === 'length' && part.val !== $.trim(input.val()).length) {
                        input.css({background: '#fff9f9'});
                        errMsg += '<div style="display:block">&Gg; ' + displayName + ' field length must be ' + part.val + ' characters</div>';
                        hasError = true;
                    }

                    //Data type / type
                    if (part.key === 'type') {
                        if (part.val !== 'password') {
                            if (part.val === 'email' && !input.validateEmail()) {
                                input.css({background: '#fff9f9'});
                                errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a valid email address</div>';
                                hasError = true;
                                /*} else if (part.val === 'url' && !input.validateURL()) {
                                 input.css({background: '#fff9f9'});
                                 errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a valid URL</div>';
                                 hasError = true;*/
                            } else if (part.val === 'phone-numbers' && !input.validatePhoneNumber()) {
                                input.css({background: '#fff9f9'});
                                errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a valid phone/fax numbers</div>';
                                hasError = true;
                            } else if (part.val === 'numeric' && !input.validateNumeric()) {
                                input.css({background: '#fff9f9'});
                                errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a number</div>';
                                hasError = true;
                            } else if (part.val === 'alpha-numeric' && !input.validateAlphaNumeric()) {
                                input.css({background: '#fff9f9'});
                                errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must contain letters and numbers</div>';
                                hasError = true;
                            } else if (part.val === 'credit-card' && !input.validateCreditCard()) {
                                input.css({background: '#fff9f9'});
                                errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be a valid credit card number</div>';
                                hasError = true;
                            }
                        }
                    }

                    //Match Field / match-field
                    if (part.key === 'match-field' && form.find('input[name=' + part.val + ']').val() !== input.val()) {
                        input.css({background: '#fff9f9'});
                        errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must match ' + part.val + ' field</div>';
                        hasError = true;
                    }

                    if (!hasError) {
                        input.css({background: '#FFFFFF'});
                    }

                });

                return [!hasError, errMsg];
            }

            var valid = [], errMsg = '', hasError = false;
            var radios = [], radio = null;
            form.find('textarea, select, input:not(button)').each(function (n) {
                var $this = $(this);
                if ($this.attr('type') === 'radio') {
                    radio = form.find('input[name=' + $this.attr('name') + ']');
                    var partsArr = radio.getValidateAttrParts();
                    partsArr.foreach(function () {
                        var part = this;
                        //Required / required
                        if (part.key === 'required' && radios.indexOf($this) === -1) {
                            radios.push($this);
                        }
                    });
                } else {
                    valid = getValidateAttrParts($this);
                }

                if (!valid[0]) {
                    errMsg += valid[1];
                    hasError = true;
                }
            });

            valid = [];
            for (var n = 0; n < radios.length; n++) {
                if (radios[n].data('checked')) {
                    valid = [];
                    break;
                } else {
                    valid.push(true);
                }
            }

            if (radio !== null) {
                if (!valid.isEmpty()) {
                    var displayName = radio.attr('display-name') === undefined || radio.attr('display-name') === null ? radio.attr('placeholder') : radio.attr('display-name');
                    errMsg += '<div style="display:block">&Gg; ' + displayName + ' field must be checked</div>';
                    hasError = true;
                }

            }

            if (hasError) {
                if (arguments.length > 0) {
                    if (typeof arguments[0] === 'object') {
                        $.cp_option_ok_popup({parent: 'body', position: 'center', modal: true}, '<p style="border-bottom:1px solid #ddd;margin-top:0px;padding-bottom:7px;">Please fix the following errors</p>' + errMsg, 'auto', 'auto');
                        $('#cp_option_ok_popup').css({'text-align': 'left'}).find('div').height(20);
                        $('#cp_option_ok_popup').data('css', arguments[0]);
                    }
                } else {
                    $.cp_option_ok_popup({parent: 'body', position: 'center', modal: true}, '<p style="border-bottom:1px solid #ddd;margin-top:0px;padding-bottom:7px;">Please fix the following errors</p>' + errMsg, 'auto', 'auto');
                    $('#cp_option_ok_popup').css({'text-align': 'left'}).find('div').height(20);
                }
            }

            return !hasError;
        },
        validateCreditCard: function () {
            var element = this;
            if (element.val() === null) {
                return false;
            }
            return element.val().isCreditCardNumber();
        },
        validateEmail: function () {
            var element = this;
            if (element.val() === null) {
                return false;
            }
            return element.val().isEmailAddress();
        },
        validatePhoneNumber: function () {
            var element = this;
            if (element.val().trim().length === 0) {
                return false;
            }
            return element.val().isPhoneNumber();
        },
        validateNumeric: function () {
            var element = this;
            if (element.val().trim().length === 0) {
                return false;
            }
            return element.val().isNumeric();
        },
        validateAlphaNumeric: function () {
            var element = this;
            if (element.val().trim().length === 0) {
                return false;
            }
            return element.val().isAlphaNumeric();
        },
        ////////////////////////////////////////////////////////////////////////
        close: function (callback) {
            var element = this.hasClass('ui-element') ? this : this.find('.ui-element');
            var options = element.data('options');
            $('#popup-wrapper-' + element.attr('id')).css({opacity: 1}).stop().animate({
                opacity: 0
            }, 400, function () {
                if (callback) {
                    callback.call(element);
                }
                if (options && options.hideOnClose) {
                    $('#popup-wrapper-' + element.attr('id') + ', #popup-layer-' + element.attr('id') + ', #popup-wrapper-' + element.attr('id') + '-parent').hide();
                } else {
                    $('#popup-wrapper-' + element.attr('id') + ', #popup-layer-' + element.attr('id') + ', #popup-wrapper-' + element.attr('id') + '-parent').remove();
                }

                if (localStorage && localStorage.getItem(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                    localStorage.removeItem(location.href + '-' + element.attr('id') + '-selected-tab');
                } else {
                    if ($.cookie(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                        $.cookie(location.href + '-' + element.attr('id') + '-selected-tab', null);
                    }
                }

                $.CPPopup_count--;
            });
        },
        onClose: function (callback) {
            var element = this;
            element.find('#close-btn').unbind('click').click(function (e) {
                callback.call(element);
                if (localStorage && localStorage.getItem(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                    localStorage.removeItem(location.href + '-' + element.attr('id') + '-selected-tab');
                } else {
                    if ($.cookie(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                        $.cookie(location.href + '-' + element.attr('id') + '-selected-tab', null);
                    }
                }
                e.preventDefault();
            });
            return element;
        },
        popupOpened: function (callback) {
            var element = this;
            setTimeout(function () {
                callback.call(element);
            }, 500);
            return element;
        },
        positionToCenter: function () {
            var element = this;
            var wrapper;
            if (element.hasClass('popup-wrapper')) {
                wrapper = element;
            } else if (element.closest('.popup-wrapper').length === 1) {
                wrapper = element.closest('.popup-wrapper');
            } else if (element.find('.popup-wrapper').length === 1) {
                wrapper = element.find('.popup-wrapper');
            }

            if (!wrapper) {
                return element;
            }

            var cw = $(window).width(), ch = $(window).height();
            var w = wrapper.outerWidth(true), h = wrapper.outerHeight(true);//
            var scrollTop = $('body').scrollTop(), scrollLeft = $('body').scrollLeft();
            wrapper.css({opacity: 1}).stop().animate({
                position: 'absolute', left: ((cw - w) / 2), top: ((ch - h) / 2) + (scrollTop / 2)
            }, 500);
            return element;
        },
        popupHeader: function () {
            var element = this;
            if (element.find('.popup-wrapper-header').length === 0) {
                return element;
            }
            return element.find('.popup-wrapper-header');
        },
        popupBody: function () {
            var element = this;
            if (element.find('.popup-wrapper-body').length === 0) {
                return element;
            }
            return element.find('.popup-wrapper-body');
        },
        popupFooter: function () {
            var element = this;
            if (element.find('.popup-wrapper-footer').length === 0) {
                return element;
            }
            return element.find('.popup-wrapper-footer');
        },
        CPPopup: function () {
            var element = this;
            var wrapper = $('#popup-wrapper-' + element.attr('id'));
            if (wrapper.length > 0) {
                return wrapper;
            }
            var options = {
                parent: 'body', //             
                position: "center", //
                dialogClass: "",
                closeOnEscape: false,
                draggable: true,
                resizable: true,
                autoOpen: true,
                display: true,
                hideOnClose: false,
                hasHeader: false,
                hasFooter: false,
                width: 540,
                zIndex: 9999,
                height: 'auto',
                maxHeight: 'auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                stack: false,
                modal: true,
                headerPadding: '0',
                paddFirstLink: false,
                contentPos: 'bottom',
                tabsSlide: false,
                tabsCss: {},
                tabs: []
            };
            if (arguments.length > 0) {
                $.extend(options, arguments[0]);
            }

            element.data('options', options);

            options = element.data('options');

            var scrollTop = $('body').scrollTop();
            var scrollLeft = $('body').scrollLeft();
            if (options.modal) {
                $('<div id="popup-layer-' + element.attr('id') + '" class="popup-layer" style="width:100%;height:100%;z-index:' + options.zIndex + ';position:fixed;left:0;top:0;opacity:.5;background:#3c5b66"></div>').appendTo('body');
                $.CPPopup_count++;
                //if ($.CPPopup_count > 0) {
                //$('body').css('overflow', 'hidden');
                //}
            }

            var cw = $(window).width(), ch = $(window).height();

            var wrapper = $('#popup-wrapper-' + element.attr('id'));
            if (wrapper.length === 0) {
                wrapper = $('<div id="popup-wrapper-' + element.attr('id') + '" class="popup-wrapper box-4-no-corner" style="overflow:hidden">\n\
                                <div class="popup-wrapper-header" style="display:block;padding:10px 6px 10px 10px;margin:-1px -1px 5px;background:#f5f5f5;border:1px solid #eee;font-weight:bold;font-size:14px;font-family: Verdana, Helvetica, sans-serif;-webkit-box-shadow: 0 0 3px #ddd;-moz-box-shadow: 0 0 3px #ddd;box-shadow: 0 0 3px #ddd;-moz-border-radius: 2px;-webkit-border-radius: 2px;border-radius: 2px;"></div>\n\
                                <div class="popup-wrapper-body" style="display:block;padding:5px;margin:5px;font-family: Verdana, Helvetica, sans-serif;"></div>\n\
                                <div class="popup-wrapper-footer" style="display:block;height:30px;background: url(images/noise.png);padding:5px;margin:5px 0 0 0;color:#666666;font-family: Verdana, Helvetica, sans-serif;border-top:1px solid #eee;"></div></div>'
                        ).css({'z-index': options.zIndex, width: options.width + 'px', 'min-height': options.minHeight ? options.minHeight : '0', 'max-height': options.maxHeight, height: options.height, margin: 'auto'});
            }

            if (!options.modal) {
                wrapper.css({'-moz-box-shadow': '0 0 3px #ddd', '-webkit-box-shadow': '0 0 3px #ddd', 'box-shadow': '0 0 3px #ddd'});
            } else {
                $('.popup-wrapper').removeClass('popup-wrapper-last');
                wrapper.addClass('popup-wrapper-last');
            }

            if (options.tabs.length > 0) {
//                if (localStorage && localStorage.getItem(location.href + '-selected-tab') !== null) {
//                    localStorage.removeItem(location.href + '-selected-tab');
//                } else {
//                    if ($.cookie(location.href + '-selected-tab') !== null) {
//                        $.cookie(location.href + '-selected-tab', null);
//                    }
//                }
                element.CPTabs({
                    headerPadding: options.headerPadding, paddFirstLink: options.paddFirstLink, contentPos: options.contentPos, tabsSlide: options.tabsSlide,
                    tabs: options.tabs
                });
            }

            wrapper.find('.popup-wrapper-body').html(element.addClass('ui-element'));
            if (options.modal) {
                $(options.parent).append($('<div id="popup-wrapper-' + element.attr('id') + '-parent" style="width:100%;height:100%;position:fixed;left:0;top:0;background:transparent;z-index:9999;overflow:auto;"></div>').append(wrapper.css({'z-index': options.zIndex}).hide()));
            } else {
                $(options.parent).append(wrapper.hide());
            }
            if (!options.hasHeader) {
                wrapper.find('.popup-wrapper-header').hide();
            } else {
                wrapper.find('.popup-wrapper-header').append('<span class="title" style="color:#555;font-weight:normal;">' + element.attr('title') + '</span>').append('<span id="close-btn" style="float:right;padding:0 5px;cursor:pointer">X</span>').find('#close-btn').click(function (e) {
                    element.close();
                });
            }

            if (!options.hasFooter) {
                wrapper.find('.popup-wrapper-footer').hide();
            } else {
                wrapper.find('.popup-wrapper-footer').append('<div class="right-button-wrapper" style="float:right;margin:2px 4px 0 0"></div>');
                if (options.buttons) {
                    $.each(options.buttons, function (n, value) {
                        var bId = new String(n).toLowerCase().replaceAll(' ', '_');
                        wrapper.find('.right-button-wrapper').append($('<button class="button button_' + bId + '" style="margin:0 2px">' + n + '</button>').click(function (e) {
                            if (n === 'Close' || n === 'Exit' || n === 'OK' || n === 'Ok') {
                                element.close();
                            } else if (element.nodeName() === 'form' && (n === 'Reset' || n === 'Save' || n === 'Find' || n === 'Create account' || n === 'Sign up' || n === 'Sign in' || n === 'Log in')) {
                                if (n !== 'Reset') {
                                    element.submit();
                                } else {
                                    element.reset();
                                }
                                value.call($(this), e);
                            } else {
                                value.call($(this), e);
                            }
                            e.preventDefault();
                        }));
                    });
                }
            }

            if (options.position === false) {
                wrapper.show();
            } else {
                setTimeout(function () {
                    var w = wrapper.outerWidth(true), h = wrapper.outerHeight(true);

                    if (options.position === 'none') {
                        wrapper.addClass('box').css({position: 'relative'});
                    } else if (options.position === 'center') {
                        wrapper.addClass('box').css({position: 'absolute', left: ((cw - w) / 2), top: ((ch - h) / 2) + (scrollTop / 2)});
                    } else if (options.position === 'left') {
                        wrapper.addClass('box-radius-right').css({position: 'absolute', left: 0, top: ((ch - h) / 2) + (scrollTop / 2)});
                    } else if (options.position === 'right') {
                        wrapper.addClass('box-radius-left').css({position: 'absolute', right: 0, top: ((ch - h) / 2) + (scrollTop / 2)});
                    } else if (options.position === 'top') {
                        wrapper.addClass('box-radius-bottom').css({position: 'absolute', top: 0 + (scrollTop / 2), left: ((cw - w) / 2)});
                    } else if (options.position === 'bottom') {
                        wrapper.addClass('box-radius-top').css({position: 'absolute', bottom: 0 + (scrollTop / 2), left: ((cw - w) / 2)});
                    }

                    if (options.display) {
                        wrapper.show().css({opacity: 0}).stop().animate({
                            opacity: 1
                        }, 400, function () {

                        });
                    } else {
                        wrapper.data('show', function (f1, f2) {
                            if (f2 && $.isFunction(f2)) {
                                f2();
                            }
                            wrapper.show().css({opacity: 0}).stop().animate({
                                opacity: 1
                            }, 400, function () {
                                if (f1 && $.isFunction(f1)) {
                                    f1();
                                }
                            });
                        });
                    }
                }, 1);
            }

            return wrapper.onClose(function () {
                $(this).close(function () {
                    $(this).removeScrollbars();
                });
            }).popupOpened(function () {
                $(this).showScrollbars();
                if (options.callback && options.callback.equalsFunction()) {
                    options.callback.call($(this));
                }
            });
        },
        tabHeader: function () {
            var element = this;
            if (element.find('.tab-head').length === 0) {
                return element;
            }
            return element.find('.tab-head');
        },
        tabBody: function () {
            var element = this;
            if (element.find('.tab-body').length === 0) {
                return element;
            }
            return element.find('.tab-body');
        },
        CPTabs: function () {
            var element = this;
            var options = {
                width: 'auto',
                height: 'auto',
                maxHeight: 'auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddFirstLink: false,
                headerPadding: '0',
                contentPos: 'bottom',
                tabsSlide: false,
                tabs: []
            };
            if (arguments.length > 0) {
                $.extend(options, arguments[0]);
            }

            element.data('options', options);

            options = element.data('options');

            var click = function (e, titleId) {
                var $this = $(this);

                if ($this.css('cursor') === 'default') {
                    e.preventDefault();
                    return;
                }

                if ($this.data('callback')) {
                    $this.data('callback')($this);
                }
                if (options.contentPos === 'bottom') {
                    $this.nextAll().css({'border-bottom': '1px solid #fff', color: '#777', 'padding-bottom': '2px', 'margin-bottom': '0px', cursor: 'pointer'});
                    $this.prevAll().css({'border-bottom': '1px solid #fff', color: '#777', 'padding-bottom': '2px', 'margin-bottom': '0px', cursor: 'pointer'});
                    $this.css({'border-bottom': '3px solid #4797ED', color: '#333', 'padding-bottom': '4px', 'margin-bottom': '-1px', cursor: 'default'});
                } else if (options.contentPos === 'top') {
                    $this.nextAll().css({'border-top': '1px solid #fff', color: '#777', 'padding-top': '5px', 'margin-top': '0px', cursor: 'pointer'});
                    $this.prevAll().css({'border-top': '1px solid #fff', color: '#777', 'padding-top': '5px', 'margin-top': '0px', cursor: 'pointer'});
                    $this.css({'border-top': '3px solid #4797ED', color: '#333', 'padding-top': '4px', 'margin-top': '-1px', cursor: 'default'});
                }
                $this.parent().next().children().hide().removeScrollbars();
                $this.parent().next().children($this.attr('href')).show().showScrollbars();
                if (localStorage) {
                    localStorage.setItem(location.href + '-' + element.attr('id') + '-selected-tab', titleId);
                } else {
                    $.cookie(location.href + '-' + element.attr('id') + '-selected-tab', titleId);
                }
                element.data('tabs-title-selected', $this);
                element.data('tabs-body-selected', $this.parent().next().children($this.attr('href')));
                element.data('tabs-body-id-selected', new String($this.attr('href')).replace('#', '').replace('_blacktriangledown_', ''));
                e.preventDefault();
            };

            var j = function (tabBody, tab, a, titleId, n) {
                if (tab.dropDown) {
                    $.each(tab.optionList, function (n0, record) {
                        var subTitleId = new String(record.title).filterToEnglishCharactors();
                        if (record.selected) {
                            element.data('tabs-title-selected', a);
                            element.data('tabs-body-selected', tabBody.children(a.attr('href')));
                            element.data('tabs-body-id-selected', subTitleId);
                        }
                        if (record.callback && $.isFunction(record.callback)) {
                            a.data('callback', record.callback);
                        }
                        var div;
                        if (options.contentPos === 'bottom') {
                            tabBody.append(div = $('<div id="' + subTitleId + '" style="display:' + (record.selected !== undefined ? 'block' : 'none') + ';background:#fff;padding:5px 20px;font-weight:bold;font-size:12px;border-top:none;"></div>'));
                        } else if (options.contentPos === 'top') {
                            tabBody.append(div = $('<div id="' + subTitleId + '" style="display:' + (record.selected !== undefined ? 'block' : 'none') + ';background:#fff;padding:5px 20px;font-weight:bold;font-size:12px;border-bottom:none;"></div>'));
                        }
                        if (options.tabsCss) {
                            div.css(options.tabsCss);
                        }
                        element.data('tabs-title-' + n + '-' + n0, a);
                        element.data('tabs-body-' + n + '-' + n0, div);
                        element.data('tabs-body-id-' + n + '-' + n0, subTitleId);
                    });

                    a.hover(function () {
                        var $this = $(this);
                        $this.CPSelectOptions(tab.optionList, {boxWidth: '145px'});
                    }).click(function (e) {
                        var $this = $(this);
                        $this.css('cursor', 'pointer');
                        click.call($this, e, titleId);
                    });

                } else {
                    a.click(function (e) {
                        click.call($(this), e, titleId);
                    });
                    if (tab.selected) {
                        element.data('tabs-title-selected', a);
                        element.data('tabs-body-selected', tabBody.children(a.attr('href')));
                        element.data('tabs-body-id-selected', titleId);
                    }
                    if (tab.callback && $.isFunction(tab.callback)) {
                        a.data('callback', tab.callback);
                    }
                    var div;
                    if (options.contentPos === 'bottom') {
                        tabBody.append(div = $('<div id="' + titleId + '" style="display:' + (tab.selected !== undefined ? 'block' : 'none') + ';background:#fff;padding:5px 20px;font-weight:bold;font-size:12px;border-top:none;"></div>'));
                    } else if (options.contentPos === 'top') {
                        tabBody.append(div = $('<div id="' + titleId + '" style="display:' + (tab.selected !== undefined ? 'block' : 'none') + ';background:#fff;padding:5px 20px;font-weight:bold;font-size:12px;border-bottom:none;"></div>'));
                    }
                    if (options.tabsCss) {
                        div.css(options.tabsCss);
                    }
                    element.data('tabs-title-' + n, a);
                    element.data('tabs-body-' + n, div);
                    element.data('tabs-body-id-' + n, titleId);
                }
            };

            var tabHead = $('<div class="tab-head" style="display:block;background:#fff;border-' + options.contentPos + ':1px solid #ddd;height:29px;padding:' + options.headerPadding + '"></div>');
            var tabBody = $('<div class="tab-body" style="display:block;background:#fff;border-' + options.contentPos + ':1px solid #ddd;height:auto;padding:0;"></div>');
            for (var n in options.tabs) {
                var tab = options.tabs[n];
                if (!$.isFunction(tab)) {
                    var titleId = new String(tab.title).filterToEnglishCharactors();
                    if ($.isArray(tab.optionList)) {
                        tab.title = tab.title + '&blacktriangledown;';
                        tab.dropDown = true;
                        $.each(tab.optionList, function (n, record) {
                            if (!record.callback) {
                                var subTitleId = new String(record.title).filterToEnglishCharactors();
                                record.callback = function (e, target) {
                                    $(target).attr('href', '#' + subTitleId).html(this.title + '&blacktriangledown;').data('tab', record).click();
                                };
                            }
                        });
                    } else {
                        tab.dropDown = false;
                    }
                    var css;

                    if (options.contentPos === 'bottom') {
                        css = 'border-bottom:1px solid #fff;color:#777;padding-bottom:2px;cursor:pointer;';
                        if (tab.selected) {
                            css = 'border-bottom:3px solid #4797ED;color:#333;padding-bottom:4px; cursor:default;';
                        }
                    } else if (options.contentPos === 'top') {
                        css = 'border-top:1px solid #fff;color:#777;padding-top:5px;margin-top: 0px;cursor:pointer;';
                        if (tab.selected) {
                            css = 'border-top:3px solid #4797ED;color:#333;padding-top:4px;margin-top: -1px; cursor:default;';
                        }
                    }

                    var a;
                    tabHead.append(a = $('<a href="#' + titleId + '" style="float:left;background:#fff;padding:2px 0px;margin:auto 10px;font-weight:normal;font-size:14px;' + css + '">' + tab.title + ' <counter style="font-size:12px;"><counter></a>'));

                    j(tabBody, tab, a, titleId, n);
                }
            }

            if (!options.paddFirstLink) {
                tabHead.find('a:first').css({'margin-left': '0'});
            }
            if (options.contentPos === 'bottom') {
                element.append(tabHead);
                element.append(tabBody);
            } else if (options.contentPos === 'top') {
                element.append(tabBody);
                element.append(tabHead);
            }

            if (localStorage && localStorage.getItem(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                if (tabHead.find('a[href=#' + localStorage.getItem(location.href + '-' + element.attr('id') + '-selected-tab') + ']').length > 0) {
                    tabHead.find('a[href=#' + localStorage.getItem(location.href + '-' + element.attr('id') + '-selected-tab') + ']').click();
                }
            } else {
                if ($.cookie(location.href + '-' + element.attr('id') + '-selected-tab') !== null) {
                    if (tabHead.find('a[href=#' + $.cookie(location.href + '-' + element.attr('id') + '-selected-tab') + ']').length > 0) {
                        tabHead.find('a[href=#' + $.cookie(location.href + '-' + element.attr('id') + '-selected-tab') + ']').click();
                    }
                }
            }

            if (options.tabsSlide) {
                //tabBody.children().show().css({display: 'inline'});
                //alert(tabBody.children().innerWidth());
            }

            return element;
        },
        ////////////////////////////////////////////////////////////////////////
        CPList: function () {
            var element = this;
            var options = {
                popupOptions: {
                    hasHeader: true,
                    hasFooter: true,
                    width: 480
                },
                hasHeader: false,
                hasFooter: false,
                hasAddBtn: false,
                hasClearBtn: false,
                width: 'auto',
                height: 'auto',
                minHeight: 'auto',
                maxHeight: 'auto',
                overflowY: 'auto',
                overflowX: 'hidden'
            };

            if (arguments.length > 0) {
                var param = arguments[0];
                if (param.popupOptions) {
                    $.extend(options.popupOptions, param.popupOptions);
                }
                $.extend(options, param);
            }

            element.addClass('ui-list').append('<div class="list-header" style="display:block;background-color:#f9f9f9;color:#999;border-bottom:1px solid #eee;font-size: 13px;font-weight:normal;padding:5px;margin:-5px -10px 0;">' + element.attr('title') + ' <span style="float:right;color:#999;text-align:right;"><button class="addB">Add New</button> <button class="removeB">Reset</button></span></div>');
            element.append('<div class="list-body nice-scrollbars" style="display:block;margin:0 -10px;color:#999;width:' + options.width + ';min-height:' + options.minHeight + ';max-height:' + options.maxHeight + ';height:' + options.height + ';overflow-x:' + options.overflowX + ';overflow-y:' + options.overflowY + ';"></div>');

            if (!options.hasHeader) {
                element.find('.list-header').hide();
            }
            if (!options.hasFooter) {
                //element.find('.list-header').hide();
            }

            if (options.hasAddBtn) {
                //                .find('.addB').css({ float: 'right', 'margin-top': '0px', width: 'auto', padding: '3px', 'padding-left': '16px', 'font-size': '10px', 'text-align': 'left', color: '#555'});

                element.find('.addB').click(function (e) {
                    var popup = $('<div id="add_' + element.attr('id') + '_popup" title="Add ' + element.attr('title') + '"></div>').CPPopup(options.popupOptions);

                    popup.find('.ui-element').html(function () {
                        var div = $('<div style="display:block;"/>');
                        div.html(options.html);
                        return div;
                    }).css({padding: '10px', margin: '-10px', background: 'url(' + imagesRoot + '/grey_bg.png)'});

                    element.data('popup', popup);

                    e.preventDefault();
                }).css({float: 'right', 'margin-top': '0px', width: 'auto', padding: '2px 3px 3px', 'padding-left': '16px', 'font-size': '10px', 'text-align': 'left', color: '#555'});
            } else {
                element.find('.addB').remove();
            }
            if (options.hasClearBtn) {
                element.find('.removeB').click(function (e) {
                    element.children('div:last').children().remove();
                    e.preventDefault();
                }).css({float: 'right', 'margin-top': '0px', width: 'auto', padding: '2px 3px 3px', 'padding-left': '16px', 'font-size': '10px', 'text-align': 'left', color: '#555'});
            } else {
                element.find('.removeB').remove();
            }

            if (options.load) {
                options.load.call(element.children('.list-body'));
            }

            element.css({display: 'block'}).addClass('box-2');

            return element;
        },
        refresh: function (list) {
            if (list.isEmpty()) {
                return this;
            }
            var element = this.hasClass('list-body') ? this : this.children('.list-body');
            if (list.equals(element.data('list'))) {
                return this;
            }

            list = element.hasData('list') ? element.data('list').retainAll(list) : list;

            element.data('list', list);
            if (element.children().length > 0) {
                element.children().remove();
            }
            list.foreach(function (n) {
                var self = this;
                n = self.record ? self.record.id || n : n;
                var boxRecord = element.children('div[class=row-at-' + n + ']');
                if (boxRecord.length === 0) {
                    element.append(boxRecord = $('<div class="row-at-' + n + '"><span style="float:left;margin-right:10px">' + self.title + '</span><span style="float:right;width:14px;height:14px;margin-top:2px;background:transparent"> </span><div style="clear:both"></div></div>'));
                    if ((self.callback !== undefined && self.callback !== null) && self.callback.equalsFunction()) {
                        if (self.record) {
                            boxRecord.data('record', self.record).css({cursor: 'pointer'}).click(function (e) {
                                self.callback.call($(this).data('record'), $(this).data('record'));
                                element.children().data('selected', null).find('span:last').css({background: 'transparent'});
                                $(this).data('selected', true).find('span:last').css({background: '#fff'});
                            });
                        } else {
                            boxRecord.click(function (e) {
                                self.callback.call(element, e, element);
                            });
                        }
                    }
                }
            });
            element.children(':odd').css({background: 'rgb(249,249,249)'}).mouseleave(function () {
                $(this).css({background: 'rgb(249,249,249)', color: '#777'});
                if ($(this).hasData('selected')) {
                    $(this).find('span:last').css({background: '#2191da'});
                }
            });
            element.children(':even').css({background: '#fff'}).mouseleave(function () {
                $(this).css({background: '#fff', color: '#777'});
                if ($(this).hasData('selected')) {
                    $(this).find('span:last').css({background: '#2191da'});
                }
            });
            element.children().css({display: 'block', height: 'auto', padding: '2px 10px', 'border-bottom': '1px solid rgb(240,240,240)', color: '#777'}).mouseenter(function () {
                $(this).css({background: '#2191da', color: '#fff'});
                if ($(this).hasData('selected')) {
                    $(this).find('span:last').css({background: '#fff'});
                }
            });
            element.showScrollbars();
            return this;
        },
        niceSelect: function () {
            var element = this;
            if (element.data('exist')) {
                return;
            }
            var options = {
                parent: 'body',
                boxWidth: 'auto',
                justShow: true,
                updatable: false,
                show: true,
                topGap: 40
            };

            if (arguments.length === 1) {
                $.extend(options, arguments[0]);
            }

            var bDiv = $('<div class="ui-list ' + element.attr('name') + '-button-list" style="background:red;position:absolute;top:' + (element.offset().top) + 'px;left:' + (element.offset().left) + 'px;z-index:99999;"></div>').hide().
                    append('<div class="box" style="overflow:hidden;box-shadow: 0 0 30px #999;-moz-box-shadow: 0 0 30px #999;-webkit;box-shadow: 0 0 30px #999;cursor: pointer;width:auto;margin-top:' + (options.topGap - 5) + 'px;"></div>').
                    appendTo($(options.parent)).data('options', options).hover(function () {

            }, function () {
                $(this).hide();
            });

            element.hide();

            var el = $('<div class="box box-at-selected" style="padding: 7px 10px;width:' + options.boxWidth + '"><span style="float:left;">' + element.children('option:selected').html() + '</span> <span style="float:right;">&blacktriangledown;</span><div class="clear"/></div>').data('value', element.children('option:selected').val()).insertAfter(element);

            if (!el.hasClass('target-link')) {
                el.addClass('target-link');
            }

            element.children('option').each(function (n) {
                var record = $(this);
                var boxRecord = bDiv.find('.box').children('div[class=box-at-' + n + ']');
                if (boxRecord.length === 0) {
                    bDiv.find('.box').append(boxRecord = $('<div class="box-at-' + n + '">' + record.html() + '</div>'));
                    boxRecord.data('value', record.val()).click(function (e) {
                        var $this = $(this);
                        $this.nextAll().css({background: '#fff', color: '#777'}).data('selected', null);
                        $this.prevAll().css({background: '#fff', color: '#777'}).data('selected', null);
                        $this.css({background: 'rgb(0,150,200)', color: '#fff'}).data('selected', true);
                        el.find('span:first').html($this.html()).data('value', $this.data('value'));
                        element.val($this.data('value'));
                        bDiv.hide();
                    }).css({display: 'block', padding: '7px 10px', margin: '0 0', 'border-top': '1px solid #ddd', color: '#777'}).hover(function () {
                        var $this = $(this);
                        if (!$this.data('selected')) {
                            $this.css({background: '#e1e1e1'});
                        }
                    }, function () {
                        var $this = $(this);
                        if (!$this.data('selected')) {
                            $this.css({background: '#fff'});
                        }
                    });//.width(options.boxWidth);
                }
            });
            bDiv.find('.box div:first').css({'border-top': '1px solid transparent'});

            el.hover(function () {
                bDiv.show();
            });

            element.data('exist', true);
            return el;
        },
        CPSelectOptions: function (list) {
            var element = this;
            var options = {
                parent: 'body',
                position: 'bottom',
                boxWidth: 'auto',
                justShow: true,
                updatable: false,
                show: true,
                topGap: 15,
                bottomGap: 15,
                leftGap: 15,
                rightGap: 15
            };
            if (arguments.length === 2) {
                var param = arguments[1];
                $.extend(options, param);
            }
            function show(updatable) {
                if (!updatable) {
                    var width = (options.position === 'left' ? parseInt(options.boxWidth.replace('px')) + element.outerWidth() + options.leftGap : (element.outerWidth() + 2));
                    var height = (options.position === 'left' ? element.outerHeight() + 'px' : 'auto');
                    var left = (options.position === 'left' ? (element.offset().left - width) + element.outerWidth() : (element.offset().left - 1));
                    var top = element.offset().top;
                    if (!element.hasClass('target-link')) {
                        element.addClass('target-link');
                    }
                    bDiv = $('<div class="ui-list ' + options.parent + '-button-list" style="background:re;position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + ';z-index:99999;"></div>').
                            append($('<div class="box" style="cursor: pointer;color:#888;width:' + options.boxWidth + ';margin-top:' + (options.position === 'left' || options.position === 'right' ? 0 : element.outerHeight() + options.topGap) + 'px;"></div>').borderRadius('0px').boxShadow('0 0 20px #999')).
                            appendTo($(options.parent)).data('options', options).hover(function () {

                    }, function () {
                        if (!options.updatable) {
                            $(this).remove();
                        }
                    });

                    if (!options.show) {
                        bDiv.hide();
                    }

                    if (options.justShow) {
                        element.hover(function () {

                        }, function () {
                            bDiv.remove();
                        });
                    }
                }
                list.foreach(function (n) {
                    var $this = this;
                    var boxRecord = bDiv.find('.box').children('div[class=box-at-' + n + ']');
                    if (boxRecord.length === 0) {
                        bDiv.find('.box').append(boxRecord = $('<div class="box-at-' + n + '">' + $this.title + '</div>'));
                        if (($this.callback !== undefined || $this.callback !== null) && $this.callback.equalsFunction()) {
                            if ($this.record) {
                                boxRecord.attr('record', $this.record).click(function (e) {
                                    $this.callback.call($(this).data('record'), $(this).data('record'));
                                    bDiv.remove();
                                });
                            } else {
                                boxRecord.click(function (e) {
                                    $this.callback.call(element, e, element);
                                    bDiv.remove();
                                });
                            }
                        }
                    }
                });
                if (!updatable) {
                    bDiv.find('.box div').css({display: 'block', padding: '7px 10px', 'border-top': '1px solid #eee'}).hover(function () {
                        $(this).css({background: '#f1f1f1'});
                    }, function () {
                        $(this).css({background: '#fff'});
                    });
                    bDiv.find('.box div:first').css({'border-top': '1px solid transparent'});
                }

                return bDiv;
            }

            var bDiv = $('.' + options.parent + '-button-list');
            if (bDiv.length > 0) {
                if (!options.updatable) {
                    $('.' + options.parent + '-button-list').remove();
                    return show(false);
                } else {
                    return show(true);
                }
            } else {
                return show(false);
            }

            return element;
        },
        ////////////////////////////////////////////////////////////////////////
        CPContentLoader: function (callback, loadedCallback) {
            var element = this;
            var defaults = {
                loaded: false, refreshForever: false, refresh: false, search: false, timeout: 3000
            };

            var data = element.data('options') || {};

            $.extend(defaults, data);
            element.data('options', defaults);
            defaults = undefined;

            var to = null;
            function loadData() {
                if (element && element.data('options')) {
                    if (!element.data('options').loaded) {
                        element.data('options').refresh = true;
                    }
                    if (element.data('options').refresh) {
                        callback.call(element);
                        if (!element.data('options').refreshForever) {
                            element.data('options').refresh = false;
                        }
                    }
                    to = setTimeout(function () {
                        loadData();
                    }, element.data('options').timeout);
                } else {
                    if (to !== null) {
                        clearTimeout(to);
                    }
                }
            }
            loadData();

            if (loadedCallback && loadedCallback.equalsFunction()) {
                loadedCallback.call(element);
            }

            return element;
        },
        CPSubLoad: function (isSelfDiv, callback) {
            var element = this;
//                        alert(element.attr('id'))
//            if (element.find('.title').length === 0) {
//                var word = element.append('\
//                    <div class="box-2 title" style="display:block;font-weight:normal;font-size:12px;color: #777"><span style="float:left">' + element.data('noResultsMsg') + '</span><div class="clear"/></div>\n\
//                ').find('.title').children('span:first');
//                word.html('(<count>...</count>) ' + word.html().toTitleCase());
//            }
            var rows = isSelfDiv ? element : element.children('div[class="rows"]');
            var url = !element.data('options').search ? element.data('url') : element.data('options').url;
            $.getJSON(url, function (res) {
                if (res.entries) {
                    if (res.entries.length === 0) {
                        element.data('options').loaded = true;//false;
                        element.data('options').timeout = 5000;
//                        if (element.data('options').search) {
//                            if (rows.children('.searchResults').children('.no-results').length === 0) {
//                                rows.children('.searchResults').html('<div class="box-2 no-results" style="display:block;margin:0 0px 25px;font-weight:normal;font-size:12px;color: #777"><span style="float:left">There are currently no ' + element.data('noResultsMsg') + ' in your search</span><div class="clear"/></div>');
//                            }
//                        } else {
                        if (rows.children('.no-results').length === 0) {
                            element.find('.title').hide().next().hide();
                            rows.html('<div class="box-2 no-results" style="display:block;margin:0 0px 25px;font-weight:normal;font-size:12px;color: #777"><span style="float:left">There are currently no ' + element.data('noResultsMsg') + '</span><div class="clear"/></div>');
                        }
//                        }
                    } else {
                        element.data('options').loaded = true;
//                        element.find('.title').show().next().show();
//                        element.find('count').html(res.entries.length);
                        callback.call(element, res.entries, rows);
                    }
                } else {
//                    alert(url);
                }
            });
            return element;
        }
    });
})(jQuery);