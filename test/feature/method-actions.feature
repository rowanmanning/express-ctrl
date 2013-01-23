
Feature: Method-Based Actions
    As a developer
    I want to be able to route different HTTP methods to different controller actions
    So that I can respond differently depending on user intent

    Scenario: GET request to method actions page
        When I GET the method actions page
        Then the request should be successful
        And I should see "Got!"

    Scenario: POST request to method actions page
        When I POST to the method actions page
        Then the request should be successful
        And I should see "Posted!"
