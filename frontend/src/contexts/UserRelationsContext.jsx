/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import apiClient, { getImageUrl } from '../helpers/apiClient'
import { useAuth } from './AuthContext'

const UserRelationsContext = createContext(null)

const resolveTrackId = (trackOrId) => {
  if (trackOrId == null) return null
  if (typeof trackOrId === 'object') {
    return (
      trackOrId.trackId ??
      trackOrId.id ??
      trackOrId?.track?.trackId ??
      trackOrId?.track?.id ??
      null
    )
  }
  const numeric = Number(trackOrId)
  return Number.isNaN(numeric) ? trackOrId : numeric
}

const resolveArtistId = (artistOrId) => {
  if (artistOrId == null) return null
  if (typeof artistOrId === 'object') {
    return artistOrId.artistId ?? artistOrId.id ?? null
  }
  const numeric = Number(artistOrId)
  return Number.isNaN(numeric) ? artistOrId : numeric
}

const normalizeTrack = (track) => {
  if (!track || typeof track !== 'object') return null
  const trackId = track.trackId ?? track.id
  const artistName =
    track.artist?.artistName ??
    track.artist?.name ??
    track.artist ??
    track.artistName ??
    (Array.isArray(track.artists)
      ? track.artists
          .map((artistItem) => artistItem.name || artistItem.artistName || '')
          .filter(Boolean)
          .join(', ')
      : null)

  const albumTitle =
    track.album?.title ??
    track.album?.name ??
    track.album ??
    track.albumTitle ??
    track.albumName ??
    null

  const coverPath =
    track.coverUrl ??
    track.cover_url ??
    track.imagePath ??
    track.image_path ??
    track.image ??
    track.album?.coverUrl ??
    track.album?.cover_url ??
    track.album?.imagePath ??
    track.album?.image_path ??
    null

  return {
    ...track,
    id: trackId,
    trackId,
    title: track.title ?? track.name ?? track.trackTitle ?? 'Unknown Track',
    artist: artistName,
    album: albumTitle,
    duration: track.duration ?? track.durationText ?? track.length ?? null,
    filePath: track.filePath ?? track.file_path ?? track.streamUrl ?? null,
    coverUrl: coverPath,
    image: coverPath ? getImageUrl(coverPath) : track.image ?? null
  }
}

const normalizeArtist = (artist) => {
  if (!artist || typeof artist !== 'object') return null
  const artistId = artist.artistId ?? artist.id
  const profilePath =
    artist.profileUrl ??
    artist.profile_url ??
    artist.imagePath ??
    artist.image_path ??
    artist.image ??
    null

  return {
    ...artist,
    id: artistId,
    artistId,
    artistName: artist.artistName ?? artist.name ?? 'Unknown Artist',
    name: artist.name ?? artist.artistName ?? 'Unknown Artist',
    profileUrl: profilePath,
    image: profilePath ? getImageUrl(profilePath) : artist.image ?? null
  }
}

export const UserRelationsProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const [likedTracks, setLikedTracks] = useState([])
  const [followedArtists, setFollowedArtists] = useState([])
  const [relationsLoading, setRelationsLoading] = useState(false)

  const derivedUserId = useMemo(() => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.userId != null) return parsed.userId
        if (parsed?.id != null) return parsed.id
      }
    } catch (error) {
      console.error('Failed to parse stored user for relations:', error)
    }
    const fallbackId = localStorage.getItem('userId')
    return fallbackId != null ? Number(fallbackId) : null
  }, [user])

  const buildAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const fetchLikedTracks = useCallback(async () => {
    if (!isAuthenticated || derivedUserId == null) {
      setLikedTracks([])
      return []
    }
    try {
      const { data } = await apiClient.get(
        `/users/${derivedUserId}/liked-tracks`,
        {
          headers: buildAuthHeaders()
        }
      )
      const payload = Array.isArray(data) ? data : data?.tracks ?? []
      const normalized = payload
        .map(normalizeTrack)
        .filter((track) => track?.trackId != null)
      setLikedTracks(normalized)
      return normalized
    } catch (error) {
      console.error('Failed to fetch liked tracks:', error)
      return []
    }
  }, [buildAuthHeaders, derivedUserId, isAuthenticated])

  const fetchFollowedArtists = useCallback(async () => {
    if (!isAuthenticated || derivedUserId == null) {
      setFollowedArtists([])
      return []
    }
    try {
      const { data } = await apiClient.get(
        `/users/${derivedUserId}/followed-artists`,
        {
          headers: buildAuthHeaders()
        }
      )
      const payload = Array.isArray(data) ? data : data?.artists ?? []
      const normalized = payload
        .map(normalizeArtist)
        .filter((artist) => artist?.artistId != null)
      setFollowedArtists(normalized)
      return normalized
    } catch (error) {
      console.error('Failed to fetch followed artists:', error)
      return []
    }
  }, [buildAuthHeaders, derivedUserId, isAuthenticated])

  const refreshRelations = useCallback(async () => {
    if (!isAuthenticated || derivedUserId == null) {
      setLikedTracks([])
      setFollowedArtists([])
      return
    }
    setRelationsLoading(true)
    try {
      await Promise.all([fetchLikedTracks(), fetchFollowedArtists()])
    } finally {
      setRelationsLoading(false)
    }
  }, [
    derivedUserId,
    fetchFollowedArtists,
    fetchLikedTracks,
    isAuthenticated
  ])

  useEffect(() => {
    if (isAuthenticated && derivedUserId != null) {
      refreshRelations()
    } else {
      setLikedTracks([])
      setFollowedArtists([])
    }
  }, [derivedUserId, isAuthenticated, refreshRelations])

  const likeTrack = useCallback(
    async (trackOrId) => {
      const trackId = resolveTrackId(trackOrId)
      if (!isAuthenticated || derivedUserId == null || trackId == null) {
        throw new Error('Unable to like track without user context')
      }
      await apiClient.post(
        `/users/${derivedUserId}/like/${trackId}`,
        {},
        { headers: buildAuthHeaders() }
      )

      if (typeof trackOrId === 'object') {
        const normalized = normalizeTrack(trackOrId)
        if (normalized) {
          setLikedTracks((prev) => {
            if (
              prev.some(
                (track) => Number(track.trackId) === Number(normalized.trackId)
              )
            ) {
              return prev
            }
            return [normalized, ...prev]
          })
          return normalized
        }
      }
      await fetchLikedTracks()
      return null
    },
    [buildAuthHeaders, derivedUserId, fetchLikedTracks, isAuthenticated]
  )

  const unlikeTrack = useCallback(
    async (trackOrId) => {
      const trackId = resolveTrackId(trackOrId)
      if (!isAuthenticated || derivedUserId == null || trackId == null) {
        throw new Error('Unable to unlike track without user context')
      }
      await apiClient.delete(
        `/users/${derivedUserId}/unlike/${trackId}`,
        {
          headers: buildAuthHeaders()
        }
      )
      setLikedTracks((prev) =>
        prev.filter((track) => Number(track.trackId) !== Number(trackId))
      )
      return trackId
    },
    [buildAuthHeaders, derivedUserId, isAuthenticated]
  )

  const followArtist = useCallback(
    async (artistOrId) => {
      const artistId = resolveArtistId(artistOrId)
      if (!isAuthenticated || derivedUserId == null || artistId == null) {
        throw new Error('Unable to follow artist without user context')
      }
      await apiClient.post(
        `/users/${derivedUserId}/follow/${artistId}`,
        {},
        { headers: buildAuthHeaders() }
      )
      if (typeof artistOrId === 'object') {
        const normalized = normalizeArtist(artistOrId)
        if (normalized) {
          setFollowedArtists((prev) => {
            if (
              prev.some(
                (artist) =>
                  Number(artist.artistId) === Number(normalized.artistId)
              )
            ) {
              return prev
            }
            return [normalized, ...prev]
          })
          return normalized
        }
      }
      await fetchFollowedArtists()
      return null
    },
    [buildAuthHeaders, derivedUserId, fetchFollowedArtists, isAuthenticated]
  )

  const unfollowArtist = useCallback(
    async (artistOrId) => {
      const artistId = resolveArtistId(artistOrId)
      if (!isAuthenticated || derivedUserId == null || artistId == null) {
        throw new Error('Unable to unfollow artist without user context')
      }
      await apiClient.delete(
        `/users/${derivedUserId}/unfollow/${artistId}`,
        {
          headers: buildAuthHeaders()
        }
      )
      setFollowedArtists((prev) =>
        prev.filter((artist) => Number(artist.artistId) !== Number(artistId))
      )
      return artistId
    },
    [buildAuthHeaders, derivedUserId, isAuthenticated]
  )

  const likedTrackIds = useMemo(
    () =>
      new Set(
        likedTracks.map((track) => Number(track.trackId ?? track.id)).filter(
          (id) => !Number.isNaN(id)
        )
      ),
    [likedTracks]
  )

  const followedArtistIds = useMemo(
    () =>
      new Set(
        followedArtists
          .map((artist) => Number(artist.artistId ?? artist.id))
          .filter((id) => !Number.isNaN(id))
      ),
    [followedArtists]
  )

  const isTrackLiked = useCallback(
    (trackOrId) => {
      const trackId = resolveTrackId(trackOrId)
      if (trackId == null) return false
      const numeric = Number(trackId)
      return likedTrackIds.has(Number.isNaN(numeric) ? trackId : numeric)
    },
    [likedTrackIds]
  )

  const isArtistFollowed = useCallback(
    (artistOrId) => {
      const artistId = resolveArtistId(artistOrId)
      if (artistId == null) return false
      const numeric = Number(artistId)
      return followedArtistIds.has(Number.isNaN(numeric) ? artistId : numeric)
    },
    [followedArtistIds]
  )

  const value = useMemo(
    () => ({
      likedTracks,
      followedArtists,
      relationsLoading,
      refreshRelations,
      fetchLikedTracks,
      fetchFollowedArtists,
      likeTrack,
      unlikeTrack,
      followArtist,
      unfollowArtist,
      isTrackLiked,
      isArtistFollowed,
      userId: derivedUserId
    }),
    [
      derivedUserId,
      fetchFollowedArtists,
      fetchLikedTracks,
      followArtist,
      followedArtists,
      isArtistFollowed,
      isTrackLiked,
      likeTrack,
      likedTracks,
      relationsLoading,
      refreshRelations,
      unfollowArtist,
      unlikeTrack
    ]
  )

  return (
    <UserRelationsContext.Provider value={value}>
      {children}
    </UserRelationsContext.Provider>
  )
}

export const useUserRelations = () => {
  const context = useContext(UserRelationsContext)
  if (!context) {
    throw new Error(
      'useUserRelations must be used within a UserRelationsProvider'
    )
  }
  return context
}


