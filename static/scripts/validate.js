// Create by CodeMeow5

(function ($) {

    $.extend({
        validate: {
            items: [],
            _ps: [],
            check: function () {
                var that = this;
                var ok_ = true;
                for (var _ in that._ps) {
                    var els = that._ps[_]['els'];
                    els.each(function () {
                        var this_ = $(this);
                        ok_ = that._ps[_](null, null, this_) && ok_;
                    });
                }
                return ok_;
            },
            register: function (data) {
                var that = this;
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
                        var m = that.methods[_validMethodNames[_]];
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
                    var pan = $('.' + _msgPanel);
                    if (pan.size() > 0) {
                        msgPanel = pan;
                    }
                }
                var _msgMode = !data.msgMode ? 'first' : data.msgMode;//append first
                var _getValMethod = data.getValMethod;
                data.messages = {};

                //process

                var process = function (index, element, this_) {
                    if (!this_) {
                       this_ = $(this);
                    }
                    var name_ = '__' + Math.ceil(Math.random() * 9999) + '__';
                    var attrName = this_.attr('name');//TODO custom attribute name
                    if (!!attrName && attrName.length > 0) {
                        name_ = attrName;
                    } else {
                        this_.attr('name', name_);
                    }
                    var val_ = undefined;
                    if (!!_getValMethod) {
                        val_ = _getValMethod(this_);
                    } else {
                        val_ = this_.val();
                    }
                    var ok_ = true;
                    var _messages = data.messages[name_] = [];
                    for (var _ in validMethods) {
                        var res = validMethods[_](val_);// {'status': [ Boolean ], 'message': [ String ]}
                        if (!!res['status']) {
                            continue;
                        }
                        ok_ = false;
                        if (!!msgPanel) {
                            var b_ = false;
                            _messages.push(res['message']);
                            switch (_msgMode) {
                                case 'first':
                                    b_ = true;
                                    break;
                                case 'append':
                                default:
                                    break;
                            }
                            if (b_) {
                                break;
                            }
                        }
                    }
                    msgPanel.html('');
                    var msgTxt = '';
                    for (var name_ in data.messages) {
                        var msgs_ = data.messages[name_];
                        if (!!name_ && name_.length > 0) {
                            for (var _ in msgs_) {
                                if (name_.startsWith('__') && name_.endsWith('__')) {
                                    msgTxt += msgs_[_];//TODO split message
                                } else {
                                    msgTxt += name_ + ': ' + msgs_[_];//TODO split message //TODO format message string
                                }
                                msgTxt += '<BR />';//TODO temp
                            }
                        }
                    }
                    msgPanel.html(msgTxt);

                    if (ok_) {
                        if (!!_correctClassName && _correctClassName.length > 0) {
                            this_.addClass(_correctClassName);
                            this_.removeClass(_failedClassName);
                            //(function (this_, _correctClassName) {
                            //    this_.one('change', function () {// TODO custom event
                            //        this_.removeClass(_correctClassName);
                            //    });
                            //})(this_, _correctClassName);
                        }
                    } else {
                        if (!!_failedClassName && _failedClassName.length > 0) {
                            this_.addClass(_failedClassName);
                            this_.removeClass(_correctClassName);
                            //(function (this_, _failedClassName, msgPanel) {
                            //    this_.one('change', function () {// TODO custom event
                            //        this_.removeClass(_failedClassName);
                            //    });
                            //})(this_, _failedClassName, msgPanel);
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

                that.items.push(data);
                that._ps.push(process);

            },
            methods: {
                require: function (val) {
                    if (!val || val.length === 0) {
                        return {
                            status: false,
                            message: 'Field is required'// message template
                        };
                    }
                    return {
                        status: true
                    }
                },
                ipAddress: function (val) { },
                dateTime: function (val) { },
                port: function (val) { },
            }
        }
    });

})(jQuery);
