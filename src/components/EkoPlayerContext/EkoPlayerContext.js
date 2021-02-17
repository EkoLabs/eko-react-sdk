import React, {createContext, useState} from 'react';

/**
 * The EkoPlayerContext allows all children to access the {@link https://github.com/EkoLabs/eko-js-sdk#ekoplayer|EkoPlayer} instance. 
 *
 * @export
 * @member module:contexts#EkoPlayerContext
 * @type {React.Context}
 *
 */

const EkoPlayerContext = createContext();
function EkoPlayerProvider(props) {
    const [playerState, setPlayerState] = useState({});
    return (
        <EkoPlayerContext.Provider value={{playerState, setPlayerState}}>
            {props.children}
        </EkoPlayerContext.Provider>
    );
}

export {EkoPlayerContext, EkoPlayerProvider};
