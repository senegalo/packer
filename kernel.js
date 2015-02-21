var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            //this.response is what you're looking for
            console.time("readingBytes");
            var packageBlob = this.response;
            var reader = new FileReader();
            reader.onload = function () {
                console.timeEnd("readingBytes");
                console.time("dataRead");
                var data = new Uint8Array(reader.result);
                readData(data);
                console.timeEnd("dataRead");
            };
            reader.readAsArrayBuffer(packageBlob);
        } else {
            throw "Can't load audio from remote server";
        }
    }
};
xhr.open('GET', "packed.nzp");
xhr.responseType = 'blob';
xhr.send();

var toDecimal = function (blob) {
    var out = 0;
    for (var i = 0, cnt = blob.length; i < cnt; i++) {
        if (i !== 0) {
            out <<= 8;
        }
        out |= blob.slice(i, i + 1).charCodeAt(0);
    }
    return out;
};

var arrayToDecimal = function (array) {
    var out = 0;
    for (var i = 0, cnt = array.length; i < cnt; i++) {
        if (i !== 0) {
            out <<= 8;
        }
        out |= array[i];
    }
    return out;
};

var arrayToString = function (array) {
    var out = "";
    for (var i = 0, cnt = array.length; i < cnt; i++) {
        out += String.fromCharCode(array[i]);
    }
    return out;
};

var readData = function(data){
    var frameStart = 0;
    var frameLengthSize = 4;
    var mimeLengthSize = 4;
    do {
        var mimeLengthStart = frameStart+frameLengthSize;
        var mimeTypeStart = mimeLengthStart+mimeLengthSize;
        
        var currentFrameSize = arrayToDecimal(data.subarray(frameStart,frameStart+frameLengthSize));
       if(currentFrameSize === 0){
            break;
        }
        
        var mimeTypeLength = arrayToDecimal(data.subarray(mimeLengthStart, mimeTypeStart));
        var dataStart = mimeTypeStart+mimeTypeLength;
        
        var mimeType = arrayToString(data.subarray(mimeLengthStart+mimeLengthSize, dataStart)).trim();
        console.log(mimeType);
        
        var imageBlob = new Blob([data.subarray(dataStart,dataStart+currentFrameSize)], {type: mimeType});
        
        //var imageBlob = new Blob([new Uint8Array(data.slice())], {type: "image/jpeg"});
        var imgUrl = window.URL.createObjectURL(imageBlob);
        var img = document.createElement("img");
        img.src = imgUrl;
        document.body.appendChild(img);
        frameStart += frameLengthSize+mimeLengthSize+mimeTypeLength+currentFrameSize ;
    } while(imageBlob.size > 0)
};