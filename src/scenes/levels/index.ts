import l1 from './1'
import l2 from './2'
const levels = [l1, l2]
export const getLevel = () => {
    //@ts-ignore
    const expLevel = window.level
    if (expLevel)
        return { lives: 3, level: JSON.parse(expLevel), score: 0}
    const userGameState = localStorage.getItem('userGameState')
    if (userGameState && userGameState.length)
    {
        try {
            const state = JSON.parse(userGameState)    
            return {
                lives: state.lives || 3,
                level: levels[state.level || 0],
                score: state.score || 0
            }
        } catch (error) {
            
        }
        

    }
    return  {
        lives: 3,
        score: 0,
        level: levels[0],
        
    }
}
