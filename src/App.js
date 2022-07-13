import './App.css';
import React from 'react'
import DealerHand from './Components/DealerHand'

export default function App() {

    // Deck arrays
    const suits = ["spades", "diamonds", "clubs", "hearts"]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    // State for game
    const [gameStatus, setGameStatus] = React.useState(true)

    // State for deck
    const [available, setAvailable] = React.useState(getDeck())

    // State for dealer
    const [dealerHand, setDealerHand] = React.useState([])
    const [dealerScore, setDealerScore] = React.useState(0)
    
    // Function to create deck
    function getDeck()
    {
        let deck = new Array()
        let count = 0
        for(let i = 0; i < suits.length; i++)
        {
            for(let x = 0; x < values.length; x++)
            {
                if(values[x] === "J" || values[x] === "Q" || values[x] === "K"){
                    count = 10
                } else if (values[x] === "A"){
                    count = 1
                } else {
                    count = Number(values[x])
                }
                let card = {Value: values[x], Suit: suits[i], Key: values[x] + suits[i], Count: count}
                deck.push(card)
            }
        }

        return deck;
    }


    React.useEffect(() => {
        setHand()
    }, [gameStatus])

    React.useEffect(() => {
        if(dealerScore !== 0 && dealerScore < 16){
            let card = getRandomIndex()
            setDealerHand(prevHand => [...prevHand, available[card]])
            setDealerScore(prevScore => prevScore += available[card].Count)
        }
        
    },[dealerScore])

    function setHand(){
        let first = getRandomIndex()
        let second = getRandomIndex()
        setDealerHand([available[first]])
        setDealerScore(prevScore => prevScore += available[first].Count)
        setDealerHand(prevHand => [...prevHand, available[second]])
        setDealerScore(prevScore => prevScore += available[second].Count)
        
    }

    

    const dealerDeck = dealerHand.map(card => (
        <DealerHand 
            card={card.Value}
            key={card.Key}
        />
    ))
    

    function getRandomIndex(){
        return Math.floor(Math.random() * available.length)
    }

    


    


    

    return (
        <div>
            {dealerDeck}
            
        </div>
    );
}


