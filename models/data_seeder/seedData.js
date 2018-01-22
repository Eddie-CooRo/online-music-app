import UserModel from "../User"
var User = UserModel
import SongModel from "../Song"
var Song = SongModel
import PlaylistModel from "../Playlist"
var Playlist = PlaylistModel
import ArtistModel from "../Artist"
var Artist = ArtistModel
import AlbumModel from "../Album"
var Album = AlbumModel
const Chance = require('chance');
const chance = new Chance();
const db = require('../../DataBase/DataBaseConnection')
module.exports.createBase = () => {
    console.log("Filing Collections");
    let saves = [];
    let ids = { User: [], Artist: [], Song: [], Playlist: [], Album: [] };

    for (let i = 0; i < 100; i++) {
        let password = chance.word().toString();
        saves.push(
            new Promise((reslolve, reject) => {
                User.save({
                    emailValidated: chance.bool(),
                    username: chance.word(),
                    password: password,
                    raw_password: password,
                    email: chance.email(),
                    avatar: chance.avatar({ protocol: 'https', fileExtension: 'jpg' }),
                    nickname: chance.first(),
                    gender: chance.gender(),
                    age: chance.age(),
                }, (err, saved) => {
                    if (err) {
                        reject(err)
                    }
                    reslolve(saved)

                });
            }).then((saved) => {
                ids.User.push(saved)
                console.log("User saved")

            }).catch((err) => {
                console.log("User save failed")
                console.log(err)
                return err
            })
        )
    }
    for (let i = 0; i < 100; i++) {
        saves.push(
            new Promise((resolve, reject) => {
                Artist.save({
                    name: chance.first(),
                    avatar: chance.avatar({ protocol: 'https', fileExtension: 'jpg' }),
                    age: chance.age(),
                    description: chance.paragraph(),
                }, (err, saved) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(saved)
                })
            }).then((saved) => {
                ids.Artist.push(saved)
                console.log("Artist saved")

            }).catch((err) => {
                console.log(err)
                console.log("Artist save failed")
                return err

            })
        );
    }

    for (let i = 0; i < 10; i++) {
        let genre = [];
        for (let i = 0; i < 10; i++) {
            if (chance.bool()) {
                genre.push(chance.word());
            }
        }
        saves.push(
            new Promise((resolve, reject) => {
                Song.save({
                    name: chance.word(),
                    description: chance.paragraph(),
                    genre: genre,
                    lyrics: [chance.paragraph()],
                    releaseDate: chance.date(),
                    cover: chance.avatar({ protocol: 'https', fileExtension: 'jpg' }),
                }, (err, saved) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(saved)
                })
            }).then((saved) => {
                ids.Artist.push(saved)
                console.log("Song saved")

            }).catch((err) => {
                console.log(err)
                console.log("Song save failed")
                return err

            })
        );
    }

    for (let i = 0; i < 50; i++) {
        let expireDate = chance.bool() ? chance.date() : null;
        saves.push(
            new Promise((resolve, reject) => {
                Playlist.save({
                    name: chance.word(),
                    cover: chance.avatar({ protocol: 'https', fileExtension: 'jpg' }),
                    private: chance.bool(),
                    expireDate: expireDate
                }, (err, saved) => {
                    if (err) {
                   reject(err)
                    }
                    resolve(saved)
                })
            }).then((saved) => {
                ids.Artist.push(saved)
                console.log("Playlist saved")

            }).catch((err) => {
                console.log(err)
                console.log("Playlist save failed")
                return err

            })
        );
    }
    for (let i = 0; i < 100; i++) {
        saves.push(
    new Promise((resolve,reject) =>{
            Album.save({
                name: chance.word(),
                cover: chance.avatar({ protocol: 'https', fileExtension: 'jpg' }),
                releaseDate: chance.date()
            },  (err, saved) => {
                if (err) {
               reject(err)
                }
                resolve(saved)
            })
        }).then((saved) => {
            ids.Artist.push(saved)
           console.log("Album saved")

       }).catch((err) => {
           console.log(err)
           console.log("Album save failed")
           return err

       })
        );
    }

    return {saves:saves,ids:ids}
}




module.exports.MakeRels = (data) => {
    console.log("Making Relations");
    var a = []

    let userCount = data.User.length;
    let songCount = data.Song.length;
    let albumCount = data.Album.length;
    let artistCount = data.Artist.length;
    let playlistCount = data.Playlist.length;

    // Adding songs to Albums
    for (let i = 0; i < songCount; i++) {
        let currentSong = data.Song[i]
        let random = chance.integer({ min: 0, max: albumCount - 1 });
        let album = data.Album[random]
        let albumId = album.id;
        db.rel.create(currentSong.id, 'Song_Of', albumId, (err, rel) => {
            if (err) {
                console.log("SongOf_Album Update Failed");
                return err
            }
            console.log("SongOf_Album Added");
            return true
        });
    }
    //     // // Adding Song_Of_Artist Rels
    // let possibleSongRels = ['Singer', 'Producer', 'Writter', 'Composer'];
    // for (let i = 0; i < artistCount; i++) {
    //     for (let j = 0; j < chance.integer({ min: 0, max: 100 }); j++) {
    //         let random = chance.integer({ min: 0, max: songCount - 1 });
    //         let song = Song[i]
    //         let songId = song.id;
    //         songs[j] = {
    //             rel: possibleSongRels[chance.integer({ min: 0, max: possibleSongRels.length - 1 })],
    //             song: songId
    //         }
    //     }

    //     let currentArtist = await Artist.find().limit(-1).skip(i);
    //     currentArtist = currentArtist[0];
    //     currentArtist.songs = songs;
    //     Artist.update({ _id: currentArtist._id }, currentArtist).then((w) => {
    //         console.log("Artist Song Added");
    //     }).catch((err) => {
    //         console.log("Artist Song Update Failed");
    //     });
    // }

}

// // module.exports.makeRelations = async function () {
//     let userCount = await User.count();
//     let songCount = await Song.count();
//     let albumCount = await Album.count();
//     let artistCount = await Artist.count();
//     let playlistCount = await Playlist.count();

// //     // // Adding songs to Albums
// //     for (let i = 0; i < songCount; i++) {
// //         let currentSong = await Song.find().limit(-1).skip(i);
// //         currentSong = currentSong[0];
// //         let random = chance.integer({ min: 0, max: albumCount - 1 });
// //         let album = await Album.findOne().skip(random);
// //         let albumId = album._id;

// //         Song.update({ _id: currentSong._id }, {
// //             albumId: albumId
// //         }).then((w) => {
// //             console.log("Song Album Added");
// //         }).catch((err) => {
// //             console.log("Song Album Update Failed");
// //         });
// //     };

// //     // // Adding song-artist Rels
// //     let possibleSongRels = ['Singer', 'Producer', 'Writter', 'Composer'];
// //     for (let i = 0; i < artistCount; i++) {
// //         let songs = [];
// //         for (let j = 0; j < chance.integer({ min: 0, max: 100 }); j++) {
// //             let random = chance.integer({ min: 0, max: songCount - 1 });
// //             let song = await Song.findOne().skip(random);
// //             let songId = song._id;
// //             songs[j] = {
// //                 rel: possibleSongRels[chance.integer({ min: 0, max: possibleSongRels.length - 1 })],
// //                 song: songId
// //             }
// //         }

// //         let currentArtist = await Artist.find().limit(-1).skip(i);
// //         currentArtist = currentArtist[0];
// //         currentArtist.songs = songs;
// //         Artist.update({ _id: currentArtist._id }, currentArtist).then((w) => {
// //             console.log("Artist Song Added");
// //         }).catch((err) => {
// //             console.log("Artist Song Update Failed");
// //         });
// //     }
// //     // // Adding album-artist Rels
// //     let possibleAlbumRels = ['Singer', 'Producer', 'Writter', 'Composer'];
// //     for (let i = 0; i < artistCount; i++) {
// //         let albums = [];
// //         for (let j = 0; j < chance.integer({ min: 0, max: 100 }); j++) {
// //             let random = chance.integer({ min: 0, max: albumCount - 1 });
// //             let album = await Song.findOne().skip(random);
// //             let albumId = album._id;
// //             albums[j] = {
// //                 rel: possibleAlbumRels[chance.integer({ min: 0, max: possibleAlbumRels.length - 1 })],
// //                 album: albumId
// //             }
// //         }

// //         let currentArtist = await Artist.find().limit(-1).skip(i);
// //         currentArtist = currentArtist[0];
// //         currentArtist.albums = albums;
// //         Artist.update({ _id: currentArtist._id }, currentArtist).then((w) => {
// //             console.log("Artist Album Added");
// //         }).catch((err) => {
// //             console.log("Artist Album Update Failed");
// //         });
// //     }
// //     // Adding songs to playlists
// //     for (let i = 0; i < playlistCount; i++) {
// //         let tracks = [];
// //         for (let j = 0; j < chance.integer({ min: 0, max: 100 }); j++) {
// //             let random = chance.integer({ min: 0, max: songCount - 1 });
// //             let song = await Song.findOne().skip(random);
// //             let songId = song._id;
// //             tracks[j] = songId;
// //         }
// //         let currentPl = await Playlist.find().limit(-1).skip(i);
// //         currentPl = currentPl[0];
// //         currentPl.tracks = tracks;
// //         Playlist.update({ _id: currentPl._id }, currentPl).then((w) => {
// //             console.log("Playlist Track Added");
// //         }).catch((err) => {
// //             console.log("Playlist Track Update Failed");
// //         });
// //     }

// //     // Adding user created playlists
// //     let possibleUserSongRels = ['listened', 'liked', 'hated'];
// //     for (let i = 0; i < userCount; i++) {
// //         let currentUser = await User.findOne().skip(i);
// //         let playlists = [];
// //         for (let j = 0; j < chance.integer({ min: 0, max: 20 }); j++) {
// //             let random = chance.integer({ min: 0, max: playlistCount - 1 });
// //             let pl = await Playlist.findOne().skip(random);
// //             let plId = pl._id;
// //             playlists[j] = plId;
// //         }

// //         let fArtists = [];
// //         for (let j = 0; j < chance.integer({ min: 0, max: 50 }); j++) {
// //             let random = chance.integer({ min: 0, max: artistCount - 1 });
// //             let artist = await Artist.findOne().skip(random);
// //             let artistId = artist._id;
// //             fArtists[j] = artistId;
// //         }

// //         let songRels = [];

// //         for (let j = 0; j < chance.integer({ min: 0, max: 100 }); j++) {
// //             let random = chance.integer({ min: 0, max: songCount - 1 });
// //             let song = await Song.findOne().skip(random);
// //             let songsId = song._id;
// //             songRels[j] = {
// //                 rel: possibleUserSongRels[chance.integer({ min: 0, max: possibleUserSongRels.length - 1 })],
// //                 songId: songsId
// //             }
// //         }

// //         currentUser.playlists = playlists;
// //         currentUser.followedArtists = fArtists;
// //         currentUser.songsRels = songRels;

// //         User.update({ _id: currentUser._id }, currentUser).then((w) => {
// //             console.log(w);
// //             console.log("User Relations Added");
// //         }).catch((err) => {
// //             console.log("User Relations Update Failed");
// //         });
// //     }

// //     return "done";
// // }
