import { Key } from "@tonaljs/tonal";
import { ChordType } from "@tonaljs/tonal";
import { Chord } from "@tonaljs/tonal";

let chordArray = [
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Dsmaj",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Cmaj",
    "Gmaj",
    "Bmin",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Cmaj",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Cmaj",
    "Gmaj",
    "Bmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
    "Bmaj",
    "Gmaj",
    "Cmaj",
    "Cmin",
    "Gmaj",
];

// Filterts out duplicates
let uniqueArray = chordArray.filter(function (item, pos) {
    return chordArray.indexOf(item) == pos;
});

// Finds the subdominant chord of the key and make it minor
let subdominant = Key.majorKey("G").chords[3][0] + "min";

// A list of all the extended chords of the subdominant minor chord
let extended = Chord.extended(subdominant);

// Push the subdominant chord to the list of extended chords so it checks it as well
extended.push(subdominant);

// Loop through the extended chords and find the ones that are in the uniqueArray
for (let i = 0; i < extended.length; i++) {
    if (uniqueArray.includes(extended[i])) {
        console.log("MOLLSUB");
    }
}
