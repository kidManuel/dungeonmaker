function loadData(query) {
    //review with promises
    function failure() {
        devError('can\'t create request for ' + query);
        return null;
    }

    let response;
    let dataRequest = new XMLHttpRequest();
    if (!dataRequest) {
        failure();
    }

    dataRequest.onreadystatechange = function() {
        if (dataRequest.readyState === XMLHttpRequest.DONE) {
            if (dataRequest.status === 200) {
                response = dataRequest.responseText;
            } else {
                failure()
            }
        }
    }

    dataRequest.open('GET', './data/' + query + '.json', false);
    dataRequest.send();
    return JSON.parse(response);
}

function devError(error) {
    // let extraData = '' || Array.from(arguments).splice(0,1);
    if (devmode) {
        throw new Error(error)
    }
}

function devLog(info) {
    if (devmode) {
        console.log(info)
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.last = function() {
    return this[this.length - 1];
};

Array.prototype.removeIndex = function(index) {
    if (typeof index === 'number') {
        var element = this[index];
        this.splice(index, 1)
    }
    return element;
}

Array.prototype.attatch = function(attatchment) {
    this.push.apply(this, attatchment);
    return this;
}

Array.prototype.iterate = function(operation) {
    this.forEach(
        function(value, index, array) {
            if (Array.isArray(array[index])) {
                array[index].iterate(operation);
            } else {
                operation.call(array[index], value, index, array);
            }
        }
    )

    // **** ALTERNATE VARIATION **** //
    // for (var index = 0; index < this.length; index++) {
    //     if (Array.isArray(this[index])) {
    //         this[index].iterate(operation, extraArguments)
    //     } else {
    //         operation.apply(this[index], extraArguments)
    //     }
    // }
}

Array.prototype.merge = function(nextArray) {
    let me = this;
    nextArray.iterate(function(index) {
        if (!me.includes(index)) {
            me.push(index);
        }
    })
    return this;
}

var myArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var testArr = [ //just a silly old array for general purpose testing.
    [0, 39],
    [0, 38],
    [0, 37],
    [1, 39],
    [1, 38],
    [1, 37],
    [2, 39],
    [2, 38],
    [2, 37],
    [3, 39],
    [3, 38],
    [3, 37],
    [4, 39],
    [4, 38],
    [4, 37],
];
