// <editor-fold defaultstate="collapsed" desc="Default Functions. Click on the + sign on the left to edit the code."> 
Object.values = Object.values || function (o) {
    var values = [];
    Object.keys(o).forEach(function (k) {
        values.push(o[k]);
    });
    return values;
};
//</editor-fold>

((self) => {
    // <editor-fold defaultstate="collapsed" desc="Default Functions. Click on the + sign on the left to edit the code."> 
    self.isNullable = function ($this) {
        return $this === null || $this === undefined;
    };

    self.isDate = function ($this) {
        if (!$this)
            return false;

        if (isNumber($this)) {
            if (String($this).length !== 13) {
                return false;
            }
            $this = new Date($this);
        }
        if (isString($this)) {
            $this = Dates.parse($this);
        }
        if (!$this)
            return false;
        if (isObject($this) && 'seconds' in $this && 'nanoseconds' in $this) {
            $this = Dates.parse($this);
        }
        return $this instanceof Date;
    };

    self.isString = function ($this) {
        return $this instanceof String || typeof $this === 'string';
    };

    self.isNumber = function ($this) {
        return $this instanceof Number || typeof $this === 'number';
    };

    self.isBoolean = function ($this) {
        return $this instanceof Boolean || typeof $this === 'boolean';
    };

    self.isObject = function ($this) {
        return $this instanceof Object || typeof $this === 'object';
    };

    self.isFunction = function ($this) {
        return $this instanceof Function || typeof $this === 'function';
    };

    self.isArray = function ($this) {
        return Array.isArray($this);
    };

    self.isBinary = function ($this) {
        return /^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.isArrayBuffer = function ($this) {
        return /^\[object\s(?:ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.isBlob = function ($this) {
        return /^\[object\s(?:Blob|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.forEach = function (self, param, callback, doneCallback) {
        if (param && isFunction(param)) {
            doneCallback = callback;
            callback = param;
            param = null;
        }
        var lastInx, len = 0;
        for (var n in self) {
            var val = self[n];

            if (val !== undefined && val !== null && ((param && param.includeFunction && isFunction(val)) || !isFunction(val))) {
                lastInx = n;
                len++;
                var value = callback.call(val, n, val);
                if (value !== undefined && value !== null && isBoolean(value) && !value) {
                    break;
                }
            }
        }
        if (doneCallback) {
            doneCallback(lastInx, len);
        }
        return self;
    };

    self.jsonObjectString = function (self, param) {
        function getName(name) {
            if (name.contains('.') || name.contains(':') || name.contains('-')) {
                return '"' + name + '":';
            } else {
                return name + ':';
            }
        }
        var source = '{';
        if (self.nodeName) {
            if (self.nodeName() === 'form') {
                self.find('textarea, select, input:not(button)').each(function (n) {
                    var $this = $(this);
                    if (($this.attr('name') !== undefined && $.trim($this.attr('name')).length > 0) ||
                            ($this.attr('id') !== undefined && $.trim($this.attr('id')).length > 0)) {
                        if ($this.attr('type') === 'radio') {
                            if ($this.data('checked') === true) {
                                source += getName($this.attr('name') || $this.attr('id'));
                                source += '"' + $this.val() + '",';
                            }
                        } else if ($this.attr('type') === 'checkbox') {
                            try {
                                source += getName($this.attr('name') || $this.attr('id'));
                                source += '"' + $this.prop('checked') + '",';
                            } catch (e) {
                                if ($this.data('checked')) {
                                    source += getName($this.attr('name') || $this.attr('id'));
                                    source += '"' + $this.data('checked') + '",';
                                } else {
                                    source += getName($this.attr('name') || $this.attr('id'));
                                    source += '"' + false + '",';
                                }
                            }
                        } else {
                            if (($this.val() !== undefined || $this.val() !== null) && $.trim($this.val()).length > 0) {
                                var val = $this.val();
                                if (val.contains('\\')) {
                                    val = val.replace('\\', '/');
                                }
                                source += getName($this.attr('name') || $this.attr('id'));
                                if ($this.attr('object-type') === undefined) {
                                    source += '"' + val + '",';
                                } else {
                                    if ($this.attr('object-type') === 'entity') {
                                        if ($this.attr('has-data') === 'true') {
                                            source += $this.find('option:selected').data('record') + ',';
                                        }
                                    } else {
                                        source += val + ',';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } else {
            forEach(self, param, function (self, n, array) {
                source += getName(n);
                if (isString(self)) {
                    source += '"' + self + '",';
                } else if (isNumber(self) || isBoolean(self)) {
                    source += self + ',';
                } else if (isFunction(self) && param && param.includeFunction) {
                    source += self.toString() + ',';
                } else if (isArray(self)) {
                    source += self.jsonArrayString(param) + ',';
                } else if (isObject(self)) {
                    source += jsonObjectString(self, param) + ',';
                }
            });
        }

        if (self !== null && source !== "{") {
            source = source.substring(0, source.length - 1);
        }
        source += '}';
        return source;
    };

    self.toNoneNullObject = function (obj) {
        const o = {};
        Object.keys(obj).filter(k => !!obj[k]).forEach(k => {
            o[k] = obj[k];
        });
        return !Object.keys(o).isEmpty() ? o : null;
    };
    self.isGetter = function (obj, prop) {
        const res = Object.getOwnPropertyDescriptor(obj, prop);
        return res && !!res['get'];
    };
    self.isSetter = function (obj, prop) {
        const res = Object.getOwnPropertyDescriptor(obj, prop);
        return res && !!res['set'];
    };
//</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="String Functions. Click on the + sign on the left to edit the code."> 
    String.prototype.foreach = function (callback, doneCallback) {
        var self = this;
        var lastInx, len = 0;
        for (var n = 0; n < self.length; n++) {
            var val = self[n];
            lastInx = n;
            len++;
            var value = callback.call(val, parseInt(n), val);
            if (value !== undefined && value !== null && value instanceof Boolean && !value) {
                break;
            }
        }
        if (doneCallback) {
            doneCallback(lastInx, len);
        }
        return self;
    };

    String.prototype.toCapitalCase = function () {
        var self = this;
        return self.split(' ').map(w => w.toTitleCase()).join(' ');
    };

    String.prototype.toTitleCase = function () {
        var self = this;
        var c = self.charAt(0).toUpperCase();
        self = c + self.substring(1, self.length);
        return self;
    };

    String.prototype.toSentenceCase = function () {
        var self = this;
        var c = self.charAt(0).toUpperCase();
        self = c + self.substring(1, self.length).toLowerCase();
        return self;
    };

    String.prototype.isEmpty = function () {
        return this.trimLeft().trimRight().replaceAll(' ', '').length === 0;
    };

    String.prototype.startsWith = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        var self = this;
        if (!self.contains(str)) {
            return false;
        }

        var len = str.length;
        return (str === self.substring(0, len));
    };

    String.prototype.endsWith = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        var self = this;
        if (!self.contains(str)) {
            return false;
        }

        var len = str.length;
        return (str === self.substring(self.length - len, self.length));
    };

    String.prototype.contains = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        var self = this;
        return (self.indexOf(str) > -1);
    };

    String.prototype.trimLeft = function () {
        var self = this;
        var head = 0;

        while (/[\s\uFEFF\u00A0]/.test(self[head])) {
            head++;
        }

        return self.slice(head, self.length);
    };

    String.prototype.trimRight = function () {
        var self = this;
        var tail = self.length;

        while (/[\s\uFEFF\u00A0]/.test(self[tail - 1])) {
            tail--;
        }

        return self.slice(0, tail);
    };

    String.prototype.replaceAll = function (searchValue, value) {
        if ((searchValue === undefined || searchValue === null) || (value === undefined || value === null)) {
            return this;
        }

        var self = this.trimLeft().trimRight();

        for (var n = 0; n < self.length; n++) {
            if (self.charAt(n) === searchValue) {
                self = self.replace(searchValue, value);
            }
        }

        return self;
    };

    String.prototype.noSpace = function () {
        return this.replaceAll(' ', '');
    };

    String.prototype.filterToEnglishCharactors = function () {
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (!((self.charCodeAt(n) >= 97 && self.charCodeAt(n) <= 122) || (self.charCodeAt(n) >= 65 && self.charCodeAt(n) <= 90))) {
                self = self.replace(self.charAt(n), '_');
            }
        }
        return self;
    };

    String.prototype.reverse = function () {
        var self = '';
        for (var n = this.length - 1; n >= 0; n--) {
            self += this[n];
        }
        return self;
    };

    String.prototype.isCreditCardNumber = function () {
        if (this.isEmpty()) {
            return false;
        }
        var self = this.replaceAll(' ', '');

        for (var n = 0; n < self.length; n++) {
            if ((self.substring(n, n + 1) < "0") || (self.substring(n, n + 1) > "9")) {
                return false;
            }
        }

        var no_digit = self.length;
        var oddoeven = no_digit & 1;
        var sum = 0;
        for (var count = 0; count < no_digit; count++) {
            var digit = parseInt(self.charAt(count));
            if (!((count & 1) ^ oddoeven)) {
                digit *= 2;
                if (digit > 9)
                    digit -= 9;
            }

            sum += digit;
        }

        if (sum === 0) {
            return false;
        }
        if (sum % 10 === 0) {
            return true;
        }
        return true;
    };

    String.prototype.isEmailAddress = function () {
        if (this.isEmpty()) {
            return false;
        }
        var self = this.replaceAll(' ', '');

        // TLD checking turned off by default
        var checkTLD = 0;
        var knownDomsPat = /^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;
        var emailPat = /^(.+)@(.+)$/;
        var specialChars = "\\(\\)><@,;:\\\\\\\"\\.\\[\\]";
        var validChars = "[^\\s" + specialChars + "]";
        var quotedUser = "(\"[^\"]*\")";
        var ipDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
        var atom = validChars + '+';
        var word = "(" + atom + "|" + quotedUser + ")";
        var userPat = new RegExp("^" + word + "(\\." + word + ")*$");
        var domainPat = new RegExp("^" + atom + "(\\." + atom + ")*$");
        var matchArray = self.match(emailPat);
        if (matchArray === null) {
            return false;
        }
        var user = matchArray[1];
        var domain = matchArray[2];
        for (i = 0; i < user.length; i++) {
            if (user.charCodeAt(i) > 127) {
                return false;
            }
        }
        for (i = 0; i < domain.length; i++) {
            if (domain.charCodeAt(i) > 127) {
                return false;
            }
        }
        if (user.match(userPat) === null) {
            return false;
        }
        var IPArray = domain.match(ipDomainPat);
        if (IPArray !== null) {
            for (var i = 1; i <= 4; i++) {
                if (IPArray[i] > 255) {
                    return false;
                }
            }
            return true;
        }
        var atomPat = new RegExp("^" + atom + "$");
        var domArr = domain.split(".");
        var len = domArr.length;
        for (i = 0; i < len; i++) {
            if (domArr[i].search(atomPat) === -1) {
                return false;
            }
        }
        if (checkTLD && domArr[domArr.length - 1].length !== 2 &&
                domArr[domArr.length - 1].search(knownDomsPat) === -1) {
            return false;
        }
        if (len < 2) {
            return false;
        }
        return true;
    };

    String.prototype.isPhoneNumber = function (cb) {
        if (this.isEmpty()) {
            return false;
        }
        var self = this.replaceAll(' ', '');

        var reg = /^([()0-9+-\s])+$/;
        if (!reg.test(self)) {
            return false;
        }

        if (self.contains('(') && !self.startsWith('(')) {
            return false;
        }
        if (self.contains('+') && !self.contains('(') && !self.startsWith('+')) {
            return false;
        }

        function checkCharCount(c) {
            if (self.contains(c)) {
                var count = 0;
                self.foreach(function (n, $this) {
                    if (c === $this) {
                        count++;
                    }
                });
                return count > 1;
            }
            return false;
        }

        if (checkCharCount('+')) {
            return false;
        }
        if (checkCharCount('(')) {
            return false;
        }
        if (checkCharCount(')')) {
            return false;
        }

        if ((self.contains('(') && !self.contains(')')) || !self.contains('(') && self.contains(')')) {
            return false;
        } else {
            if (self.indexOf('(') > self.indexOf(')')) {
                return false;
            }
            if (self.indexOf('(') + 1 === self.indexOf(')')) {
                return false;
            }
        }
        console.log(self)

        return cb.call(self, self);
    };

    String.prototype.isNumeric = function () {
        if (this.isEmpty()) {
            return false;
        }
        var self = this.replaceAll(' ', '');

        var validChars = "1234567890.";
        var pos = (self.trim().charAt(0) === '+' || self.trim().charAt(0) === '-') ? 1 : 0;
        var found = true;
        var dots = 0;
        self.foreach(function (n, $this) {
            if ($this === '.') {
                dots++;
            } else {
                if (pos <= n && !validChars.contains($this)) {
                    found = false;
                }
            }
        });
        return dots <= 1 && found;
    };

    String.prototype.isAlphaNumeric = function () {
        if (this.isEmpty()) {
            return false;
        }
        var self = this.replaceAll(' ', '');

        var validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", validNums = "1234567890";
        var charFound = false, numFound = false;
        self.foreach(function (n, $this) {
            if (validChars.contains($this)) {
                charFound = true;
            } else if (validNums.contains($this)) {
                numFound = true;
            }
            if (charFound && numFound) {
                //found;
            }
        });
        return (charFound && numFound);
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Number Functions. Click on the + sign on the left to edit the code."> 
    Number.prototype.foreach = function (callback, doneCallback) {
        var self = this;
        var str = self.toString();
        str.foreach(function (n, $this) {
            var value = callback.call(new Number($this), parseInt(n), new Number($this));
            if (value !== undefined && value !== null && isBoolean(value) && !value) {
                return false;
            }
        }, doneCallback);
        return self;
    };

    Number.prototype.foreachNumber = function (start, callback) {
        if (!callback) {
            callback = start;
            start = undefined;
        }
        var self = this;
        for (var n = start || 0; n <= self; n++) {
            var value = callback.call(n, n);
            if (value !== undefined && value !== null && isBoolean(value) && !value) {
                return false;
            }
        }
        return self;
    };

    Number.prototype.toSplittedNumber = function () {
        var str = this.toString().split('.');
        var val = '';
        var i = 1;
        for (var n = str[0].length; n > 0; n--) {
            val += i % 3 === 0 ? str[0][n - 1] + ',' : str[0][n - 1];
            i++;
        }
        if (val.endsWith(',')) {
            val = val.substring(0, val.length - 1);
        }
        val = val.reverse();
        if (str.length === 2) {
            val = val + '.' + str[1];
        }

        return val;
    };

    Number.prototype.toCurrency = function () {
        var val = this.toSplittedNumber();
        var str = val.split('.');
        if (str.length === 2 && (str[1].length === 1)) {
            val = val + '0';
        } else if (str.length === 1) {
            val = val + '.00';
        }

        return arguments.length > 0 ? (arguments[0] + '' + val) : val;
    };

    Number.prototype.toCurrencyNoCents = function () {
        var val = this.toSplittedNumber();
        var str = val.split('.');
        if (str.length === 2) {
            val = str[0];
        }

        return arguments.length > 0 ? (arguments[0] + '' + val) : val;
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Array Functions. Click on the + sign on the left to edit the code."> 
    Array.prototype.getValue = function (key) {
        var self = this;
        var val = null;
        self.forEach(function ($this, n, array) {
            if ($this[key]) {
                val = $this[key];
                return false;
            }
        });
        return val;
    };

    Array.prototype.getEntry = function (key) {
        var self = this;
        var obj = null;
        self.forEach(function ($this, n, array) {
            if ($this[key]) {
                obj = $this;
                return false;
            }
        });
        return obj;
    };

    Array.prototype.getFirstElement = function () {
        return this[0];
    };

    Array.prototype.getLastElement = function () {
        return this[this.length - 1];
    };

    Array.prototype.find = Array.prototype.find || function (test) {
        if (test === undefined || test === null) {
            return null;
        }
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.splitAt = function (chunkLen) {
        if (chunkLen === undefined || chunkLen === null) {
            return this;
        }
        var self = this;
        var newList = [];

        var idx = 0;
        var list = [];
        for (var n = 1; n <= self.length; n++) {
            var item = self[n - 1];
            if (item) {
                if (n % chunkLen !== 0) {
                    list.push(item);
                } else {
                    list.push(item);
                    newList[idx++] = list;
                    list = [];
                }
            }
        }
        if (!list.isEmpty())
            newList[idx] = list;
        return newList;
    };

    Array.prototype.isEmpty = function () {
        return this.length === 0;
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (elt) {
        if (elt === undefined || elt === null) {
            return -1;
        }
        var self = this;
        var len = self.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in self && self[from] === elt)
                return from;
        }
        return -1;
    };

    Array.prototype.indexOfWithPredicate = function (test) {
        if (test === undefined || test === null) {
            return -1;
        }
        var self = this;
        var n = self.length - 1;

        do {
            if (test(self[n], n))
                return n;
            n--;
        } while (n >= 0)

        return -1;
    };

    Array.prototype.contains = function (val) {
        if (val === undefined || val === null) {
            return false;
        }
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (self[n] === val) {
                return true;
            }
        }
        return false;
    };

    Array.prototype.containsAll = function (val) {
        if (val === undefined || val === null) {
            return false;
        }
        let self = this;
        if (isArray(val)) {
            if (val.isEmpty()) {
                return false;
            }
            let found = true;

            for (let n = 0; n < val.length; n++) {
                if (!self.contains(val[n])) {
                    return false;
                }
            }
            return found;
        } else {
            for (let n = 0; n < self.length; n++) {
                if (self[n] === val) {
                    return true;
                }
            }
        }
        return false;
    };

    Array.prototype.remove = function (val) {
//        console.log('rem2-test1', val.id)
        if (val === undefined || val === null) {
            return false;
        }
//        console.log('rem2-test2', val.id)
        let self = this;
        let found = false;
        if (isArray(val)) {
            for (let n = 0; n < val.length; n++) {
                if (!(found = self.remove(val[n]))) {
                    break;
                }
            }
        } else {
//            console.log('rem2-test3', val.id)
            for (let n = 0; n < self.length; n++) {
//                console.log('rem2-test' + (4 + n), val.id)
                if (self[n] === val) {
//                    console.log('rem2-', n, val.id)
                    found = self.splice(n, 1);
                    break;
                }
            }
        }
        return found;
    };

    Array.prototype.removeFirst = function () {
        return this.splice(0, 1)[0];
    };
    Array.prototype.removeLast = function () {
        return this.splice(this.length - 1, 1)[0];
    };
    Array.prototype.removeAt = function (idx) {
        if (idx === undefined || idx === null || !isNumber(idx)) {
            return false;
        }
        return this.splice(idx, 1);
    };
    Array.prototype.removeIf = function (test) {
        if (test === undefined || test === null) {
            return false;
        }
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return self.splice(n, 1);
            }
        }
        return false;
    };
    Array.prototype.removeAllIf = function (test) {
        if (test === undefined || test === null) {
            return false;
        }
        const self = this;
        const removed = [];
        for (let n = 0; n < self.length; n++) {
            const val = self[n];
            if (test(val, n)) {
                removed.push(val);
                self.splice(n, 1);
            }
        }
        return removed;
    };
    Array.prototype.replace = function (val, supplier) {
        if (supplier === undefined || supplier === null) {
            return null;
        }
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (self[n] === val) {
                self[n] = supplier(self[n]);
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.replaceIf = function (val, test) {
        if (test === undefined || test === null) {
            return null;
        }
        var self = this;
        for (var n = 0; n < self.length; n++) {
            if (test(self[n])) {
                self[n] = val;
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.clear = function () {
        var self = this;
        self.splice(0, self.length);
    };

    Array.prototype.pushFirst = function (val) {
        this.insertAt(0, val);
    };

    Array.prototype.pushAllFirst = function (val) {
        var n = val.length - 1;

        do {
            this.insertAt(0, val[n]);
            n--;
        } while (n >= 0);

    };

    Array.prototype.insertAt = function (index, val) {
        if (val === undefined || val === null) {
            return this;
        }
        var self = this;
        if (self.isEmpty()) {
            self.push(val);
        } else {
            self.splice(index, 0, val);
        }
    };

    Array.prototype.pushAll = function (val) {
        if (val === undefined || val === null) {
            return this;
        }
        var self = this;
        if (isArray(val)) {
            if (!val.isEmpty()) {
                for (var n = 0; n < val.length; n++) {
                    var $this;
                    if (!self.contains($this = val[n])) {
                        self.push($this);
                    }
                }
            }
        } else {
            self.push(val);
        }
        return self;
    };

    Array.prototype.spliceAll = function (index, n, val) {
        if (!val || !isArray(val)) {
            return this;
        }
        return this.splice.apply(this, val.unshift(index, n));
    };

    Array.prototype.retainAll = function (val, test) {
        if (val === undefined || val === null) {
            return this;
        }
        var self = this;
        if (isArray(val)) {
            if (!val.isEmpty()) {
                for (var n = 0; n < self.length; n++) {
                    var $this;
                    if (test !== undefined && test !== null) {
                        if (test($this = self[n])) {
                            self.remove($this);
                        }
                    } else {
                        if (!val.contains($this = self[n])) {
                            self.remove($this);
                        }
                    }
                }
                self.pushAll(val);
            }
        } else {
            self.push(val);
        }
        return self;
    };

    Array.prototype.anyMatch = function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in anyMatch function');
        }
        var self = this;
        if (self.isEmpty()) {
            return false;
        }
        for (var n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return true;
            }
        }
        return false;
    };
    Array.prototype.noneMatch = function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in noneMatch function');
        }
        var self = this;
        if (self.isEmpty()) {
            return true;
        }
        for (var n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.allMatch = function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in allMatch function');
        }
        var self = this;
        if (self.isEmpty()) {
            return false;
        }
        for (var n = 0; n < self.length; n++) {
            if (!test(self[n], n)) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.groupBy = function (prop) {
        const accumulate = (acc, key, val) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(val);
        };

        if (isFunction(prop)) {
            const supplier = prop;
            const acc = {};
            this.forEach(v => {
                const key = supplier(v);
                if (isArray(key)) {
                    key.forEach(key => {
                        accumulate(acc, key, v);
                    });
                } else {
                    accumulate(acc, key, v);
                }
            });
            return acc;
        } else {
            const props = prop.split('.');
            return this.reduce((acc, obj) => {
                if (props.length === 1) {
                    const key = obj[prop];
                    accumulate(acc, key, obj);
                } else {
                    const prop1 = props[0];
                    if (prop1 in obj) {
                        const prop2 = props[1];
                        const obj2 = obj[prop1];
                        if (prop2 in obj2) {
                            const key = obj2[prop2];
                            accumulate(acc, key, obj);
                        }
                    }
                }
                return acc;
            }, {});
        }
    };

    Array.prototype.sortBy = function (prop, dir) {
        const props = prop.split('.');
        this.sort((a, b) => {
            if (props.length === 1) {
                if (a[prop] > b[prop])
                    return dir === 'desc' ? -1 : 1;
                if (a[prop] < b[prop])
                    return dir === 'desc' ? 1 : -1;
                return 0;
            } else {
                const prop1 = props[0];
                if (prop1 in a && prop1 in b) {
                    const prop2 = props[1];
                    const a1 = a[prop1];
                    const b1 = b[prop1];
                    if (prop2 in a1 && prop2 in b1) {
                        const aa = a1[prop2];
                        const bb = b1[prop2];
                        if (aa > bb)
                            return dir === 'desc' ? -1 : 1;
                        if (aa < bb)
                            return dir === 'desc' ? 1 : -1;
                    }
                }
                return 0;
            }
        });
    };

    Array.prototype.distinct = function (test) {
        let array;
        if (isFunction(test)) {
            array = this.filter(test);
        } else if (isString(test)) {
            const key = test;
            array = this.filter(function (value, index, self) {
                return self.indexOfWithPredicate((v, n) => v[key] === value[key]) === index;
            });
        } else {
            array = this.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
        }
        return Array.from(new Set(array.map(JSON.stringify))).map(JSON.parse);
    };

    Array.prototype.min = function (supplier) {
        if(supplier) {
            return Math.min(...this.map(supplier));
        }
        return Math.min(...this);
    };

    Array.prototype.max = function (supplier) {
        if(supplier) {
            return Math.max(...this.map(supplier));
        }
        return Math.max(...this);
    };

    Array.range = function (min, max, step = 1){
        return Array.from({length: (max - min) / step + 1}, (_, n) => min + (n * step));
    };

    Array.prototype.fromArgs = Array.prototype.fromArguments = function (...args) {
        return args;
    };

    Array.fromArgs = Array.fromArguments = function (...args) {
        return args;
    };

    Array.prototype.toObject = function () {
        return {...this};
    };

    Array.prototype.jsonArrayString = function (param) {
        var self = this;
        var source = '[';
        self.forEach(function (self, n, array) {
            if (isString(self)) {
                source += '"' + self + '",';
            } else if (isNumber(self) || isBoolean(self)) {
                source += self + ',';
            } else if (isFunction(self) && param && param.includeFunction) {
                source += self.toString() + ',';
            } else if (isArray(self)) {
                source += self.jsonArrayString(param) + ',';
            } else if (isObject(self)) {
                source += jsonObjectString(self, param) + ',';
            }
        });

        if (self !== null && source !== "[") {
            source = source.substring(0, source.length - 1);
        }
        source += ']';
        return source;
    };
    //</editor-fold>
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);
