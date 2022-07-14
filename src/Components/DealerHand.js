import React from 'react'

export default function DealerHand(props){

    return(
        <div className='card--wrapper'>
            <p className='card--symbol'>{props.card}</p>
        </div>
    )
}