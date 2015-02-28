ResourcePacker = function (packageURL, callback) {
    this.packageURL = packageURL;
    this.callback = callback;
    this.out = {};
    this.getPackage();
};

ResourcePacker.prototype = {
    getPackage: function () {
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.time("readingBytes");
                    var packageBlob = this.response;
                    var reader = new FileReader();
                    reader.onload = function () {
                        console.timeEnd("readingBytes");
                        console.time("dataRead");
                        var data = new Uint8Array(reader.result);
                        that.readData(data);
                        console.timeEnd("dataRead");
                    };
                    reader.readAsArrayBuffer(packageBlob);
                } else {
                    throw "Can't load package from server";
                }
            }
        };
        xhr.open('GET', this.packageURL);
        xhr.responseType = 'blob';
        xhr.send();
    },
    toDecimal: function (blob) {
        var out = 0;
        for (var i = 0, cnt = blob.length; i < cnt; i++) {
            if (i !== 0) {
                out <<= 8;
            }
            out |= blob.slice(i, i + 1).charCodeAt(0);
        }
        return out;
    },
    arrayToDecimal: function (array) {
        var out = 0;
        for (var i = 0, cnt = array.length; i < cnt; i++) {
            if (i !== 0) {
                out <<= 8;
            }
            out |= array[i];
        }
        return out;
    },
    arrayToString: function (array) {
        var out = "";
        for (var i = 0, cnt = array.length; i < cnt; i++) {
            out += String.fromCharCode(array[i]);
        }
        return out;
    },
    readData: function (data) {
        var frameStart = 0;

        var FILE_SIZE_LENGTH = 4;
        var MIME_LENGTH = 4;
        var FILENAME_LENGTH = 4;
        do {
            var index = frameStart;
            var file = {};

            var mimeTypeLength = this.arrayToDecimal(data.subarray(index, index + MIME_LENGTH));
            index += MIME_LENGTH;
            file.type = this.arrayToString(data.subarray(index, index + mimeTypeLength)).trim();
            index += mimeTypeLength;
            var filenameLength = this.arrayToDecimal(data.subarray(index, index + FILENAME_LENGTH));
            index += FILENAME_LENGTH;
            file.filename = this.arrayToString(data.subarray(index, index + filenameLength)).trim();
            index += filenameLength;
            var fileSize = this.arrayToDecimal(data.subarray(index, index + FILE_SIZE_LENGTH));
            index += FILE_SIZE_LENGTH;
            file.data = new Blob([data.subarray(index, index + fileSize)], {type: file.type});

            if(file.data.size > 0){
                this.createObject(file);
            }

            frameStart = index + fileSize;
        } while (file.data.size > 0)
        this.callback(this.out);
    },
    createObject: function (obj) {
        var type = obj.type.split("/")[0];
        this.out[type] = this.out[type] || [];
        var url = window.URL.createObjectURL(obj.data);
        var out = {
            filename: obj.filename,
            type: obj.type,
            blobURL: url
        };

        if (type === "image") {
            out.element = document.createElement("img");
            out.element = url;
        } else if (type === "audio" || type === "video") {
            out.element = document.createElement("source");
            out.element.type = obj.type;
            out.element.src = url;
        }
        this.out[type].push(out);
    }
};