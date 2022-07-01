export const loopThroughSongs = async (songList) => {
    return new Promise(async (resolve, reject) => {
        let foundChordified = false;
        let i = 0;

        while (!foundChordified) {
            await songList[i].getText().then((song) => {
                // If the song does not have chords, skip it
                if (!song.includes("CHORDIFY NOW")) {
                    foundChordified = true;
                    resolve([song, songList[i]]);

                    // Prevents infinite loop
                } else if (i > 50) {
                    return;

                    // Increment i
                } else {
                    i++;
                }
            });
        }
    });
};
