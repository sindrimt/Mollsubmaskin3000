import { Builder, By, Key, until } from "selenium-webdriver";
import { loopThroughSongs } from "./utils/utils.js";

import { Key as TonalKey } from "@tonaljs/tonal";
import { ChordType } from "@tonaljs/tonal";
import { Chord } from "@tonaljs/tonal";

let errorRetries = 0;

let searchSongName = "desparado eagles";

const main = (searchTerm) => {
    let driver = new Builder().forBrowser("chrome", "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta").build();
    let chosenSong;
    let key;

    driver.get(`https://chordify.net/search/${searchTerm}`).then(async () => {
        await driver.sleep(1000);
        return (
            driver
                // Find all search results
                .findElements(By.className("apm19lh l1kpohop"))
                .then(async (res) => {
                    // Loop through search results until it finds a chordified song
                    return loopThroughSongs(res, errorRetries);
                })
                // Get the song and its element
                .then((res) => {
                    // We split on youtube to get the title of the song
                    chosenSong = res[0].split("youtube")[0];
                    let chosenSongElement = res[1];

                    return chosenSongElement.click();
                })
                .then(async (res) => {
                    console.log("Before cookie");

                    // Waits until the accpect cookies shows
                    await driver.wait(until.elementLocated(By.className("fc-button fc-cta-consent fc-primary-button")), 1000);

                    // Click accept cookies button
                    let acceptCookies = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button"));

                    //TODO: make the error retry into a function in utils
                    return acceptCookies.click().catch(() => {
                        errorRetries++;

                        // Call recursive function to find the next song
                        return main(searchSongName);
                    });
                })
                .then(async () => {
                    console.log("Cookies clicked!");
                    await driver.sleep(2000);

                    // Click on chord view
                    let chordView = await driver.findElements(By.className("tuxs61x b1g4bi0i b69i0zi b136ilgh"));

                    return chordView[1].click();
                })
                .then(async () => {
                    // Identify the key of the song
                    await driver.sleep(1000);
                    let songKey = await driver
                        .findElement(By.xpath("//span[@class = 'tboi1b']//span[starts-with(@class, 'label-')]"))

                        // If the song does not have chords, even though it says "CHORDIFY NOW", we skip it and choose the next song on the list
                        .catch(() => {
                            errorRetries++;

                            // Call recursive function to find the next song
                            return main(searchSongName);
                        });

                    return songKey.getAttribute("class");
                })
                .then((keyName) => {
                    // Get the actual key of the song
                    key = keyName.split("-")[1];
                    console.log("Key:", key);

                    if (key.includes("min")) {
                        throw new Error("Key is minor");
                    }
                })
                .then(async () => {
                    console.log("Chordview clicked!");
                    await driver.sleep(1000);

                    // If it cant find the chords, we try again with next song
                    let chordGrid = await driver.findElement(By.className("chords cvhfkdk barlength-4")).catch(() => {
                        errorRetries++;

                        // Call recursive function to find the next song
                        return main(searchSongName);
                    });
                    let chordArray = [];

                    let jobs = [];

                    // Finds all the chords only for the grid elements marked as chords
                    return chordGrid
                        .findElements(By.xpath("//div[@class = 'chord']//span[starts-with(@class, 'chord-label')]"))
                        .then((chord) => {
                            for (let i = 0; i < chord.length; i++) {
                                jobs.push(
                                    chord[i].getAttribute("class").then((chordName) => {
                                        chordArray.push(chordName.split("label-")[1]?.replace("_", ""));
                                    })
                                );
                            }
                            return Promise.all(jobs);
                        })
                        .then(() => {
                            console.log("done");

                            // Filterts out duplicates
                            let uniqueArray = chordArray.filter(function (item, pos) {
                                return chordArray.indexOf(item) == pos;
                            });

                            // Finds the subdominant chord of the key and make it minor
                            let subdominant = TonalKey.majorKey("G").chords[3][0] + "min";

                            // A list of all the extended chords of the subdominant minor chord
                            let extended = Chord.extended(subdominant);

                            // Push the subdominant chord to the list of extended chords so it checks it as well
                            extended.push(subdominant);

                            // Loop through the extended chords and find the ones that are in the uniqueArray
                            for (let i = 0; i < extended.length; i++) {
                                if (uniqueArray.includes(extended[i])) {
                                    console.log(chosenSong + "Is MOLLSUB!!");
                                }
                            }
                        });
                })
                .catch((err) => {
                    console.log(err);
                    driver.quit();
                })
        );
    });
};

main(searchSongName);
