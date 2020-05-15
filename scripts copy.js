(function(){

    var container = document.getElementById( 'container' ),
        draggable = document.getElementById( 'draggable' );

    if ( draggable ) {

        var draggableParent = {
            top: container.offsetTop,
            right: container.offsetLeft + container.offsetWidth,
            bottom: container.offsetTop + container.offsetHeight,
            left: container.offsetLeft,
        }

        var dragged;

        function moveDraggedElement() {
            if ( dragged ) {

                var mouse = {
                    top: window.event.clientY,
                    left: window.event.clientX,
                }

                var draggableNewTop = ( mouse.top - draggable.offsetHeight / 2 ),
                    draggableNewLeft = ( mouse.left - draggable.offsetWidth / 2 );

                if ( draggableNewTop <= container.offsetHeight - 100 && 
                     draggableNewTop >= 0
                ) {
                    draggable.style.top   = draggableNewTop + 'px';
                }

                if ( draggableNewLeft >= 0 && 
                     draggableNewLeft <= container.offsetWidth - 100 
                ) {
                    draggable.style.left  = draggableNewLeft + 'px';
                }
                
            }
        }

        draggable.addEventListener( 'mousedown', function( event ){

            dragged = event.target;

            dragged.style.opacity = .5;

            var position = {
                top: event.target.offsetTop,
                left: event.target.offsetLeft,
            };
            
            container.addEventListener( 'mousemove', moveDraggedElement );
        });

        draggable.addEventListener( 'mouseup', function( event ){
            if ( dragged ) {
                dragged.style.opacity = 1;
                dragged = null;
            }
        });
        
        container.addEventListener( 'mouseleave', function( event ){
            if ( dragged ) {
                dragged.style.opacity = 1;
                dragged = null;
            }
        });

    }

})();