import React,{useState, useEffect} from 'react'
// Data
import PlayerListDataExample from 'Data/PlayerListData'
// Components
import Table from 'react-bootstrap/Table'
import CircularProgress from '@material-ui/core/CircularProgress'

const PointsTable = (props) => {

    const dataType = props.data
    const tableTitle = props.title

    const [playerListData, setplayerListData] = useState(PlayerListDataExample)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("https://kachiis-rest.herokuapp.com/api/fpl_players_refresh")
        .then(response => response.json())
        .then(playerDataFromServer => {
            setplayerListData(playerDataFromServer)
            setIsLoading(false)
        })
        .catch(err => console.log(err))
    },[])
    
    const singlePlayer = playerListData[0]
    
    const GameWeeks = singlePlayer.matches.map(
        (match) => <th>GW{match.gameweek}</th>
    )

    const numberOfMatchDays = singlePlayer.matches.length;
    const numberOfPlayers = playerListData.length;
    const averageOfAllTotals = playerListData.map(
        (player) => player.points_total).reduce((a, b) => a + b) / numberOfPlayers

    const allOfThePointsScored = [];
    const allOfTheAverages = [];
    
    for (let y=0; y < numberOfMatchDays; y++) {
        for (let x=0; x < playerListData.length; x++) {
            if (dataType === "points_total" ) {
                allOfThePointsScored.push(playerListData[x].matches[y].points_total);
            } else {
                allOfThePointsScored.push(playerListData[x].matches[y].game_week_points);
            }
        }
    }
    
    for (let i=0; i < allOfThePointsScored.length; i += numberOfPlayers) {
        allOfTheAverages.push(
            allOfThePointsScored.slice(i, i + numberOfPlayers)
            .reduce((a, b) => a + b) /numberOfPlayers
        )
    } 
        
    const playerGameWeeks = playerListData.map((player, index) => {
        
        const playersWeek = player.matches.map((matchweek, index) => {
            
            const renderType = dataType === "points_total" ? 
                matchweek.points_total : 
                matchweek.game_week_points
                
            const renderLogic = renderType >= allOfTheAverages[player.matches.indexOf(matchweek)] ? 
            "good" : 
            "bad"
            
            return (
                <td className={`${renderLogic}-week`} key={index}>
                    {dataType === "points_total" ? 
                        matchweek.points_total : 
                        matchweek.game_week_points
                    }
                </td>
            )
        })

        const renderTotalLogic = player.points_total > averageOfAllTotals ? "good": "bad"
        
        return (
            <tr key={index}>
                <td className="player-rank rank-name">{playerListData.indexOf(player) + 1}</td>
                <td className="player-name rank-name">{player.player_name}</td>
                {playersWeek}
                { dataType === "points_total" ?
                    <></>:
                    <td className={`${renderTotalLogic}-week`}>
                        {player.points_total}
                    </td>
                }
            </tr>
        )
    })
    
    const displayAverages = allOfTheAverages.map(
        (average, index) => <td key={index}>{average.toFixed(1)}</td>
    )

    const renderTable = isLoading ? (
            <CircularProgress />
        ) : (
        <>
            <h2>{tableTitle}</h2>
            <Table responsive>
                <tbody>
                    <tr>
                        <th className="player-rank rank-name">Rank</th>
                        <th className="player-name rank-name">Players</th>
                        
                        {GameWeeks}
                        { dataType === "points_total" ?
                            <></>:
                            <th>Total</th>
                        }
                    </tr>
                    {playerGameWeeks}
                    <tr>
                        <td className="player-rank rank-name">-</td>
                        <td className="player-name rank-name">Average</td>
                        {displayAverages}
                        { dataType === "points_total" ?
                            <></>:
                            <td>{averageOfAllTotals.toFixed(1)}</td>
                        }
                    </tr>
                </tbody>
            </Table>
        </>

    )
    
    return (
        <div className="table-container">
            {renderTable}
        </div>
    )

}

export default PointsTable