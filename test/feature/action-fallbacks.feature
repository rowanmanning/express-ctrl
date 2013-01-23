
Feature: Action Fallbacks
    As a developer
    I want to be able to be able to provide a fallback route when a controller does not support a HTTP method
    So that I can provide per-route 405 errors

    Scenario: GET request to action fallbacks page
        When I GET the action fallbacks page
        Then the request should be successful
        And I should see "Got!"

    Scenario: POST request to action fallbacks page
        When I POST to the action fallbacks page
        Then the request should result in a 405 error
        And I should see "Method Not Allowed"
