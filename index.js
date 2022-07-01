import { Builder, By, Key, until } from "selenium-webdriver";
import { loopThroughSongs } from "./utils/utils.js";

const main = (searchTerm) => {
    let driver = new Builder().forBrowser("chrome").build();
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
                    await new Promise((r) => r, 2000);
                    // Waits until the accpect cookies shows
                    // await driver.wait(until.elementLocated(By.className("fc-button fc-cta-consent fc-primary-button")), 1000);

                    // Click accept cookies button
                    let acceptCookies = await driver.findElement(By.className("fc-button fc-cta-consent fc-primary-button"));

                    return acceptCookies.click();
                })
                .then(async () => {
                    console.log("Cookies clicked!");
                    await driver.sleep(2000);

                    // Click on chord view
                    let chordView = driver.findElement(By.className("tuxs61x b1g4bi0i b69i0zi b136ilgh"));
                    return chordView.click();
                })
                .then(() => {
                    console.log("Chordview clicked!");
                })
                .catch((err) => {
                    console.log("ERRORROOROROROO!");
                    console.log(err);
                })
        );
    });
};

main("despacito");
