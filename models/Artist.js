const mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({
    name: String,
    desc: String,
    rels: [{ rel:String, rel_id:Number }],
    songs: [{
        rel: String, // For example: Singer | Writter | Composer ...        
        song: SongId
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model("Artist", ArtistSchema);