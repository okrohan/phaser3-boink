// import level from './level1'
import leveld from './experimental'
// import { invertYs } from '../../utils';

export const getLevel = () => {
    // const cloned = JSON.parse(JSON.stringify(level))
    // invertYs(cloned)
    //@ts-ignore
    const expLevel = window.level
    if (expLevel)
        return JSON.parse(expLevel)
    return leveld
}
