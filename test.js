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

let uniqueArray = chordArray.filter(function (item, pos) {
    return chordArray.indexOf(item) == pos;
});

console.log(uniqueArray);

//console.log(Key.majorKey("C").chords[3]);

//console.log(Chord.get("Fmaj7#9#11"));
console.log(Chord.extended("Cmin"));

let subdominant = Key.majorKey("G").chords[3][0] + "min";
console.log(subdominant);

if (chordArray.includes(subdominant)) {
    console.log("MOLLSUBB!");
} else {
    console.log("Ikke mollsub :(");
}
