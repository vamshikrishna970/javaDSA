import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import java.util.List;
import java.util.Scanner;

public class JobApplicationAutomator {
    private WebDriver driver;
    private WebDriverWait wait;

    public JobApplicationAutomator() {
        // Set up Chrome options for headless mode
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        // Initialize WebDriver
        this.driver = new ChromeDriver(options);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void loginToLinkedIn(String email, String password) {
        driver.get("https://www.linkedin.com/login");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("username"))).sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[@type='submit']")).click();
        // Wait for login to complete
        wait.until(ExpectedConditions.urlContains("feed"));
    }

    public void searchJobs(String keywords, String location) {
        driver.get("https://www.linkedin.com/jobs/");
        WebElement searchBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@placeholder='Search jobs']")));
        searchBox.sendKeys(keywords);
        WebElement locationBox = driver.findElement(By.xpath("//input[@placeholder='Search location']"));
        locationBox.clear();
        locationBox.sendKeys(location);
        driver.findElement(By.xpath("//button[@type='submit']")).click();
        // Wait for results
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("jobs-search-results-list")));
    }

    public void applyToJobs(int maxApplications) {
        List<WebElement> jobCards = driver.findElements(By.className("job-card-container"));
        int applied = 0;
        for (WebElement jobCard : jobCards) {
            if (applied >= maxApplications) break;
            try {
                jobCard.click();
                // Wait for job details to load
                wait.until(ExpectedConditions.presenceOfElementLocated(By.className("jobs-apply-button")));
                WebElement applyButton = driver.findElement(By.className("jobs-apply-button"));
                if (applyButton.isDisplayed() && applyButton.isEnabled()) {
                    applyButton.click();
                    // Handle application form (simplified)
                    fillApplicationForm();
                    applied++;
                    System.out.println("Applied to job " + applied);
                }
            } catch (Exception e) {
                System.out.println("Failed to apply to a job: " + e.getMessage());
            }
            // Rate limiting
            try {
                Thread.sleep(5000); // 5 seconds delay
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private void fillApplicationForm() {
        // Simplified form filling - in reality, this would be more complex
        try {
            List<WebElement> inputs = driver.findElements(By.tagName("input"));
            for (WebElement input : inputs) {
                if (input.getAttribute("type").equals("text") && input.isDisplayed()) {
                    input.sendKeys("Sample Answer");
                }
            }
            // Submit
            WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(),'Submit')]"));
            if (submitButton.isDisplayed()) {
                submitButton.click();
            }
        } catch (Exception e) {
            System.out.println("Error filling form: " + e.getMessage());
        }
    }

    public void close() {
        if (driver != null) {
            driver.quit();
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter LinkedIn email: ");
        String email = scanner.nextLine();
        System.out.print("Enter LinkedIn password: ");
        String password = scanner.nextLine();
        System.out.print("Enter job keywords: ");
        String keywords = scanner.nextLine();
        System.out.print("Enter location: ");
        String location = scanner.nextLine();
        System.out.print("Enter max applications: ");
        int maxApps = Integer.parseInt(scanner.nextLine());

        JobApplicationAutomator automator = new JobApplicationAutomator();
        try {
            automator.loginToLinkedIn(email, password);
            automator.searchJobs(keywords, location);
            automator.applyToJobs(maxApps);
        } finally {
            automator.close();
        }
    }
}