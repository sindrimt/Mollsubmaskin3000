import { Builder, By, Key, until } from "selenium-webdriver";
import { loopThroughSongs } from "./utils/utils.js";

const main = (searchTerm) => {
    let driver = new Builder().forBrowser("chrome", "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta").build();
    let chosenSong;

    driver.get(`https://chordify.net/search/${searchTerm}`).then(async () => {
        return (
            driver
                // Find all search results
                .findElements(By.className("apm19lh l1kpohop"))
                .then(async (res) => {
                    return loopThroughSongs(res);
                })
                // Get the song and its element
                .then((res) => {
                    chosenSong = res[0].split("youtube")[0];
                    let chosenSongElement = res[1];

                    return chosenSongElement.click();
                })
                .then(async (res) => {
                    console.log("Before cookie");
                    await driver.sleep(2000);
                    // Waits until the accpect cookies shows
                    //await driver.wait(until.elementLocated(By.className("fc-button fc-cta-consent fc-primary-button")), 1000);

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
                    console.log("Chordview clicked!");
                    await driver.sleep(1000);

                    let chordGrid = await driver.findElement(By.className("chords cvhfkdk barlength-4"));
                    //let test = chordGrid.findElements(By.xpath("div[@class='chord']"));
                    let chordArray = [];

                    let jobs = [];

                    // Finds all the chords only for the grid elements marked as chords
                    //TODO done gets called before all the jobs has finished
                    return chordGrid
                        .findElements(By.xpath("//div[@class = 'chord']//span[starts-with(@class, 'chord-label')]"))
                        .then((chord) => {
                            for (let i = 0; i < chord.length; i++) {
                                jobs.push(
                                    chord[i].getAttribute("class").then((chordName) => {
                                        chordArray.push(chordName);
                                    })
                                );
                            }

                            return Promise.all(jobs);
                        })
                        .then(() => {
                            console.log(chordArray);
                            console.log("done");
                        })
                        .catch((err) => console.log(err));

                    // console.log(chordArray);
                    //let test = await yeet.findElement(By.className("chord"));

                    // console.log(yeet);
                    // console.log(yeet.length);

                    // // Filter out all griditems containing a chord
                    // let filteredGrid = yeet?.filter(async (gridItem) => {
                    //     let chord = await chordGrid.findElement(By.className("chord"));

                    //     return chord === "chord";
                    // });

                    // console.log(filteredGrid.length);

                    //console.log(yeet);
                })
                .catch((err) => {
                    console.log("ERRORROOROROROO!");
                    console.log(err);

                    driver.quit();
                })
        );
    });
};

main("we are");
