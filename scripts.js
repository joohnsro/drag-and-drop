function createDraggableObject( id ) {

    var element = document.getElementById( id ),
        elementSize = { 
            width: element.offsetWidth, 
            height: element.offsetHeight 
        },
        parent  = element.parentElement,
        parentSize = {
            width:  parent.offsetWidth,
            height: parent.offsetHeight,
        },
        parentPosition = {
            top: parent.offsetTop,
            left: parent.offsetLeft,
        },
        dragged,
        action,
        dropped;
    
    function start() {

        element.addEventListener( 'mousedown', function( event ){

            if ( dropped ) return;

            dragged = true;
            element.classList.add( 'dragged' );
        
            parent.addEventListener( 'mousemove', moveElement );
        });
    
        element.addEventListener( 'mouseup', dropElement);
        parent.addEventListener( 'mouseleave', dropElement);
    }

    function addActionOnPlace( id, callback = function(){} ) {
        var placeElement = document.getElementById( id );
        action = {
            element: placeElement,
            size: {
                width: placeElement.offsetWidth,
                height: placeElement.offsetHeight,
            },
            placement: {
                top: placeElement.offsetTop,
                right: placeElement.offsetLeft + placeElement.offsetWidth,
                left: placeElement.offsetLeft,
                bottom: placeElement.offsetTop + placeElement.offsetHeight
            },
            draggable: element,
            callback: callback,
        }
        
    }

    function wasDroppedInside() {
        var mouse = getMousePosition();

        var placement = action.placement;

        if ( mouse.top > placement.top + parentPosition.top && mouse.top < placement.bottom + parentPosition.top && 
             mouse.left > placement.left + parentPosition.top && mouse.left < placement.right + parentPosition.left ) {

            return true;
        }

        return false;
    }

    function getMousePosition() {
        return {
            top: window.event.clientY,
            left: window.event.clientX,
        }
    }

    function moveElement() {
        if ( dragged ) {

            var mouse = getMousePosition();

            var draggableNewTop = ( mouse.top - 8 - draggable.offsetHeight / 2 ) - parentPosition.top,
                draggableNewLeft = ( mouse.left - 8 - draggable.offsetWidth / 2 ) - parentPosition.left;

            if ( draggableNewTop < parentSize.height - elementSize.height && draggableNewTop > 0 ) {
                draggable.style.top   = draggableNewTop + 'px';
            }

            if ( draggableNewLeft >= 0 && draggableNewLeft <= parentSize.width - elementSize.width ) {
                draggable.style.left  = draggableNewLeft + 'px';
            }
            
        }
    }

    function setActionPlacement() {
        action.placement = {
            top: action.element.offsetTop,
            right: action.element.offsetLeft + action.element.offsetWidth,
            left: action.element.offsetLeft,
            bottom: action.element.offsetTop + action.element.offsetHeight
        };
    }

    function dropElement() {
        if ( dragged ) {

            if ( action && wasDroppedInside() ) {
                dropped = true;

                action.callback();
            }

            element.classList.remove( 'dragged' );
            dragged = false;

        }
    }
    
    return {
        start,
        addActionOnPlace
    }
}