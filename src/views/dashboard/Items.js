// import React, { useState } from 'react'
// import { makeStyles } from '@material-ui/core/styles';
// import { CButton } from '@coreui/react'
import { Draggable } from 'react-beautiful-dnd'
// import OpenWithIcon from '@material-ui/icons/OpenWith';

// const useStyles = makeStyles((theme) => ({
//     item: {
//         background: 'white',
//     },
//     nitem: {
//         background: 'white',
//     },
//     moving: {
//         background: 'lightgreen',
//         opacity: '0.5',
//     }
// }));

const Items = (props) => {
    // const classes = useStyles();
    return (
        <Draggable draggableId={props.extra.name} index={props.index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <span>
                        {props.extra.name} ({props.extra.price})$
                    </span>
                    <span>
                        
                    </span>
                </div>
            )}
        </Draggable>
    )
}

export default Items
