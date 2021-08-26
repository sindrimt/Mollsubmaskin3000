from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


def login(browser):
    browser.get("https://www.instagram.com/")
    # Velger den første knappen på siden (Endre dette senere?)
    acceptAll = browser.find_element_by_css_selector("button")
    acceptAll.click()

    time.sleep(2)

    username = browser.find_element_by_css_selector("[name = 'username']")
    password = browser.find_element_by_css_selector("[name = 'password']")
    login = browser.find_element_by_css_selector("button")

    username.send_keys("saftigmann123")
    password.send_keys("test12345!")
    login.click()

    time.sleep(5)


def Vist_Tag(browser, url):
    sleep_time_long = 5
    sleep_time_short = 2
    browser.get(url)
    time.sleep(sleep_time_long)

    pictures = browser.find_elements_by_css_selector("div[class = '_9AhH0']")

    image_count = 0

    for picture in pictures:
        if image_count >= 10:
            break

        picture.click()
        time.sleep(sleep_time_short)
        try:
            heart = browser.find_element_by_css_selector(
                "[aria-label = 'Like']")
            heart.click()
            time.sleep(sleep_time_short)
        except:
            print("Allerede liked, men går videre, kanskje... :P")

        close = browser.find_element_by_css_selector("[aria-label='Close']")
        close.click()

        time.sleep(sleep_time_short)

        image_count += 1


def main():
    browser = webdriver.Chrome()
    login(browser)

    tags = [
        "programming",
        "katana",
        "programminglife",
        "programmerslife",
        "programmerlife",
        "developerlife",
        "programmers",
    ]

    for tag in tags:
        Vist_Tag(browser, f"https://www.instagram.com/explore/tags/{tag}")


main()
