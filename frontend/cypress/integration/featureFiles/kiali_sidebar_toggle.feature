Feature: Sidebar toggle 

User opens the Overview page and toggles the main sidebar.

  Background:
    Given user is at administrator perspective
    And user opens the overview page

  @sidebar-toggle
  Scenario: Toggle the sidebar
    Then user sees the sidebar 
    When user presses the navigation toggle button
    Then user cannot see the sidebar
    When user presses the navigation toggle button again
    Then user can see the sidebar again
