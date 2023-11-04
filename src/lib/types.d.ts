export type Track = {
    id: string,
    name: string
}

export type Character = {
    name: string,
    defaultTrackName: string
}

export type Scene = {
    id: string,
    name: string,
    trackList: TrackListItem[]
}

export type TrackListItem = {
    trackName: string,
    characterNames: string[]
}

export type Table = {
    tracks: Track[],
    scenes: Scene[],
    characters: Characters[]
}

export type DropZoneInfo = {
    sceneName: string,
    trackName: string
}
