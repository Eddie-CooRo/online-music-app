const mongoose = require('mongoose');


var SongSchema = new mongoose.Schema({
    name: String,
    desc: String,
    genre: [String],
    label: [String],
    lyrics: [String],
    releaseData: Date,
    url: String,
    cover: String,
    album: { type: Number, default: -1 },
    tag:[String]
});

var ArtistSchema = new mongoose.Schema({
    name: String,
    desc: String,
    songs: [{
        rel: String, // For example: Singer | Writter | Composer ...        
        song: SongSchema
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model("Artist", ArtistSchema);