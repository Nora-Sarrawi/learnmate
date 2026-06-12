# LearnMate

A cloud-native, serverless platform that connects students with private tutors and lets them book study sessions without the usual mess of WhatsApp threads and phone tag.

Students find tutors, book sessions, and upload session-related files. Tutors set their availability and get notified automatically when a booking comes in. Everything runs serverless on AWS — no servers to provision or maintain.

## Why it exists

Booking a private tutor today is disorganized. Students struggle to find the right tutor and lock in a time, while tutors juggle availability and requests manually over chat apps. That leads to double-bookings, missed sessions, and no single source of truth. LearnMate replaces the manual back-and-forth with a structured booking flow backed by a real database and automated notifications.

## Features

- **Authentication** — separate login for students and tutors via Amazon Cognito
- **Tutor discovery** — students browse available tutors
- **Session booking** — book a session against a tutor's open availability
- **Availability management** — tutors define and update when they're free
- **File uploads** — attach homework, questions, or materials to a session
- **Booking notifications** — tutors are notified automatically when a booking is created

## Architecture

LearnMate is fully serverless. There's no always-on backend — compute runs only when a request hits it.

| Service | Role |
|---|---|
| **Amazon Cognito** | User authentication and identity (students + tutors) |
| **Amazon API Gateway** | Single entry point; routes frontend requests to backend functions |
| **AWS Lambda** | Business logic — handles booking, uploads, and notification triggers |
| **Amazon DynamoDB** | Stores users, tutors, and bookings |
| **Amazon S3** | Stores uploaded files (PDFs, images) |
| **Amazon SNS** | Sends notifications when a booking is created |

### Request flow

```
Frontend → Cognito (auth) → API Gateway → Lambda → DynamoDB / S3
                                              │
                                              └──→ SNS → Tutor notification
```

## How it works

1. The user logs in as a student or a tutor (Cognito).
2. The student browses available tutors.
3. The student books a study session.
4. Lambda writes the booking to DynamoDB.
5. SNS notifies the tutor about the new booking.
6. The student uploads any files related to the session (stored in S3).

## Tech stack

- **Auth:** Amazon Cognito
- **API layer:** Amazon API Gateway
- **Compute:** AWS Lambda
- **Database:** Amazon DynamoDB
- **File storage:** Amazon S3
- **Notifications:** Amazon SNS

## Cost

Estimated at roughly **$8.17/month** based on expected request volume and storage, calculated with the AWS Pricing Calculator. Cost scales with usage — you pay for what runs, not for idle servers.

## Team — Group 404

- Suzan Aqraa
- Dana Morgan
- Nora Sarrawi

---

*Cloud-Native Serverless Architecture project.*
