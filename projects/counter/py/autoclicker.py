from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait as wait

with Chrome() as driver:
  driver.get("https://hwtam.github.io/projects/counter/main.html")
  wait(driver, 10).until(lambda x: (x.find_element(By.ID, "counter").text != ""))  # wait for firebase to return the init value of #counter
  for i in range(10):
    driver.find_element(By.ID, 'button').click()