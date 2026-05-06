import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Audio } from 'expo-av'
import { api } from './api'

export type PlayerTrack = {
  id: string
  title: string
  duration: number | null
  featArtists?: string
  album: {
    id: string
    title: string
    coverUrl: string | null
    artist: { id: string; name: string }
  }
}

type State = {
  track: PlayerTrack | null
  queue: PlayerTrack[]
  queueIndex: number
  isPlaying: boolean
  position: number
  duration: number
  mono: boolean
  shuffle: boolean
}

type Action =
  | { type: 'LOAD'; queue: PlayerTrack[]; index: number }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_PROGRESS'; position: number; duration: number }
  | { type: 'SET_MONO'; mono: boolean }
  | { type: 'NEXT' }
  | { type: 'PREV_TRACK' }
  | { type: 'TOGGLE_SHUFFLE' }

const initial: State = {
  track: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  position: 0,
  duration: 0,
  mono: false,
  shuffle: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD': {
      const track = action.queue[action.index] ?? null
      return { ...state, queue: action.queue, queueIndex: action.index, track, position: 0, duration: 0 }
    }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.playing }
    case 'SET_PROGRESS':
      return { ...state, position: action.position, duration: action.duration }
    case 'SET_MONO':
      return { ...state, mono: action.mono }
    case 'NEXT': {
      if (state.queue.length === 0) return state
      let next: number
      if (state.shuffle) {
        do { next = Math.floor(Math.random() * state.queue.length) } while (next === state.queueIndex && state.queue.length > 1)
      } else {
        next = state.queueIndex + 1
        if (next >= state.queue.length) return state
      }
      return { ...state, queueIndex: next, track: state.queue[next]!, position: 0, duration: 0 }
    }
    case 'PREV_TRACK': {
      const prev = Math.max(0, state.queueIndex - 1)
      return { ...state, queueIndex: prev, track: state.queue[prev]!, position: 0, duration: 0 }
    }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle }
    default:
      return state
  }
}

export type PlayerContextValue = State & {
  play: (queue: PlayerTrack[], index?: number) => void
  pause: () => void
  resume: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
  toggleMono: () => void
  toggleShuffle: () => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const soundRef = useRef<Audio.Sound | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    void Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    })
  }, [])

  async function loadTrack(track: PlayerTrack, mono: boolean, seekTo = 0) {
    const prev = soundRef.current
    soundRef.current = null
    if (prev) await prev.unloadAsync().catch(() => null)

    const { sound } = await Audio.Sound.createAsync(
      { uri: api.trackStreamUri(track.id, mono) },
      { shouldPlay: false, progressUpdateIntervalMillis: 500 },
    )
    soundRef.current = sound

    if (seekTo > 0) {
      await sound.setPositionAsync(seekTo * 1000).catch(() => null)
    }

    await sound.playAsync().catch(() => null)
    dispatch({ type: 'SET_PLAYING', playing: true })

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return
      const dur = status.durationMillis
        ? status.durationMillis / 1000
        : (stateRef.current.track?.duration ?? 0)
      dispatch({ type: 'SET_PROGRESS', position: status.positionMillis / 1000, duration: dur })
      if (status.didJustFinish) dispatch({ type: 'NEXT' })
    })
  }

  const monoSeekRef = useRef(0)
  useEffect(() => {
    if (!state.track) return
    const seekTo = monoSeekRef.current
    monoSeekRef.current = 0
    loadTrack(state.track, state.mono, seekTo).catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.track?.id, state.mono])

  const ctx: PlayerContextValue = {
    ...state,
    play(queue, index = 0) {
      dispatch({ type: 'LOAD', queue, index })
    },
    pause() {
      void soundRef.current?.pauseAsync().then(() =>
        dispatch({ type: 'SET_PLAYING', playing: false }),
      )
    },
    resume() {
      void soundRef.current?.playAsync().then(() =>
        dispatch({ type: 'SET_PLAYING', playing: true }),
      )
    },
    next() {
      dispatch({ type: 'NEXT' })
    },
    prev() {
      const { position, queueIndex, duration } = stateRef.current
      if (position > 3 || queueIndex === 0) {
        void soundRef.current?.setPositionAsync(0)
        dispatch({ type: 'SET_PROGRESS', position: 0, duration })
      } else {
        dispatch({ type: 'PREV_TRACK' })
      }
    },
    seek(seconds) {
      void soundRef.current?.setPositionAsync(seconds * 1000)
    },
    toggleMono() {
      monoSeekRef.current = stateRef.current.position
      dispatch({ type: 'SET_MONO', mono: !stateRef.current.mono })
    },
    toggleShuffle() {
      dispatch({ type: 'TOGGLE_SHUFFLE' })
    },
  }

  return React.createElement(PlayerContext.Provider, { value: ctx }, children)
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
