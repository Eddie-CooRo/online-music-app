export const typeDefs = `
    type Query {
        node(id:ID!): Node
        search(text: String!): [Node]
        viewer: User
    }

    interface Node{
        id: ID!
    }

    type UserSongEdge{
        node: Song
        cursor: String

    }
    type PageInfo{
        startCursor : String
        endCursor: String
        hasNextPage : Boolean
        hasPreviousPage: Boolean
    }
    type UserSongConnection{
        edges: [UserSongEdge]
        pageInfo: PageInfo
    }
    


    type User implements Node {
        id: ID!
        emailValidated: Boolean
        username: String!
        email: String!
        nickname: String
        avatar: String
        age: Int
        playlists: [Playlist]
        getSongs(first: Int,last: Int,before: String, after: String ): UserSongConnection
        followedArtists: [Artist]
        listenedSongs: [Song]
        likedSongs: [Song]
        hatedSongs: [Song]
    }
    
    type Playlist implements Node {
        id: ID!
        name: String
        tracks: [Song]
        cover: String
        private: Boolean
        expireDate: String
        trackCount: Int
    }

    type Album implements Node {
        id: ID!
        name: String
        cover: String
        releaseDate: String
        songs: [Song]
        artist: [Artist]
    }

    type Song implements Node {
        id: ID!
        name: String!
        description: String
        lyrics: [String]
        genre: [String]
        releaseDate: String
        url: String
        cover: String
        album: Album
        tags: [String]
        artists: [Artist]
        playlist: [Playlist]
    }

    type Artist implements Node {
        id: ID!
        name: String
        description: String
        avatar: String
        age: Int
        SingerType: String
        albums: [Album]
        songs: [Song]
    }

`