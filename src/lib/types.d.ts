/** HOW TO JS DOC
 * https://swyxkit.netlify.app/how-to-add-jsdoc-typechecking-to-sveltekit
 * https://fettblog.eu/typescript-jsdoc-superpowers/
 */


export type Character = {
    name: string,
    defaultTrackName: string
}

export type Track = {
    id: string,
    name: string
}

export type TrackListItem = {
    trackName: string,
    characterNames: string[]
}

export type Scene = {
    id: string,
    name: string,
    trackList: TrackListItem[]
}

export type Table = {
    tracks: Track[],
    scenes: Scene[],
    characters: Character[]
}

export type DropZoneInfo = {
    sceneName: string,
    trackName: string
}

export type SelectedHeader = {} | {
    type: 'track' | 'scene',
    name: string
}

/** `location === '__pool__' | <trackName> | <sceneName>` */
export type CharacterInHand = {
    name: string,
    location: '__pool__' | string
}