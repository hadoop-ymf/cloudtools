// Create by CodeMeow5

(function ($) {

    $.extend({
        validate: {
            items: [],
            _ps: [],
            check: function(){
                var ok_ = true;
                for (var _ in _ps) {
                    var els = _ps[_]['els'];
                    els.each(function () {
                        var this_ = $(this);
                        ok_ = ok_ && _ps[_](null, null, this_);
                    });
                }
                return ok_;
            },
            register: function (data) {
                var _className = data.className;
                var _elements = data.elements;
                var els = undefined;
                if (!!_className && _className.length > 0) {
                    els = $('.' + _className);
                } else if (!!_elements && _elements.size() > 0) {
                    els = _elements;
                }
                if (!els || els.size() === 0) {
                    throw 'No matching element';
                }
                var _eventNames = data.eventNames;
                if (!_eventNames || _eventNames.length === 0) {
                    throw 'eventNames not found';
                }
                var validMethods = [];
                var _validMethodNames = data.validMethodNames;
                if (!!_validMethodNames) {
                    for (var _ in _validMethodNames) {
                        var m = methods[_validMethodNames[_]];
                        if (!!m) {
                            validMethods.push(m);
                        }
                    }
                }
                var _validMethods = data.validMethods;
                if (!!_validMethods) {
                    for (var _ in _validMethods) {
                        validMethods.push(_validMethods[_]);
                    }
                }
                var _correctClassName = data.correctClassName;// TODO class object
                var _failedClassName = data.failedClassName;// TODO class object
                var _msgPanel = data.msgPanel;
                var msgPanel = undefined;
                if (!!_msgPanel && _msgPanel.length > 0) {
                    var pan = $('.' + msgPanel);
                    if (pan.size() > 0) {
                        msgPanel = pan;
                    }
                }
                var _msgMode = !data.msgMode ? 'append' : data.msgMode;//append first
                var _getValMethod = data.getValMethod;

                //process

                var process = function (index, element, this_) {
                    if (!this_) {
                       this_ = $(this);
                    }
                    var val_ = undefined;
                    if (!!_getValMethod) {
                        val_ = _getValMethod(this_);
                    } else {
                        val_ = this_.val();
                    }
                    var ok_ = true;
                    for (var _ in validMethods) {
                        var res = validMethods[_](val_);// {'status': [ Boolean ], 'message': [ String ]}
                        if (!!res['status']) {
                            continue;
                        }
                        ok_ = false, msgPanel.text('');
                        if (!!msgPanel) {
                            var b_ = false;
                            switch (_msgMode) {
                                case 'first':
                                    msgPanel.text(res['message']);
                                    b_ = true;
                                    break;
                                case 'append':
                                default:
                                    var rawText = msgPanel.text();
                                    msgPanel.text(rawText + res['message']);// TODO split message
                                    break;
                            }
                            if (b_) {
                                break;
                            }
                        }
                    }
                    if (ok_) {
                        if (!!_correctClassName && _correctClassName.length > 0) {
                            this_.addClass(_correctClassName);
                            (function (this_, _correctClassName) {
                                this_.one('change', function () {// TODO custom event
                                    this_.removeClass(_correctClassName);
                                });
                            })(this_, _correctClassName);
                        }
                    } else {
                        msgPanel.css('display', 'block');// TODO custom display show mode
                        if (!!_failedClassName && _failedClassName.length > 0) {
                            this_.addClass(_failedClassName);
                            (function (this_, _failedClassName, msgPanel) {
                                this_.one('change', function () {// TODO custom event
                                    this_.removeClass(_failedClassName);
                                    msgPanel.css('display', '');// TODO custom display hidden mode
                                });
                            })(this_, _failedClassName, msgPanel);
                        }
                    }
                    return ok_;
                };
                process['els'] = els;
                els.each(function () {
                    var this_ = $(this);
                    for (var _ in _eventNames) {
                        this_.bind(_eventNames[_], process);
                    }
                });

                //register

                items.push(data);
                _ps.push(process);

            },
            methods: {
                require: function (val) {
                    if (!val || val.length === 0) {
                        return {
                            status: false,
                            message: 'Field is required'// message template
                        };
                    }
                },
                ipAddress: function (val) { },
                dateTime: function (val) { },
                port: function (val) { },
            }
        }
    });

})(jQuery);
