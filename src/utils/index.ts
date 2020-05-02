import { GAME_HEIGHT } from "../constants";

export const getInvertedY = (val: number) => GAME_HEIGHT - val

export const invertYs = (obj: any) => {
    if (obj.y){
        obj.y = getInvertedY(obj.y)
    }
    if (typeof obj === 'object'){
        Object.values(obj).forEach(child => invertYs(child))
    }
}