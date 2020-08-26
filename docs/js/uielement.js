class uielement {
    constructor(x, y, innerHtml) {
        let dom = document.getElementById('uielements');
        this.domElement = document.createElement('div');
        this.domElement.className = 'uielement';
        this.domElement.style.top = (y ? y : 0) + 'px';
        this.domElement.style.left = (x ? x : 0) + 'px';
        if(innerHtml) {
            this.domElement.innerHTML = innerHtml;
        }
        dom.appendChild(this.domElement);
    }
}

class tempUiElement extends uielement {
    constructor(x, y, timeout, innerHtml) {
        super(x, y, innerHtml);
        this.timeout = timeout || 800;
        let me = this;
        setTimeout(function(){me.destroy()}, this.timeout)
    }

    destroy() {
        this.domElement.remove();
    }
}

class damageNotification extends tempUiElement {
    constructor(x, y, damage) {
        let damageMessage = damage + 'dmg';        
        let inner = '<div class="damageItem">' + damageMessage + '</div>';
        super(x, y, null, inner);
        this.domElement.className = this.domElement.className + ' damageNotification';
        this.domElement.style.top = (y - 10) + 'px'

    }
}