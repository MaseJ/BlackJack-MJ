import React from 'react'

export default function PlayerHand(props){

    return(
        <div className='card--wrapper'>
            <p className='card--symbol'>{props.card}</p>
        </div>
    )
}