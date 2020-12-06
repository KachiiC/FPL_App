import React from 'react'
import PlayerListData from '../Data/PlayerListData'

const PointsScoredTable = () => {
    
    const GameWeeks = PlayerListData[0].matches.map((match, index) => 
    <th key={index}>GW{match.gameweek}</th>)

    const allOfThem = [];
    const allOfTheAverages = [];

    for (let x = 0; x < PlayerListData[0].matches.length - 1; x++) {
        for (let y = 0; y < PlayerListData[0].matches.length - 1; y++) {
            allOfThem.push(PlayerListData[y].matches[x].game_week_points);
        }
    }

    for (let i = 0; i < allOfThem.length; i += PlayerListData[0].matches.length) {
        allOfTheAverages.push(
            allOfThem.slice(i, i + PlayerListData[0].matches.length)
            .reduce((a, b) => a + b) / PlayerListData.length
        );
    }

    const displayAverages = allOfTheAverages.map((average) => <td>{average}</td>)
    const averageTransferPoints = PlayerListData.map((player) => player.matches.map((match) => match.game_week_transfers_cost).reduce((a,b) => a+b)).reduce((a,b) => a+b)/PlayerListData.length
    const totalAverage = Math.floor(allOfTheAverages.reduce((a,b) => a+b)) - averageTransferPoints
    
    const sortedByPoints = PlayerListData.sort((a, b) => b.matches[b.matches.length - 1].points_total - a.matches[a.matches.length - 1].points_total)

    const playerGameWeeks = sortedByPoints.map((player, index) => {

        const playersWeek = player.matches.map((matchweek, index) => {
            
            const renderLogic = matchweek.game_week_points > allOfTheAverages[player.matches.indexOf(matchweek)] ?
            <td className="good-week">{matchweek.game_week_points}</td> : <td className="bad-week">{matchweek.game_week_points}</td>

            return (
                <>
                    {renderLogic}
                </>
            )
        })

        const totalPoints = player.matches.map((matchweek) =>  matchweek.game_week_points).reduce((a,b) => a+b)
        const totalLost = player.matches.map((matchweek) =>  matchweek.game_week_transfers_cost).reduce((a,b) => a+b)

        return (
            <tr key={index}>
                <td>{PlayerListData.indexOf(player) + 1}</td>
                <td>{player.player_name}</td>
                {playersWeek}
                <td>{totalPoints - totalLost}</td>
            </tr>
        )
    })

    return (
        <div className="table-container">
            <h1>Current Table</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Rank</th>
                        <th>Players</th>
                        {GameWeeks}
                        <th>Total</th>
                    </tr>
                    {playerGameWeeks}
                    <tr>
                        <td>-</td>
                        <td>Average</td>
                        {displayAverages}
                        <td>{totalAverage}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}

export default PointsScoredTable