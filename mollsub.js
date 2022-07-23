import { Builder, By, Key, until } from "selenium-webdriver";
import { loopThroughSongs } from "./utils/utils.js";

import { Key as TonalKey } from "@tonaljs/tonal";
import { ChordType } from "@tonaljs/tonal";
import { Chord } from "@tonaljs/tonal";

let errorRetries = 0;

export const main = (searchTerm) => {
    return new Promise((resolve, reject) => {
        let driver = new Builder().forBrowser("chrome").build();
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
                            return main(searchTerm)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch(() => {
                                    console.log("FAILED");
                                });
                        });
                    })
                    .then(async () => {
                        console.log("Cookies clicked!");
                        await driver.sleep(2000);

                        //TODO click the recomended song
                        //TODO THIS SHOULD BE CONDITIONAL
                        let recomendedSong = await driver.findElements(By.className("apm19lh l1kpohop"));
                        console.log(recomendedSong[1]);
                        return recomendedSong[1].click();

                        // Click on chord view
                        //TODO MAKE THIS CONDITIONAL - A CHOISE BY THE USER IF IT WANTS MOLLSUB FIND MODE OR NOT
                        let chordView = await driver.findElements(By.className("tuxs61x b1g4bi0i b69i0zi b136ilgh")).catch(() => {
                            return main(searchTerm);
                        });

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
                                return main(searchTerm)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch(() => {
                                        console.log("FAILED");
                                    });
                            });

                        return songKey.getAttribute("class");
                    })
                    .then((keyName) => {
                        // Get the actual key of the song
                        key = keyName.split("-")[1];
                        console.log("Key:", key);

                        if (key.includes("min")) {
                            reject("NOT MOLLSUB");

                            throw new Error("\n" + chosenSong + " is in minor!");
                        }
                    })
                    .then(async () => {
                        console.log("Chordview clicked!");
                        await driver.sleep(1000);

                        // If it cant find the chords, we try again with next song
                        let chordGrid = await driver.findElement(By.xpath("//div[starts-with(@class, 'chords cvhfkdk barlength')]")).catch(() => {
                            errorRetries++;

                            // Call recursive function to find the next song
                            return main(searchSongName)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch(() => {
                                    console.log("FAILED");
                                });
                        });
                        let chordArray = [];

                        let jobs = [];

                        await driver.sleep(1000);
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
                            .then(async () => {
                                console.log("done");
                                await driver.sleep(1000);

                                // Filterts out duplicates
                                let uniqueArray = chordArray.filter(function (item, pos) {
                                    return chordArray.indexOf(item) == pos;
                                });
                                // console.log("unique array: ", uniqueArray);

                                // Finds the subdominant chord of the key and make it minor
                                // All dominant chords in every major key is major, so therefore we spilt on major an add
                                //min to get the subdominant chord
                                let subdominant = TonalKey.majorKey(key.split("_")[0]).chords[3].split("maj")[0] + "min";
                                //console.log("Subdominant:", subdominant);

                                // A list of all the extended chords of the subdominant minor chord
                                let extended = Chord.extended(subdominant);

                                // Push the subdominant chord to the list of extended chords so it checks it as well
                                //TODO: BUG! format in extended is not the same as in uniqueArray!!
                                //TODO: BUG! format in extended is not the same as in uniqueArray!!
                                //TODO: BUG! format in extended is not the same as in uniqueArray!!
                                //TODO: BUG! format in extended is not the same as in uniqueArray!!
                                extended.push(subdominant);
                                //console.log("extended array", extended);

                                // Loop through the extended chords and find the ones that are in the uniqueArray
                                let isMollsub = false;

                                for (let i = 0; i < extended.length; i++) {
                                    if (uniqueArray.includes(extended[i])) {
                                        console.log(chosenSong + "Is MOLLSUB!!");
                                        isMollsub = true;
                                        //resolve("MOLLSUB");
                                        //driver.quit();
                                    }
                                }

                                if (isMollsub) {
                                    resolve("MOLLSUB");

                                    await driver.wait(5000);
                                } else {
                                    reject("NOT MOLLSUB");

                                    await driver.wait(5000);
                                }
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        //reject(err);
                        // driver.quit();
                    })
            );
        });
    });
};

main("we are");
