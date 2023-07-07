# BizReach/cd-users-baddies

## Iteration 01 - Review & Retrospect

 * When: June 16th, 2023
 * Where: Online - Discord call 

## Process - Reflection

BizReach is an online platform used to connect nearby mobile businesses to customers in need of their services. In this file, we will discuss our insights into the first sprint of creating BizReach. We will discuss our plan before the sprint, our plan during the sprint, and how we can improve our plan for the next sprint.

#### Decisions that turned out well

1. Creating teams: Tasks such as creating the routing between web pages were done by a group of 2 or 3 (The task is demonstrated by the navbar functionality).  Creating teams proved to be a great decision because our diverse skill sets led to improved problem-solving and better team performance. 

2. Clear Communication: Establishing clear and effective communication channels reduces misunderstandings and fosters collaboration. This proved to be a success during this sprint when we discovered a bug within the save profile feature. We were able to ping each member and fix the bug within the hour.

3. Agile Methodology:  By utilizing an agile development process we are able to stay organized and collaborate effortlessly. This proved was a successful decision because during this sprint everyone was able to work on their own individual tasks without any interruptions.

#### Decisions that did not turn out as well as we hoped

1. Choosing Functionality over UI Design: We had prioritized making our website functional with many working features. However, we neglected the front-end design. In retrospect, we all agree we should have made the website visually attractive.

2. Changing tech stack soon: We wish we had changed our tech stack much sooner (We will explain more about this issue in the next section). If we changed our tech stack before sprint 1 started, we could've had more time to improve our UI designs and many of our backend issues.


#### Planned changes

1. Tech Stack changed: A major part of why we started developing our website late is that originally we had planned to use Flutter to create an App for our platform. Since then, we changed to using FERN stack (Firebase, Express, React, Node) because learning FERN stack would be more practical to us rather than Flutter since most of us already know Flutter.

2. Jira issues: Our original Jira account for BizReach was giving us major issues with Github. We spend about a week waiting for Jira admins to provide us with a solution but it never happened. So, we had to create a new one to fix all of our problems.

## Product - Review

#### Goals and/or tasks that were met/completed:

1. SignUp / Google Auth: This is the first task we decided to tackle. We need to complete this first because it would make the flow of our project much easier to follow. [Biz-4](https://bizreach2023.atlassian.net/jira/software/projects/BIZ/boards/1/backlog?selectedIssue=BIZ-4 "Biz-4") and [Biz-24](https://bizreach2023.atlassian.net/jira/software/projects/BIZ/boards/1/backlog?selectedIssue=BIZ-21 "Biz-24") refer to the tickets of this task.

2. Creating a Navbar: This task was not originally part of the iteration plan but we decided to add this feature because it would be much easier for us to create other pages. [Biz-35](https://bizreach2023.atlassian.net/jira/software/projects/BIZ/boards/1/backlog?selectedIssue=BIZ-35 "Biz-35") refers to the ticket of the completed task.

3. Posting and accepting gigs: This task was also not part of our original iteration plan but we decided to implement the functionality of it because it is a major part of our platform. [Biz-37](https://bizreach2023.atlassian.net/jira/software/projects/BIZ/boards/1/backlog?selectedIssue=BIZ-37 "Biz-37") refers to the ticket that indicates this task being completed.

4. Editing Profile Page: Creating a functional Profile Page was not part of our iteration plan. We had decided to do it in this plan because it was a feature that is very simple to implement. We want to implement all the functionality components first so we can fix any issues we encounter with them as time goes on. 

5. Sign out: This task was completed very quickly and turned out to be a great addition because it allowed us to test Google auth vigorously. [Biz-34](https://bizreach2023.atlassian.net/jira/software/projects/BIZ/boards/1/backlog?selectedIssue=BIZ-34 "Biz-34") refers to the ticket that shows the task was completed.

Our goal for this sprint was to only add the SignUp / Google Auth and Sign-out features. We are happy with the progress we made during this sprint because we introduced many difficult features. 

#### Goals and/or tasks that were planned but not met/completed:


1. Frontend: The only task we didn't get to complete as much as we like is our frontend design. The reason our goal for this task was not met is that we prioritized the functionality of our website over the design.


## Meeting Highlights

Going into the next iteration, our main insights are:

1. Create UI prototypes: We will create meaningful designs for how we want our website to look. Our platform will look very visually appealing during our next sprint demo.

2. Chakra UI: Since CSS is not the ideal language we want to use to create a sleek and modern website. We have decided we will learn and use Chakra UI to ensure our platform looks good.

3. Error Checking: Although our website is mostly functional, there are some cases where the website does not do anything. For example, if a user wanted to post but provided an invalid address, the service wouldn't be posted and no error would show up. In this case we would like to in form the user what went wrong and how they can fix it.
