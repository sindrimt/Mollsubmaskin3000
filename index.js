import { Builder, By, Key, until } from "selenium-webdriver";
import { loopThroughSongs } from "./utils/utils.js";

let errorRetries = 0;

let searchSongName = "creep";

const main = (searchTerm) => {
    let driver = new Builder().forBrowser("chrome", "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta").build();
    let chosenSong;
    let key;

    driver.get(`https://chordify.net/search/${searchTerm}`).then(async () => {
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

                    return acceptCookies.click();
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
                //TODO: call recursion or something to find the next song in the search result

                .then((keyName) => {
                    // Get the actual key of the song
                    key = keyName.split("-")[1];
                    console.log("Key:", key);
                })
                .then(async () => {
                    console.log("Chordview clicked!");
                    await driver.sleep(1000);

                    let chordGrid = await driver.findElement(By.className("chords cvhfkdk barlength-4"));
                    let chordArray = [];

                    let jobs = [];

                    // Finds all the chords only for the grid elements marked as chords
                    return chordGrid
                        .findElements(By.xpath("//div[@class = 'chord']//span[starts-with(@class, 'chord-label')]"))
                        .then((chord) => {
                            for (let i = 0; i < chord.length; i++) {
                                jobs.push(
                                    chord[i].getAttribute("class").then((chordName) => {
                                        chordArray.push(chordName.split("label-")[1]);
                                    })
                                );
                            }
                            return Promise.all(jobs);
                        })
                        .then(() => {
                            //console.log(chordArray);
                            console.log("done");
                        });
                })
                .catch((err) => {
                    console.log("ERRORROOROROROO!");
                    console.log(err);

                    driver.quit();
                })
        );
    });
};

main(searchSongName);
