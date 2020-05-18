'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DraggableObject = function () {
    function DraggableObject(element, actions) {
        _classCallCheck(this, DraggableObject);

        this.element = element;
        this.dragged = false;
        this.size = this.setSize(element);
        this.parent = this.setParent(element);
        this.initialPosition = this.getPosition(element);
        this.currentPosition = this.getPosition(element);
        this.actions = this.setActionsData(actions);

        this.draggable();
    }

    _createClass(DraggableObject, [{
        key: 'setSize',
        value: function setSize(element) {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
    }, {
        key: 'getPosition',
        value: function getPosition(element) {
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            };
        }
    }, {
        key: 'getPlacement',
        value: function getPlacement(element) {
            return {
                top: element.offsetTop,
                right: element.offsetLeft + element.offsetWidth,
                left: element.offsetLeft,
                bottom: element.offsetTop + element.offsetHeight
            };
        }
    }, {
        key: 'setParent',
        value: function setParent(element) {
            var parent = element.parentElement;

            return {
                element: parent,
                size: this.setSize(parent),
                position: this.getPosition(parent),
                placement: this.getPlacement(parent)
            };
        }
    }, {
        key: 'setActionsData',
        value: function setActionsData(actions) {
            var insertedActions = [];

            actions.forEach(function (action) {
                insertedActions.push({
                    element: action.element,
                    placement: this.getPlacement(action.element),
                    callback: action.callback
                });
            }.bind(this));

            return insertedActions;
        }
    }, {
        key: 'draggable',
        value: function draggable() {
            this.element.addEventListener('mousedown', this.onDrag.bind(this));
            this.element.addEventListener('mouseup', this.onDrop.bind(this));

            this.parent.element.addEventListener('mousemove', this.move.bind(this));
            this.parent.element.addEventListener('mouseleave', this.onDropOut.bind(this));
        }
    }, {
        key: 'onDrag',
        value: function onDrag(event) {
            this.dragged = true;
            this.element.setAttribute('dragged', true);
        }
    }, {
        key: 'onDrop',
        value: function onDrop(event) {
            this.dragged = false;
            this.element.setAttribute('dragged', false);

            if (this.actions.length > 0) {
                this.doActions();
            }
        }
    }, {
        key: 'onDropOut',
        value: function onDropOut(event) {
            if (!this.dragged) return;

            this.element.style.top = this.initialPosition.top;
            this.element.style.left = this.initialPosition.left;

            this.dragged = false;
            this.element.setAttribute('dragged', false);
        }
    }, {
        key: 'move',
        value: function move(event) {
            if (!this.dragged) return;

            var position = {
                top: window.event.clientY - this.size.height / 2 - this.parent.position.top,
                left: window.event.clientX - this.size.width / 2 - this.parent.position.left
            };

            if (position.top <= 0) {
                position.top = 0;
                this.element.style.top = '0px';
            }

            if (position.top > 0 && position.top < this.parent.size.height - this.size.height) {
                this.element.style.top = position.top + 'px';
            }

            if (position.top >= this.parent.size.height - this.size.height) {
                this.element.style.top = this.parent.size.height - this.size.height + 'px';
                position.top = this.parent.size.height - this.size.height;
            }

            if (position.left <= 0) {
                position.left = 0;
                this.element.style.left = '0px';
            }

            if (position.left > 0 && position.left < this.parent.size.width - this.size.width) {
                this.element.style.left = position.left + 'px';
            }

            if (position.left >= this.parent.size.width - this.size.width) {
                this.element.style.left = this.parent.size.width - this.size.width + 'px';
                position.left = this.parent.size.width - this.size.width;
            }

            this.currentPosition = position;
        }
    }, {
        key: 'doActions',
        value: function doActions() {
            this.actions.forEach(function (action) {

                if (this.elementIn(action.placement)) {
                    action.callback();
                }
            }.bind(this));
        }
    }, {
        key: 'elementIn',
        value: function elementIn(placement) {
            var mouse = {
                top: window.event.clientY,
                left: window.event.clientX
            };

            if (mouse.top > placement.top + this.parent.position.top && mouse.top < placement.bottom + this.parent.position.top && mouse.left > placement.left + this.parent.position.top && mouse.left < placement.right + this.parent.position.left) {

                return true;
            }

            return false;
        }
    }]);

    return DraggableObject;
}();