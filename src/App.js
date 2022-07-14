import './App.css';
import React from 'react'
import DealerHand from './Components/DealerHand'
import PlayerHand from './Components/PlayerHand'

export default function App() {

    // Deck arrays
    const suits = ["spades", "diamonds", "clubs", "hearts"]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    // State for game
    const [gameStatus, setGameStatus] = React.useState(true)

    // State for deck
    const [available, setAvailable] = React.useState(getDeck())

    // State for winner
    const [winner, setWinner] = React.useState("")

    // State for dealer and player
    const [dealerHand, setDealerHand] = React.useState([])
    const [dealerScore, setDealerScore] = React.useState(0)
    const [playerHand, setPlayerHand] = React.useState([])
    const [playerScore, setPlayerScore] = React.useState(0)

    // State for directions
    const [directions, setDirections] = React.useState(false)

    // State for betting
    const [coins, setCoins] = React.useState(300)
    const [currentBet, setCurrentBet] = React.useState(0)

    // useEffect for checking if dealer needs more cards
    React.useEffect(() => {
        if(dealerScore !== 0 && dealerScore < 16){ // Dealer's hand is less than 16
            console.log("dealer needed new card")
            let card = getRandomIndex()
            setDealerHand(prevHand => [...prevHand, available[card]]) // Grab new card if true
            setDealerScore(prevScore => prevScore += available[card].Count)
        }
        
    },[dealerScore]) // Check and do above code everytime dealer score changes.... Just at start of game

    // useEffect for checking if player busted or hit black jack
    React.useEffect(() => {
        if(playerScore !== 0){
            if(playerScore > 21){
                setWinner("Busted! You lost")
                setGameStatus(false)
                console.log("player busted after drawing")
            } else if(playerScore === 21){
                hold()
                console.log("player got black jack")
            }
            
        }
    }, [playerScore]) // Check everytime player score changes (at start and every draw)

    // useEffect for creating starting decks for player and dealer
    React.useEffect(() => {
        if(winner === ""){
            setHand()
        }
       
    }, [gameStatus])
    
    // Function to create deck use above arrays
    function getDeck()
    {
        let deck = new Array()
        let count = 0
        let ace = false
        for(let i = 0; i < suits.length; i++)
        {
            for(let x = 0; x < values.length; x++)
            {
                if(values[x] === "J" || values[x] === "Q" || values[x] === "K"){
                    count = 10
                    ace = false
                } else if (values[x] === "A"){
                    count = 1
                    ace = true
                } else {
                    count = Number(values[x])
                    ace = false
                }
                let card = {Value: values[x], Suit: suits[i], Key: values[x] + suits[i], Count: count, Ace: ace}
                deck.push(card)
            }
        }

        return deck;
    }
    

    function setHand(){
        // Create hand for dealer (2 cards)
        let firstDealer = getRandomIndex()
        setDealerHand([available[firstDealer]])
        setDealerScore(prevScore => prevScore += available[firstDealer].Count)
        let secondDealer = getRandomIndex()
        setDealerHand(prevHand => [...prevHand, available[secondDealer]])
        setDealerScore(prevScore => prevScore += available[secondDealer].Count)
        
        
        // Create hand for player (2 cards)
        let firstPlayer = getRandomIndex()
        let secondPlayer = getRandomIndex()
        setPlayerHand([available[firstPlayer]])
        setPlayerScore(prevScore => prevScore += available[firstPlayer].Count)
        
        setPlayerHand(prevHand => [...prevHand, available[secondPlayer]])
        setPlayerScore(prevScore => prevScore += available[secondPlayer].Count)
        
    }
    
    // Function for creating random index to be used to grab a card 
    function getRandomIndex(){
        return Math.floor(Math.random() * available.length)
    }

    // Function for every draw player makes
    function draw(){
        let card = getRandomIndex()
        setPlayerHand(prevHand => [...prevHand, available[card]])
        setPlayerScore(prevScore => prevScore += available[card].Count)
        
    }

    // Function for starting game over
    function startOver(){
        setGameStatus(true)
        setDealerHand([])
        setPlayerHand([])
        setDealerScore(0)
        setPlayerScore(0)
        setWinner("")
        setCurrentBet(0)
    }
    
    
    // Function for when player holds
    function hold(){
        
        if(playerScore !== 0 && dealerScore !== 0){
            if(playerScore <= 21 && dealerScore > 21){
                console.log("You won, the dealer busted")
                setWinner("You won, the dealer busted")
                setCoins(prevCoins => prevCoins + (currentBet * 2))
                
            } else if(playerScore < 21 && playerScore > dealerScore){
                console.log("You won, you had a better hand than the dealer")
                setWinner("You won, you had a better hand than the dealer")
                setCoins(prevCoins => prevCoins + (currentBet * 2))
                
            } else if (playerScore === 21 && dealerScore < 21){
                console.log("You have black jack")
                setWinner("You have black jack")
                setCoins(prevCoins => prevCoins + (currentBet * 2))
                
            } else if(dealerScore === 21 && playerScore !== 21){
                console.log("You lost, the dealer has black jack")
                setWinner("You lost, the dealer has black jack")
                
            }else if(playerScore === 21 && dealerScore === 21){
                console.log("Push, the money is replaced")
                setWinner("Push, the money is replaced")
                setCoins(prevCoins => prevCoins + currentBet)
                
            } else if(dealerScore < 21 && playerScore < dealerScore){
                console.log("You lost, dealer had a better hand")
                setWinner("You lost, dealer had a better hand")
                
            }
            setGameStatus(false)
        }
    }


    // Function for toggling directions
    function toggleDirections(){
        setDirections(prevText => !prevText)
    }

    // Function for placing bet
    function bet(){
        setCoins(prevCoins => prevCoins - 10)
        setCurrentBet(prevBet => prevBet + 10)
    }

    
    // Mapping for player hand to send to PlayHand component

    const playerDeck = playerHand.map(card => (
        <PlayerHand 
            card={card.Value}
            key={card.Key} // Key is value + suit
            suit={card.Suit} // Do not know if suit will be used
        />
    ))
    
    // Mapping for dealer hand to send to DealerHand component
    const dealerDeck = dealerHand.map(card => (
        <DealerHand 
            card={card.Value}
            key={card.Key} 
            suit={card.Suit}
            gameStatus={gameStatus}
        />
    ))
    console.log( "dealer hand: ")
    console.log(dealerHand)
    console.log( "dealer score: " + dealerScore)
    console.log( "player hand: ")
    console.log(playerHand)
    console.log( "player score: " + playerScore)
        
    return (
        <div className='game--container'>
            
            <div className='dealer--container'>
                <h2 className='player--title'>Dealer</h2>
                {winner !== "" ? <p className='score--dealer'>{dealerScore}</p> :
                <p className='score--dealer'>???</p>
                }
                {gameStatus ? 
                    <div className='cards--container--dealer'>
                        {dealerDeck}
                    </div> : 
                    <div className='cards--container--dealer--end'>
                        {dealerDeck}
                    </div>
                    }
                
                <div className='btn--container'>
                    <div className='sprite--container'>
                        <img className='bulldog' src='https://piskel-imgstore-b.appspot.com/img/1cfb8961-03a7-11ed-85f9-b7dbbd446297.gif' />
                    </div>
                </div>
            </div>
            <div className='menu'>
                <div className='betting--container'>
                    <h3 className='coins'>Coins: {coins}</h3>
                    <button className='bet' onClick={bet}>Bet</button>
                </div>
                {winner !== "" && <h2 className='winner'>{winner}</h2>}
                <div className='directions--container' onClick={toggleDirections}>
                    {directions ? 
                    <ul className='directions--list'>
                        <li>Get closer to 21 than the dealer</li>
                        <li>Make sure to not go over 21</li>
                        <li>An Ace is 1</li>
                    </ul> : 
                
                    "How to play"}
                </div>
            </div>
            <div className='player--container'>
                <h2 className='player--title'>Player</h2>
                <p className='score'>{playerScore}</p>
                <div className='cards--container'>
                    {playerDeck}
                </div>
                {winner === "" ? <div className='btn--container'>
                    <button onClick={draw}>Draw</button>
                    <button onClick={hold}>Hold</button>
                </div> : <button onClick={startOver}>Start</button>}
                
            </div>

            
        </div>
    );
}


