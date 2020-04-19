import { GAME_HEIGHT } from "../constants";

export const getInvertedY = (val: number) => GAME_HEIGHT - val

export const invertYs = (obj: any) => {
    if (obj.y){
        console.log('FOUND Y', obj)
        obj.y = getInvertedY(obj.y)
    }
    if (typeof obj === 'object'){
        Object.values(obj).forEach(child => invertYs(child))
    }
}